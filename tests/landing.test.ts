import QRCode from "qrcode";
import { describe, expect, it } from "vitest";
import { siteSchema, type Site } from "../src/dominio/site.ts";
import { renderizarLanding } from "../src/render/pagina-landing.ts";
import { renderizarPaginaPessoa } from "../src/render/pagina-pessoa.ts";
import { qrCodeSvg } from "../src/render/qrcode.ts";
import { PESSOA_EXEMPLO } from "../src/site/exemplo.ts";
import { gerarSite } from "../src/site/gerar-site.ts";
import { umaPessoa } from "./fixtures.ts";

const site: Site = siteSchema.parse({
  marca: "Pedal Seguro",
  urlBase: "https://exemplo.github.io/projeto",
  contato: { telefone: "(61) 99999-1234", email: "fulano@gmail.com" },
});

describe("siteSchema", () => {
  it("normaliza telefone e garante a barra final da URL", () => {
    expect(site.contato.telefone).toBe("5561999991234");
    expect(site.urlBase).toBe("https://exemplo.github.io/projeto/");
  });

  it("rejeita e-mail e URL inválidos", () => {
    const resultado = siteSchema.safeParse({ marca: "X", urlBase: "nao-e-url", contato: { telefone: "61999991234", email: "x" } });
    expect(resultado.success).toBe(false);
  });
});

describe("qrCodeSvg", () => {
  it("desenha um módulo por quadrado escuro do QR real", () => {
    const svg = qrCodeSvg("https://exemplo.com", { x: 0, y: 0, tamanho: 100 }).conteudo;
    const { modules } = QRCode.create("https://exemplo.com", { errorCorrectionLevel: "H" });
    const escuros = Array.from(modules.data).filter(Boolean).length;
    expect(svg.match(/h1v1h-1z/g)).toHaveLength(escuros);
    expect(svg).toContain(`viewBox="0 0 ${modules.size} ${modules.size}"`);
  });
});

describe("landing page", () => {
  const pagina = renderizarLanding({ site, estilos: "", paginaExemplo: "exemplo.html" });

  it("é indexável e tem contato por WhatsApp e telefone", () => {
    expect(pagina).toContain('content="index, follow"');
    expect(pagina).toContain("https://wa.me/5561999991234?text=");
    expect(pagina).toContain('href="tel:+5561999991234"');
    expect(pagina).toContain("(61) 99999-1234");
  });

  it("não expõe o e-mail em texto no HTML (anti-robôs)", () => {
    expect(pagina).not.toContain("fulano@gmail.com");
    expect(pagina).not.toContain("fulano");
    expect(pagina).toContain('data-u="onaluf"');
  });

  it("aponta o QR e os links para a página de exemplo", () => {
    expect(pagina).toContain('href="exemplo.html"');
    expect(pagina).toContain('href="https://exemplo.github.io/projeto/exemplo.html"');
  });
});

describe("página de demonstração", () => {
  const pagina = renderizarPaginaPessoa(PESSOA_EXEMPLO, "", { demonstracao: { linkLanding: "quem-somos.html" } });

  it("mostra a faixa de exemplo e não disca para ninguém, nem para o 192", () => {
    expect(pagina).toContain("EXEMPLO");
    expect(pagina).not.toContain("tel:");
    expect(pagina).not.toContain("wa.me");
    expect(pagina).toContain('href="quem-somos.html"');
  });
});

describe("gerarSite com landing", () => {
  it("gera quem-somos, exemplo e index redirecionando para a landing", () => {
    const arquivos = gerarSite({ pessoas: [umaPessoa()], estilos: "", landing: { site, estilos: "" } });
    const caminhos = arquivos.map((a) => a.caminho);
    expect(caminhos).toEqual(expect.arrayContaining(["jose-abc234.html", "quem-somos.html", "exemplo.html", "index.html"]));
    expect(arquivos.find((a) => a.caminho === "index.html")?.conteudo).toContain('url=quem-somos.html');
  });

  it("sem landing, a raiz continua neutra", () => {
    const indice = gerarSite({ pessoas: [umaPessoa()], estilos: "" }).find((a) => a.caminho === "index.html");
    expect(indice?.conteudo).toContain("Escaneie o QR code");
  });
});
