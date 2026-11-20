import { parseArgs } from "node:util";
import { ErroDeDados } from "../dominio/erros.ts";

export const USO = `Uso:
  npm run nova-pessoa -- \\
    --nome "José Blabla" \\
    --sangue O+ \\
    --contato "Maria Blabla;Mãe;(62) 99999-8888" \\
    [--contato "João Blabla;Irmão;62 98888-7777"] \\
    (--alergia "Dipirona" [--alergia "Penicilina"] | --sem-alergias)`;

const SEPARADOR_CONTATO = ";";

/** Dados de cadastro ainda não validados (a validação fica com o schema do domínio). */
export interface DadosCadastro {
  readonly nome: string | undefined;
  readonly tipoSanguineo: string | undefined;
  readonly contatos: { nome: string; relacao: string; telefone: string }[];
  readonly alergias: string[];
}

/**
 * Converte os argumentos da linha de comando em dados de cadastro.
 * Exige que alergias sejam informadas explicitamente — numa página de emergência,
 * "não informado" nunca pode virar "nenhuma alergia".
 */
export function lerArgumentos(argv: readonly string[]): DadosCadastro {
  const { values } = parseArgs({
    args: [...argv],
    strict: true,
    allowPositionals: false,
    options: {
      nome: { type: "string" },
      sangue: { type: "string" },
      contato: { type: "string", multiple: true },
      alergia: { type: "string", multiple: true },
      "sem-alergias": { type: "boolean" },
    },
  });

  const problemas: string[] = [];
  const alergias = values.alergia ?? [];
  const semAlergias = values["sem-alergias"] === true;

  if (semAlergias && alergias.length > 0) problemas.push("use --alergia OU --sem-alergias, não os dois");
  if (!semAlergias && alergias.length === 0) problemas.push("informe as alergias com --alergia, ou --sem-alergias se não houver");

  const contatos = (values.contato ?? []).map((texto, i) => {
    const partes = texto.split(SEPARADOR_CONTATO).map((p) => p.trim());
    if (partes.length !== 3) {
      problemas.push(`--contato #${i + 1} deve ter o formato "Nome;Relação;Telefone" (recebido: "${texto}")`);
    }
    const [nome = "", relacao = "", telefone = ""] = partes;
    return { nome, relacao, telefone };
  });

  if (problemas.length > 0) throw new ErroDeDados(problemas);

  return { nome: values.nome, tipoSanguineo: values.sangue?.toUpperCase(), contatos, alergias };
}
