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

const secrets = [
  { nome: "PESSOAS_JSON", valor: JSON.stringify([umaPessoa()]) },
  { nome: "SITE_JSON", valor: '{"marca":"X"}' },
];

describe("publicarNoGithub", () => {
  it("verifica o login, grava cada secret via stdin e dispara o deploy, nessa ordem", async () => {
    const executor = executorFalso();
    await publicarNoGithub(secrets, executor, "publicar.yml");

    expect(executor.chamadas.map((c) => c.comando)).toEqual([
      "gh auth status",
      "gh secret set PESSOAS_JSON",
      "gh secret set SITE_JSON",
      "gh workflow run publicar.yml",
    ]);
    const pessoas = executor.chamadas[1];
    expect(pessoas?.comando).not.toContain("5562");
    expect(JSON.parse(pessoas?.entrada ?? "")).toEqual([umaPessoa()]);
  });

  it("não envia nada se o gh não estiver logado", async () => {
    const executor = executorFalso("gh auth status");
    await expect(publicarNoGithub(secrets, executor, "publicar.yml")).rejects.toThrow(/gh auth login/);
    expect(executor.chamadas).toHaveLength(1);
  });

  it("não dispara o deploy se gravar um secret falhar", async () => {
    const executor = executorFalso("gh secret set PESSOAS_JSON");
    await expect(publicarNoGithub(secrets, executor, "publicar.yml")).rejects.toThrow(/secret PESSOAS_JSON[\s\S]*boom/);
    expect(executor.chamadas).toHaveLength(2);
  });

  it("recusa secret acima do limite do GitHub sem chamar nada", async () => {
    const executor = executorFalso();
    await expect(publicarNoGithub([{ nome: "GRANDE", valor: "x".repeat(50_000) }], executor, "w")).rejects.toThrow(/limite/);
    expect(executor.chamadas).toHaveLength(0);
  });
});
