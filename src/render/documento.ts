import { confiavel, html, type Html } from "./html.ts";

export interface OpcoesDocumento {
  readonly titulo: string;
  readonly estilos: string;
  readonly corpo: Html;
}

/** Esqueleto comum a todas as páginas. Nenhuma página deve ser indexada por buscadores. */
export function documento({ titulo, estilos, corpo }: OpcoesDocumento): string {
  return html`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#d7262e">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <meta name="referrer" content="no-referrer">
  <title>${titulo}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>${confiavel(estilos)}</style>
</head>
<body>
${corpo}
</body>
</html>
`.conteudo;
}
