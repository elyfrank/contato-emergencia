import { describe, expect, it } from "vitest";
import { confiavel, escapar, html } from "../src/render/html.ts";
import { renderizarPaginaPessoa } from "../src/render/pagina-pessoa.ts";
import { gerarSite } from "../src/site/gerar-site.ts";
import { umaPessoa } from "./fixtures.ts";

describe("html", () => {
  it("escapa interpolações por padrão", () => {
    expect(html`<p>${'<script>alert("x")</script>'}</p>`.conteudo).toBe(
      "<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>",
    );
  });

  it("não escapa Html confiável nem listas de Html, e ignora vazios", () => {
    const itens = ["a", "b"].map((x) => html`<li>${x}</li>`);
    expect(html`${confiavel("<b>ok</b>")}<ul>${itens}</ul>${null}${false}`.conteudo).toBe(
      "<b>ok</b><ul><li>a</li><li>b</li></ul>",
    );
  });

  it("escapa aspas simples", () => {
    expect(escapar("d'Ávila")).toBe("d&#39;Ávila");
  });
});

describe("página da pessoa", () => {
  const pagina = renderizarPaginaPessoa(umaPessoa(), "/* css */");

  it("mostra nome, tipo sanguíneo e alergias", () => {
    expect(pagina).toContain("José Blabla");
    expect(pagina).toContain('<span class="type">O+</span>');
    expect(pagina).toContain("<li>Dipirona</li>");
  });

  it("tem links de ligação e WhatsApp para cada contato", () => {
    expect(pagina).toContain('href="tel:+5562999998888"');
    expect(pagina).toContain('href="tel:+5562988887777"');
    expect(pagina).toContain("https://wa.me/5562999998888?text=Ol%C3%A1!%20Encontrei%20Jos%C3%A9%20Blabla");
    expect(pagina).toContain("(62) 99999-8888");
  });

  it("tem os números de emergência e não é indexável", () => {
    expect(pagina).toContain('href="tel:192"');
    expect(pagina).toContain('href="tel:193"');
    expect(pagina).toContain('content="noindex, nofollow, noarchive"');
  });

  it("deixa claro quando não há alergias conhecidas", () => {
    expect(renderizarPaginaPessoa(umaPessoa({ alergias: [] }), "")).toContain("Nenhuma alergia conhecida");
  });

  it("escapa dados da pessoa", () => {
    const maliciosa = renderizarPaginaPessoa(umaPessoa({ nome: "<img src=x onerror=alert(1)>" }), "");
    expect(maliciosa).not.toContain("<img src=x");
  });
});

describe("gerarSite", () => {
  it("gera uma página por pessoa mais as páginas neutras, sem listar ninguém na raiz", () => {
    const arquivos = gerarSite([umaPessoa(), umaPessoa({ nome: "Maria Blabla", codigo: "zz9988" })], "");
    const caminhos = arquivos.map((a) => a.caminho);

    expect(caminhos).toEqual(
      expect.arrayContaining(["jose-blabla-abc234.html", "maria-blabla-zz9988.html", "index.html", "404.html", "robots.txt"]),
    );
    const indice = arquivos.find((a) => a.caminho === "index.html")?.conteudo ?? "";
    expect(indice).not.toContain("Blabla");
  });
});
