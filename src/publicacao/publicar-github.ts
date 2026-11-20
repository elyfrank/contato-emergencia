import { ErroDeDados } from "../dominio/erros.ts";
import type { Pessoa } from "../dominio/pessoa.ts";
import type { ExecutorComando } from "./executor.ts";

export interface OpcoesPublicacao {
  readonly nomeSecret: string;
  readonly workflow: string;
}

/** Tamanho máximo de um secret do GitHub. */
const LIMITE_SECRET_BYTES = 48 * 1024;

/**
 * Publica no GitHub Pages: grava os dados no secret e dispara o workflow de deploy.
 * Os dados nunca entram no repositório.
 */
export async function publicarNoGithub(
  pessoas: readonly Pessoa[],
  executor: ExecutorComando,
  { nomeSecret, workflow }: OpcoesPublicacao,
): Promise<void> {
  if (pessoas.length === 0) throw new ErroDeDados(["nenhuma pessoa cadastrada para publicar"]);

  const dados = JSON.stringify(pessoas);
  const tamanho = Buffer.byteLength(dados, "utf8");
  if (tamanho > LIMITE_SECRET_BYTES) {
    throw new ErroDeDados([`dados com ${tamanho} bytes excedem o limite de um secret do GitHub (${LIMITE_SECRET_BYTES})`]);
  }

  await exigirSucesso(
    executor.executar("gh", ["auth", "status"]),
    'GitHub CLI indisponível ou sem login. Instale o "gh" (https://cli.github.com) e rode "gh auth login"',
  );
  await exigirSucesso(executor.executar("gh", ["secret", "set", nomeSecret], dados), `falha ao gravar o secret ${nomeSecret}`);
  await exigirSucesso(executor.executar("gh", ["workflow", "run", workflow]), `falha ao disparar o workflow ${workflow}`);
}

async function exigirSucesso(execucao: ReturnType<ExecutorComando["executar"]>, mensagem: string): Promise<void> {
  const { codigo, erro } = await execucao;
  if (codigo !== 0) throw new Error(`${mensagem}${erro.trim() ? `\n  ${erro.trim()}` : ""}`);
}
