import { z } from "zod";
import { FORMATO_CODIGO, gerarCodigo } from "./codigo.ts";
import { primeiroNome } from "./nome.ts";
import { slugificar } from "./slug.ts";
import { normalizarTelefone } from "./telefone.ts";

export const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const MAX_CONTATOS = 2;

const textoObrigatorio = (campo: string) =>
  z.string({ error: `${campo} é obrigatório` }).trim().min(1, `${campo} é obrigatório`);

const telefone = z.string({ error: "telefone é obrigatório" }).transform((valor, ctx) => {
  const normalizado = normalizarTelefone(valor);
  if (normalizado === null) {
    ctx.addIssue({
      code: "custom",
      message: `telefone "${valor}" inválido (use DDD + número, ex.: 62 99999-8888)`,
    });
    return z.NEVER;
  }
  return normalizado;
});

export const contatoSchema = z.object({
  nome: textoObrigatorio("nome do contato"),
  relacao: textoObrigatorio("relação (ex.: Mãe, Esposa)"),
  telefone,
});

export const pessoaSchema = z.object({
  nome: textoObrigatorio("nome").refine((n) => slugificar(n).length > 0, "nome precisa ter letras ou números"),
  codigo: z.string({ error: "codigo é obrigatório" }).regex(FORMATO_CODIGO, "codigo inválido"),
  tipoSanguineo: z.enum(TIPOS_SANGUINEOS, {
    error: `tipo sanguíneo deve ser um de: ${TIPOS_SANGUINEOS.join(", ")}`,
  }),
  contatos: z
    .array(contatoSchema, { error: "contatos é obrigatório" })
    .min(1, "informe ao menos 1 contato de emergência")
    .max(MAX_CONTATOS, `no máximo ${MAX_CONTATOS} contatos de emergência`),
  /** Lista vazia = "nenhuma alergia conhecida" (decisão explícita, nunca suposta). */
  alergias: z.array(textoObrigatorio("alergia"), { error: "alergias é obrigatório (use [] se não houver)" }),
});

export type Contato = z.output<typeof contatoSchema>;
export type Pessoa = z.output<typeof pessoaSchema>;

/**
 * Nome do arquivo publicado: "jose-7fk3qa.html".
 * Só o primeiro nome entra na URL, para ela não revelar o sobrenome; o código garante a unicidade.
 */
export function nomeDaPagina(pessoa: Pick<Pessoa, "nome" | "codigo">): string {
  return `${slugificar(primeiroNome(pessoa.nome))}-${pessoa.codigo}.html`;
}

/** Retorna a pessoa com um código novo (diferente do atual), invalidando o link antigo. */
export function comNovoCodigo(pessoa: Pessoa, gerar: () => string = gerarCodigo): Pessoa {
  let codigo = gerar();
  while (codigo === pessoa.codigo) codigo = gerar();
  return { ...pessoa, codigo };
}
