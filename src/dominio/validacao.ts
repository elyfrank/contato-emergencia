import type { z } from "zod";
import { ErroDeDados } from "./erros.ts";
import { nomeDaPagina, pessoaSchema, type Pessoa } from "./pessoa.ts";

/** Um registro ainda não validado e de onde ele veio (para mensagens de erro úteis). */
export interface RegistroBruto {
  readonly origem: string;
  readonly dados: unknown;
}

function descreverProblemas(origem: string, erro: z.ZodError): string[] {
  return erro.issues.map((issue) => {
    const campo = issue.path.length > 0 ? issue.path.join(".") : "(registro)";
    return `${origem} › ${campo}: ${issue.message}`;
  });
}

export function validarPessoa(registro: RegistroBruto): Pessoa {
  const resultado = pessoaSchema.safeParse(registro.dados);
  if (!resultado.success) throw new ErroDeDados(descreverProblemas(registro.origem, resultado.error));
  return resultado.data;
}

/**
 * Valida todos os registros e as regras entre eles (páginas e códigos únicos).
 * Lança um único ErroDeDados com todos os problemas encontrados.
 */
export function validarColecao(registros: readonly RegistroBruto[]): Pessoa[] {
  const problemas: string[] = [];
  const pessoas: Pessoa[] = [];

  for (const registro of registros) {
    const resultado = pessoaSchema.safeParse(registro.dados);
    if (resultado.success) pessoas.push(resultado.data);
    else problemas.push(...descreverProblemas(registro.origem, resultado.error));
  }

  problemas.push(...encontrarDuplicados(pessoas, (p) => p.codigo, "codigo repetido"));
  problemas.push(...encontrarDuplicados(pessoas, nomeDaPagina, "página repetida"));

  if (problemas.length > 0) throw new ErroDeDados(problemas);
  return pessoas;
}

function encontrarDuplicados(
  pessoas: readonly Pessoa[],
  chave: (p: Pessoa) => string,
  descricao: string,
): string[] {
  const vistos = new Set<string>();
  const repetidos = new Set<string>();
  for (const pessoa of pessoas) {
    const valor = chave(pessoa);
    if (vistos.has(valor)) repetidos.add(valor);
    vistos.add(valor);
  }
  return [...repetidos].map((valor) => `${descricao}: ${valor}`);
}
