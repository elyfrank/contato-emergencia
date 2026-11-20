import { describe, expect, it } from "vitest";
import { FORMATO_CODIGO, gerarCodigo } from "../src/dominio/codigo.ts";
import { ErroDeDados } from "../src/dominio/erros.ts";
import { nomeAbreviado, primeiroNome } from "../src/dominio/nome.ts";
import { comNovoCodigo, nomeDaPagina } from "../src/dominio/pessoa.ts";
import { slugificar } from "../src/dominio/slug.ts";
import { normalizarTelefone } from "../src/dominio/telefone.ts";
import { validarColecao, validarPessoa } from "../src/dominio/validacao.ts";
import { umaPessoa } from "./fixtures.ts";

describe("telefone", () => {
  it.each([
    ["(62) 99999-8888", "5562999998888"],
    ["+55 62 99999 8888", "5562999998888"],
    ["6233334444", "556233334444"],
  ])("normaliza %s", (entrada, esperado) => {
    expect(normalizarTelefone(entrada)).toBe(esperado);
  });

  it.each(["123", "99999-8888", "+1 415 555 0100", "(06) 99999-8888", "(62) 89999-8888"])("rejeita %s", (entrada) => {
    expect(normalizarTelefone(entrada)).toBeNull();
  });
});

describe("slug e nome da página", () => {
  it("remove acentos e símbolos", () => {
    expect(slugificar("  José d'Ávila Conceição ")).toBe("jose-d-avila-conceicao");
  });

  it("usa só o primeiro nome + código, para a URL não revelar o sobrenome", () => {
    expect(nomeDaPagina({ nome: "María José Blabla", codigo: "x7k2pq" })).toBe("maria-x7k2pq.html");
  });
});

describe("nome exibido", () => {
  it.each([
    ["José da Silva Blabla", "José B.", "José"],
    ["  ana   souza ", "ana S.", "ana"],
    ["Pelé", "Pelé", "Pelé"],
  ])("%s -> %s / %s", (nome, abreviado, primeiro) => {
    expect(nomeAbreviado(nome)).toBe(abreviado);
    expect(primeiroNome(nome)).toBe(primeiro);
  });
});

describe("comNovoCodigo", () => {
  it("troca o código sem alterar os outros dados, nunca repetindo o atual", () => {
    const codigos = ["abc234", "abc234", "zzz999"];
    const nova = comNovoCodigo(umaPessoa(), () => codigos.shift() ?? "");
    expect(nova).toEqual({ ...umaPessoa(), codigo: "zzz999" });
  });
});

describe("código aleatório", () => {
  it("gera códigos no formato esperado e diferentes entre si", () => {
    const codigos = Array.from({ length: 200 }, gerarCodigo);
    for (const c of codigos) expect(c).toMatch(FORMATO_CODIGO);
    expect(new Set(codigos).size).toBe(codigos.length);
  });
});

describe("validarPessoa", () => {
  it("aceita uma pessoa válida e normaliza telefones", () => {
    const dados = umaPessoa({ contatos: [{ nome: "Ana", relacao: "Esposa", telefone: "(62) 99999-8888" }] });
    expect(validarPessoa({ origem: "teste", dados }).contatos[0]?.telefone).toBe("5562999998888");
  });

  it("reúne todos os problemas com a origem e o campo", () => {
    const dados = { nome: "", codigo: "abc234", tipoSanguineo: "Z+", contatos: [], alergias: [] };
    try {
      validarPessoa({ origem: "pessoas/x.json", dados });
      expect.unreachable();
    } catch (erro) {
      expect(erro).toBeInstanceOf(ErroDeDados);
      const problemas = (erro as ErroDeDados).problemas.join("\n");
      expect(problemas).toContain("pessoas/x.json › nome");
      expect(problemas).toContain("tipoSanguineo");
      expect(problemas).toContain("ao menos 1 contato");
    }
  });

  it("rejeita mais de 2 contatos e telefone inválido", () => {
    const contato = { nome: "A", relacao: "B", telefone: "123" };
    expect(() => validarPessoa({ origem: "t", dados: umaPessoa({ contatos: [contato, contato, contato] }) })).toThrow(
      /no máximo 2/,
    );
    expect(() => validarPessoa({ origem: "t", dados: umaPessoa({ contatos: [contato] }) })).toThrow(/telefone "123"/);
  });

  it("exige que alergias seja informado", () => {
    const { alergias: _, ...semAlergias } = umaPessoa();
    expect(() => validarPessoa({ origem: "t", dados: semAlergias })).toThrow(/alergias/);
  });
});

describe("validarColecao", () => {
  it("detecta códigos e páginas repetidos", () => {
    const registros = [umaPessoa(), umaPessoa()].map((dados, i) => ({ origem: `p${i}`, dados }));
    expect(() => validarColecao(registros)).toThrow(/codigo repetido[\s\S]*página repetida/);
  });
});
