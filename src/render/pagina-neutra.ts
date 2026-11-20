import { documento } from "./documento.ts";
import { html } from "./html.ts";

/**
 * Página sem dados pessoais, usada na raiz do site e como 404.
 * Não lista ninguém: as páginas das pessoas só são acessadas pelo QR code.
 */
export function renderizarPaginaNeutra(estilos: string, titulo: string, mensagem: string): string {
  return documento({
    titulo,
    estilos,
    corpo: html`
<main class="neutral">
  <section class="card">
    <h1>${titulo}</h1>
    <p>${mensagem}</p>
    <p>Em uma emergência, ligue <a href="tel:192"><strong>192 (SAMU)</strong></a>.</p>
  </section>
</main>`,
  });
}
