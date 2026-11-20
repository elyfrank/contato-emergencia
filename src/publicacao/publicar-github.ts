import { ErroDeDados } from "../dominio/erros.ts";
import type { ExecutorComando } from "./executor.ts";

export interface Secret {
  readonly nome: string;
  readonly valor: string;
}

/** Tamanho máximo de um secret do GitHub. */
const LIMITE_SECRET_BYTES = 48 * 1024;

/**
 * Publica no GitHub Pages: grava os secrets (dados que não vão para o repositório)
 * e dispara o workflow de deploy. Valida tudo antes de enviar qualquer coisa.
 */
export async function publicarNoGithub(
  secrets: readonly Secret[],
  executor: ExecutorComando,
  workflow: string,
): Promise<void> {
  const problemas = secrets
    .map((s) => ({ nome: s.nome, tamanho: Buffer.byteLength(s.valor, "utf8") }))
    .filter((s) => s.tamanho > LIMITE_SECRET_BYTES)
    .map((s) => `${s.nome} tem ${s.tamanho} bytes, acima do limite de um secret do GitHub (${LIMITE_SECRET_BYTES})`);
  if (problemas.length > 0) throw new ErroDeDados(problemas);

  await exigirSucesso(
    executor.executar("gh", ["auth", "status"]),
    'GitHub CLI indisponível ou sem login. Instale o "gh" (https://cli.github.com) e rode "gh auth login"',
  );
  for (const secret of secrets) {
    await exigirSucesso(executor.executar("gh", ["secret", "set", secret.nome], secret.valor), `falha ao gravar o secret ${secret.nome}`);
  }
  await exigirSucesso(executor.executar("gh", ["workflow", "run", workflow]), `falha ao disparar o workflow ${workflow}`);
}

async function exigirSucesso(execucao: ReturnType<ExecutorComando["executar"]>, mensagem: string): Promise<void> {
  const { codigo, erro } = await execucao;
  if (codigo !== 0) throw new Error(`${mensagem}${erro.trim() ? `\n  ${erro.trim()}` : ""}`);
}
