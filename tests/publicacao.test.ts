import { describe, expect, it } from "vitest";
import type { ExecutorComando, ResultadoComando } from "../src/publicacao/executor.ts";
import { publicarNoGithub } from "../src/publicacao/publicar-github.ts";
import { umaPessoa } from "./fixtures.ts";

interface Chamada {
  readonly comando: string;
  readonly entrada: string | undefined;
}

function executorFalso(falharEm?: string): ExecutorComando & { chamadas: Chamada[] } {
  const chamadas: Chamada[] = [];
  return {
    chamadas,
    async executar(programa, argumentos, entrada): Promise<ResultadoComando> {
      const comando = [programa, ...argumentos].join(" ");
      chamadas.push({ comando, entrada });
      return comando === falharEm ? { codigo: 1, saida: "", erro: "boom" } : { codigo: 0, saida: "", erro: "" };
    },
  };
}

const opcoes = { nomeSecret: "PESSOAS_JSON", workflow: "publicar.yml" };

describe("publicarNoGithub", () => {
  it("verifica o login, grava o secret via stdin e dispara o deploy, nessa ordem", async () => {
    const executor = executorFalso();
    await publicarNoGithub([umaPessoa()], executor, opcoes);

    expect(executor.chamadas.map((c) => c.comando)).toEqual([
      "gh auth status",
      "gh secret set PESSOAS_JSON",
      "gh workflow run publicar.yml",
    ]);
    const secret = executor.chamadas[1];
    expect(secret?.comando).not.toContain("5562");
    expect(JSON.parse(secret?.entrada ?? "")).toEqual([umaPessoa()]);
  });

  it("não envia nada se o gh não estiver logado", async () => {
    const executor = executorFalso("gh auth status");
    await expect(publicarNoGithub([umaPessoa()], executor, opcoes)).rejects.toThrow(/gh auth login/);
    expect(executor.chamadas).toHaveLength(1);
  });

  it("não dispara o deploy se gravar o secret falhar", async () => {
    const executor = executorFalso("gh secret set PESSOAS_JSON");
    await expect(publicarNoGithub([umaPessoa()], executor, opcoes)).rejects.toThrow(/secret PESSOAS_JSON[\s\S]*boom/);
    expect(executor.chamadas).toHaveLength(2);
  });

  it("recusa publicar sem pessoas", async () => {
    await expect(publicarNoGithub([], executorFalso(), opcoes)).rejects.toThrow(/nenhuma pessoa/);
  });
});
