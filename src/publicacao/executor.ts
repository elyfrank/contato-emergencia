import { spawn } from "node:child_process";

export interface ResultadoComando {
  readonly codigo: number;
  readonly saida: string;
  readonly erro: string;
}

/** Executa um programa externo. Abstraído para a publicação ser testável sem chamar o GitHub. */
export interface ExecutorComando {
  executar(programa: string, argumentos: readonly string[], entrada?: string): Promise<ResultadoComando>;
}

/** Implementação real. Dados sensíveis vão por stdin, nunca como argumento (que aparece no `ps`). */
export const executorDoSistema: ExecutorComando = {
  executar(programa, argumentos, entrada) {
    return new Promise((resolver) => {
      const processo = spawn(programa, [...argumentos], { stdio: ["pipe", "pipe", "pipe"] });
      let saida = "";
      let erro = "";
      processo.stdout.on("data", (parte: Buffer) => (saida += parte.toString()));
      processo.stderr.on("data", (parte: Buffer) => (erro += parte.toString()));
      processo.on("error", (falha) => resolver({ codigo: 127, saida, erro: falha.message }));
      processo.on("close", (codigo) => resolver({ codigo: codigo ?? 1, saida, erro }));
      processo.stdin.end(entrada ?? "");
    });
  },
};
