import { confiavel, html, type Html } from "./html.ts";

export interface OpcoesDocumento {
  readonly titulo: string;
  readonly estilos: string;
  readonly corpo: Html;
  /** Só a landing page é indexável. Páginas de pessoas nunca devem aparecer em buscadores. */
  readonly indexavel?: boolean;
  readonly descricao?: string;
  /** Redireciona imediatamente para outra página (ex.: index.html -> quem-somos.html). */
  readonly redirecionarPara?: string;
  /** Script inline opcional, executado ao final do <body>. */
  readonly script?: string;
}

export function documento(opcoes: OpcoesDocumento): string {
  const { titulo, estilos, corpo, indexavel = false, descricao, redirecionarPara, script } = opcoes;

  return html`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#d7262e">
  <meta name="robots" content="${indexavel ? "index, follow" : "noindex, nofollow, noarchive"}">
  <meta name="referrer" content="no-referrer">
  <title>${titulo}</title>
  ${descricao ? html`<meta name="description" content="${descricao}">
  <meta property="og:title" content="${titulo}">
  <meta property="og:description" content="${descricao}">
  <meta property="og:type" content="website">` : null}
  ${redirecionarPara ? html`<meta http-equiv="refresh" content="0; url=${redirecionarPara}">
  <link rel="canonical" href="${redirecionarPara}">` : null}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>${confiavel(estilos)}</style>
</head>
<body>
${corpo}
${script ? html`<script>${confiavel(script)}</script>` : null}
</body>
</html>
`.conteudo;
}
