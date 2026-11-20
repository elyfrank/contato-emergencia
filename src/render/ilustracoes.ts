import { confiavel, type Html } from "./html.ts";
import { qrCodeSvg } from "./qrcode.ts";

/**
 * Ilustrações vetoriais da landing page. Os QR codes desenhados nelas são reais:
 * escanear a imagem na tela abre a página de demonstração.
 */

const TINTA = "#15161a";
const VERMELHO = "#d7262e";
const VERMELHO_ESCURO = "#a3121a";
const CINZA = "#9aa0a6";

function raios(cx: number, cy: number, raio: number, quantidade: number): string {
  return Array.from({ length: quantidade }, (_, i) => {
    const angulo = (i * Math.PI) / (quantidade / 2);
    const x = (cx + Math.cos(angulo) * raio).toFixed(1);
    const y = (cy + Math.sin(angulo) * raio).toFixed(1);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;
  }).join("");
}

function roda(cx: number, cy: number): string {
  return `
  <g class="roda">
    <circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="${TINTA}" stroke-width="12"/>
    <circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="${CINZA}" stroke-width="3"/>
    <g stroke="${CINZA}" stroke-width="1.5" class="raios">${raios(cx, cy, 70, 16)}</g>
    <circle cx="${cx}" cy="${cy}" r="7" fill="${TINTA}"/>
  </g>`;
}

/** Bicicleta de estrada com adesivo no quadro e uma "lupa" mostrando o QR ampliado. */
export function ilustracaoBicicleta(urlQr: string, { comLupa }: { comLupa: boolean }): Html {
  const lupa = comLupa
    ? `
  <g class="lupa">
    <line x1="150" y1="122" x2="226" y2="160" stroke="${TINTA}" stroke-width="3" stroke-dasharray="6 6"/>
    <circle cx="96" cy="96" r="86" fill="#fff" stroke="${VERMELHO}" stroke-width="8"/>
    ${qrCodeSvg(urlQr, { x: 44, y: 44, tamanho: 104 })}
  </g>`
    : "";

  return confiavel(`
<svg class="ilustracao" viewBox="0 0 520 330" role="img" aria-label="Bicicleta com adesivo de QR code de emergência no quadro">
  <ellipse cx="265" cy="312" rx="230" ry="12" fill="${TINTA}" opacity=".12"/>
  ${roda(130, 228)}
  ${roda(400, 228)}
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M255 232 130 228" stroke="${VERMELHO_ESCURO}" stroke-width="9"/>
    <path d="M228 108 130 228" stroke="${VERMELHO_ESCURO}" stroke-width="9"/>
    <path d="M226 100 255 232 381 140" stroke="${VERMELHO}" stroke-width="13"/>
    <path d="M230 112 372 108" stroke="${VERMELHO}" stroke-width="12"/>
    <path d="M372 104 381 142" stroke="${TINTA}" stroke-width="14"/>
    <path d="M381 142 400 228" stroke="${VERMELHO_ESCURO}" stroke-width="9"/>
    <path d="M224 98 216 70" stroke="${CINZA}" stroke-width="8"/>
    <path d="M190 66h52" stroke="${TINTA}" stroke-width="10"/>
    <path d="M371 104 362 82h30q16 0 16 16v14" stroke="${TINTA}" stroke-width="8"/>
    <path d="M255 208 132 220M255 256 132 236" stroke="${CINZA}" stroke-width="2.5"/>
    <circle cx="255" cy="232" r="24" stroke="${TINTA}" stroke-width="5"/>
    <path d="M255 232 276 266" stroke="${TINTA}" stroke-width="7"/>
    <path d="M266 268h22" stroke="${TINTA}" stroke-width="7"/>
  </g>
  <g transform="rotate(13 240 160)">
    <rect x="216" y="136" width="48" height="48" rx="6" fill="#fff" stroke="${TINTA}" stroke-width="2"/>
    ${qrCodeSvg(urlQr, { x: 221, y: 141, tamanho: 38 })}
  </g>
  ${lupa}
</svg>`);
}

/** Capacete visto de lado, com o adesivo de QR na lateral. */
export function ilustracaoCapacete(urlQr: string): Html {
  return confiavel(`
<svg class="ilustracao" viewBox="0 0 360 270" role="img" aria-label="Capacete de ciclismo com adesivo de QR code de emergência">
  <ellipse cx="185" cy="252" rx="140" ry="10" fill="${TINTA}" opacity=".12"/>
  <path d="M120 188 150 240 196 190" fill="none" stroke="${TINTA}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="140" y="232" width="20" height="14" rx="3" fill="${TINTA}"/>
  <path d="M36 178C30 96 108 38 200 40c84 2 136 54 130 128-26 4-46 4-64 18L72 194c-18 0-34-6-36-16z" fill="${VERMELHO}"/>
  <path d="M42 170c84 10 190 6 286-6l2 8c-30 6-48 6-64 20L72 196c-16 0-28-6-32-14z" fill="${VERMELHO_ESCURO}"/>
  <g fill="${TINTA}" opacity=".88">
    <rect x="88" y="78" width="58" height="15" rx="7.5" transform="rotate(-32 117 85)"/>
    <rect x="160" y="52" width="62" height="15" rx="7.5" transform="rotate(-8 191 60)"/>
    <rect x="236" y="56" width="56" height="15" rx="7.5" transform="rotate(16 264 64)"/>
    <rect x="286" y="96" width="40" height="14" rx="7" transform="rotate(42 306 103)"/>
  </g>
  <path d="M300 122c32-4 54 8 52 20-16-2-32 0-46 8z" fill="${TINTA}"/>
  <g transform="rotate(-6 182 128)">
    <rect x="136" y="82" width="92" height="92" rx="10" fill="#fff" stroke="${TINTA}" stroke-width="2.5"/>
    ${qrCodeSvg(urlQr, { x: 143, y: 89, tamanho: 78 })}
  </g>
</svg>`);
}

/** Celular exibindo a página de emergência — o que quem socorre vê. */
export function ilustracaoCelular(): Html {
  return confiavel(`
<svg class="ilustracao ilustracao--celular" viewBox="0 0 220 430" role="img" aria-label="Celular mostrando a página de emergência com tipo sanguíneo, alergias e contatos">
  <defs>
    <pattern id="faixa" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <rect width="7" height="14" fill="#ffd23f"/><rect x="7" width="7" height="14" fill="${TINTA}"/>
    </pattern>
    <clipPath id="tela"><rect x="20" y="24" width="180" height="382" rx="22"/></clipPath>
  </defs>
  <rect x="8" y="8" width="204" height="414" rx="34" fill="${TINTA}"/>
  <g clip-path="url(#tela)">
    <rect x="20" y="24" width="180" height="382" fill="#fbf7f2"/>
    <rect x="20" y="24" width="180" height="120" fill="${VERMELHO}"/>
    <rect x="20" y="24" width="180" height="6" fill="url(#faixa)"/>
    <text x="110" y="62" text-anchor="middle" fill="#fff" font-family="Archivo Black, Impact, sans-serif" font-size="15">Obrigado por parar.</text>
    <polyline points="34,100 80,100 86,88 92,112 100,80 108,108 114,100 186,100" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round" class="ecg-mini"/>
    <rect x="32" y="122" width="156" height="92" rx="14" fill="#fff"/>
    <text x="44" y="146" fill="#6b6b73" font-family="Inter, sans-serif" font-size="7" font-weight="800" letter-spacing="1.2">CICLISTA</text>
    <text x="44" y="168" fill="${TINTA}" font-family="Archivo Black, Impact, sans-serif" font-size="17">Ana E.</text>
    <path d="M160 132s-20 24-20 36a20 20 0 0 0 40 0c0-12-20-36-20-36z" fill="${VERMELHO}"/>
    <text x="160" y="176" text-anchor="middle" fill="#fff" font-family="Archivo Black, Impact, sans-serif" font-size="13">O-</text>
    <rect x="44" y="184" width="132" height="22" rx="6" fill="#fff6d6"/>
    <rect x="44" y="184" width="4" height="22" fill="#ffd23f"/>
    <text x="54" y="199" fill="${TINTA}" font-family="Inter, sans-serif" font-size="8.5" font-weight="800">Alérgica a Penicilina</text>
    ${[0, 1]
      .map((i) => {
        const y = 226 + i * 46;
        const [nome, relacao] = i === 0 ? ["Carlos", "Pai"] : ["Júlia", "Irmã"];
        return `
    <rect x="32" y="${y}" width="156" height="38" rx="10" fill="#fff"/>
    <rect x="40" y="${y + 7}" width="24" height="24" rx="7" fill="#fde7e8"/>
    <text x="52" y="${y + 24}" text-anchor="middle" fill="${VERMELHO}" font-family="Archivo Black, Impact, sans-serif" font-size="11">${nome.charAt(0)}</text>
    <text x="72" y="${y + 17}" fill="${TINTA}" font-family="Inter, sans-serif" font-size="9" font-weight="800">${nome}</text>
    <text x="72" y="${y + 29}" fill="#6b6b73" font-family="Inter, sans-serif" font-size="7.5">${relacao}</text>
    <circle cx="150" cy="${y + 19}" r="10" fill="#1f9d55"/>
    <circle cx="174" cy="${y + 19}" r="10" fill="${VERMELHO}"/>`;
      })
      .join("")}
    <rect x="32" y="322" width="75" height="44" rx="10" fill="${VERMELHO_ESCURO}"/>
    <rect x="113" y="322" width="75" height="44" rx="10" fill="${TINTA}"/>
    <text x="69.5" y="350" text-anchor="middle" fill="#fff" font-family="Archivo Black, Impact, sans-serif" font-size="17">192</text>
    <text x="150.5" y="350" text-anchor="middle" fill="#fff" font-family="Archivo Black, Impact, sans-serif" font-size="17">193</text>
  </g>
  <rect x="80" y="14" width="60" height="6" rx="3" fill="#333"/>
</svg>`);
}

/** QR grande e limpo, para o visitante escanear direto da tela. */
export function qrGrande(urlQr: string): Html {
  return confiavel(`
<svg class="qr-grande" viewBox="0 0 220 220" role="img" aria-label="QR code da página de exemplo">
  <rect width="220" height="220" rx="18" fill="#fff"/>
  ${qrCodeSvg(urlQr, { x: 16, y: 16, tamanho: 188 })}
</svg>`);
}
