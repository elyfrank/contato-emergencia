import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { lerArgumentos } from "../src/cadastro/argumentos.ts";
import { FonteDiretorio } from "../src/dados/fonte-diretorio.ts";
import { FonteTextoJson } from "../src/dados/fonte-texto-json.ts";
import { salvarNovaPessoa } from "../src/dados/gravador-diretorio.ts";
import { umaPessoa } from "./fixtures.ts";

describe("lerArgumentos", () => {
  const base = ["--nome", "José Blabla", "--sangue", "ab-", "--contato", "Maria; Mãe ;(62) 99999-8888"];

  it("lê contatos e alergias", () => {
    expect(lerArgumentos([...base, "--alergia", "Dipirona", "--alergia", "Látex"])).toEqual({
      nome: "José Blabla",
      tipoSanguineo: "AB-",
      contatos: [{ nome: "Maria", relacao: "Mãe", telefone: "(62) 99999-8888" }],
      alergias: ["Dipirona", "Látex"],
    });
  });

  it("aceita --sem-alergias", () => {
    expect(lerArgumentos([...base, "--sem-alergias"]).alergias).toEqual([]);
  });

  it("exige alergias explícitas", () => {
    expect(() => lerArgumentos(base)).toThrow(/--sem-alergias/);
    expect(() => lerArgumentos([...base, "--sem-alergias", "--alergia", "X"])).toThrow(/não os dois/);
  });

  it("rejeita contato mal formatado e opção desconhecida", () => {
    expect(() => lerArgumentos(["--contato", "Maria 62999998888", "--sem-alergias"])).toThrow(/Nome;Relação;Telefone/);
    expect(() => lerArgumentos(["--idade", "30"])).toThrow();
  });
});

describe("fontes e gravação", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "pessoas-"));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("salva uma nova pessoa e a lê de volta pelo diretório", async () => {
    const arquivo = await salvarNovaPessoa(dir, umaPessoa());
    expect(arquivo.endsWith("jose-blabla.json")).toBe(true);

    const registros = await new FonteDiretorio(dir).carregar();
    expect(registros).toEqual([{ origem: "pessoas/jose-blabla.json", dados: umaPessoa() }]);
  });

  it("nunca sobrescreve um cadastro existente", async () => {
    await salvarNovaPessoa(dir, umaPessoa());
    await expect(salvarNovaPessoa(dir, umaPessoa({ codigo: "qqq222" }))).rejects.toThrow(/já existe/);
    expect(JSON.parse(await readFile(join(dir, "jose-blabla.json"), "utf8")).codigo).toBe("abc234");
  });

  it("informa o arquivo com JSON inválido", async () => {
    await writeFile(join(dir, "quebrado.json"), "{ nome: ");
    await expect(new FonteDiretorio(dir).carregar()).rejects.toThrow(/pessoas\/quebrado\.json: JSON inválido/);
  });

  it("diretório inexistente resulta em lista vazia", async () => {
    expect(await new FonteDiretorio(join(dir, "nao-existe")).carregar()).toEqual([]);
  });

  it("lê o array do secret com origem indexada", async () => {
    const registros = await new FonteTextoJson(JSON.stringify([umaPessoa()]), "PESSOAS_JSON").carregar();
    expect(registros[0]?.origem).toBe("PESSOAS_JSON[0]");
    await expect(new FonteTextoJson("{}", "PESSOAS_JSON").carregar()).rejects.toThrow(/array/);
  });
});
