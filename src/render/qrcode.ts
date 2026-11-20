import QRCode from "qrcode";
import { confiavel, type Html } from "./html.ts";

export interface OpcoesQr {
  readonly x: number;
  readonly y: number;
  readonly tamanho: number;
  readonly cor?: string;
}

/**
 * QR code real como <svg> aninhável dentro de uma ilustração.
 * Nível H de correção de erro: continua legível mesmo com o adesivo arranhado.
 */
export function qrCodeSvg(conteudo: string, { x, y, tamanho, cor = "#15161a" }: OpcoesQr): Html {
  const { modules } = QRCode.create(conteudo, { errorCorrectionLevel: "H" });
  const lado = modules.size;

  let caminho = "";
  for (let linha = 0; linha < lado; linha++) {
    for (let coluna = 0; coluna < lado; coluna++) {
      if (modules.get(linha, coluna)) caminho += `M${coluna} ${linha}h1v1h-1z`;
    }
  }

  return confiavel(
    `<svg x="${x}" y="${y}" width="${tamanho}" height="${tamanho}" viewBox="0 0 ${lado} ${lado}" shape-rendering="crispEdges" role="img" aria-label="QR code">` +
      `<path d="${caminho}" fill="${cor}"/></svg>`,
  );
}
