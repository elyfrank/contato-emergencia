import { confiavel } from "./html.ts";

export const ICONE_TELEFONE = confiavel(
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>',
);

export const ICONE_WHATSAPP = confiavel(
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.2z"/></svg>',
);

export const ICONE_ALERTA = confiavel(
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
);

export const GOTA_DE_SANGUE = confiavel(
  '<svg viewBox="0 0 96 118" aria-hidden="true"><path d="M48 2C48 2 6 52 6 76a42 42 0 0 0 84 0C90 52 48 2 48 2Z" fill="#d7262e"/><path d="M28 70a20 20 0 0 0 14 26" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="5" stroke-linecap="round"/></svg>',
);

/** Linha de batimento cardíaco + bicicleta pedalando sobre ela. */
export const ANIMACAO_PEDALADA = confiavel(`
<div class="ride" aria-hidden="true">
  <svg class="ecg" viewBox="0 0 520 60" preserveAspectRatio="none">
    <path d="M0 40H140L155 40 165 20 175 55 190 5 205 50 215 40H330L345 40 355 20 365 55 380 5 395 50 405 40H520"/>
  </svg>
  <svg class="bike" viewBox="0 0 78 50">
    <g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <g class="wheel"><circle cx="16" cy="34" r="13"/><path d="M16 21v26M3 34h26"/></g>
      <g class="wheel"><circle cx="62" cy="34" r="13"/><path d="M62 21v26M49 34h26"/></g>
      <path d="M16 34 30 14H52L62 34M30 14 40 34 52 14M40 34H16"/>
      <path d="M27 9H35M52 14 50 7H57"/>
    </g>
  </svg>
</div>`);
