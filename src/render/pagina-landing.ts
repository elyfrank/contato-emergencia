import type { Site } from "../dominio/site.ts";
import { formatarTelefone } from "../dominio/telefone.ts";
import { documento } from "./documento.ts";
import { html, type Html } from "./html.ts";
import { GOTA_DE_SANGUE, ICONE_ALERTA, ICONE_TELEFONE, ICONE_WHATSAPP } from "./icones.ts";
import { ilustracaoBicicleta, ilustracaoCapacete, ilustracaoCelular, qrGrande } from "./ilustracoes.ts";

export interface OpcoesLanding {
  readonly site: Site;
  readonly estilos: string;
  /** Caminho relativo da página de demonstração (ex.: "exemplo.html"). */
  readonly paginaExemplo: string;
}

interface Item {
  readonly titulo: string;
  readonly texto: string;
}

const RECURSOS: readonly Item[] = [
  { titulo: "Tipo sanguíneo", texto: "Em destaque, para a equipe de resgate ver na hora." },
  { titulo: "Alergias", texto: "Medicamentos que não podem ser usados, bem visíveis." },
  { titulo: "Família em 1 toque", texto: "Botões de ligar e WhatsApp, com a mensagem pronta." },
  { titulo: "SAMU e Bombeiros", texto: "192 e 193 a um toque, para quem estiver ajudando." },
  { titulo: "Sem aplicativo", texto: "Abre na câmera de qualquer celular, Android ou iPhone." },
  { titulo: "Sempre atualizado", texto: "Mudou de telefone? A página muda, o adesivo continua." },
];

const PASSOS: readonly Item[] = [
  { titulo: "Cole o adesivo", texto: "Um no capacete, outro no quadro da bike. Resistente à chuva e ao sol." },
  { titulo: "Alguém escaneia", texto: "Quem te socorrer aponta a câmera do celular. Nada para baixar." },
  { titulo: "O socorro fica mais rápido", texto: "Tipo sanguíneo, alergias e sua família a um toque de distância." },
];

const PROTECOES: readonly string[] = [
  "A página mostra só seu primeiro nome e a inicial do sobrenome.",
  "Os telefones da sua família não aparecem escritos: só os botões de ligar.",
  "Cada link tem um código aleatório: não dá para adivinhar nem achar no Google.",
  "Se alguém fotografar seu adesivo, o link é trocado e o antigo para de funcionar.",
];

/** Landing page (quem-somos): apresenta o serviço e o contato para quem quiser o seu. */
export function renderizarLanding({ site, estilos, paginaExemplo }: OpcoesLanding): string {
  const urlExemplo = `${site.urlBase}${paginaExemplo}`;
  const whatsapp = `https://wa.me/${site.contato.telefone}?text=${encodeURIComponent(
    `Olá! Vi o ${site.marca} e quero o meu QR code de emergência.`,
  )}`;

  return documento({
    titulo: `${site.marca} · QR code de emergência para ciclistas`,
    descricao:
      "Adesivo com QR code para capacete e bicicleta: quem te socorrer vê seu tipo sanguíneo, alergias e liga para sua família com um toque.",
    estilos,
    indexavel: true,
    script: SCRIPT_EMAIL,
    corpo: html`
${topo(site.marca, whatsapp)}
${hero(urlExemplo, whatsapp, paginaExemplo)}
${faixaBeneficios()}
${comoFunciona()}
${ondeColar(urlExemplo)}
${oQueAparece()}
${protecao()}
${experimente(urlExemplo, paginaExemplo)}
${quemSomos(site, whatsapp)}
<footer class="l-footer">
  <p><strong>${site.marca}</strong> · Pedale com segurança <span class="heart">♥</span></p>
  <p>Em uma emergência, ligue <a href="tel:192"><strong>192 (SAMU)</strong></a>.</p>
</footer>`,
  });
}

function topo(marca: string, whatsapp: string): Html {
  return html`
<nav class="l-nav">
  <a class="l-logo" href="#inicio"><span class="l-logo__gota">${GOTA_DE_SANGUE}</span>${marca}</a>
  <a class="l-btn l-btn--small" href="${whatsapp}">Quero o meu</a>
</nav>`;
}

function hero(urlExemplo: string, whatsapp: string, paginaExemplo: string): Html {
  return html`
<header class="l-hero" id="inicio">
  <div class="l-hero__texto">
    <span class="l-tag"><span class="dot"></span> QR code de emergência para ciclistas</span>
    <h1>Se você não puder falar, <em>seu capacete fala por você.</em></h1>
    <p>Um adesivo com QR code no capacete e na bike. Quem te socorrer aponta a câmera do celular e, em segundos,
      vê seu tipo sanguíneo, suas alergias e liga para sua família com um toque.</p>
    <div class="l-acoes">
      <a class="l-btn" href="${whatsapp}">${ICONE_WHATSAPP} Quero o meu</a>
      <a class="l-btn l-btn--ghost" href="${paginaExemplo}">Ver um exemplo</a>
    </div>
  </div>
  <figure class="l-hero__arte">
    ${ilustracaoBicicleta(urlExemplo, { comLupa: true })}
    <figcaption>Aponte a câmera do celular para o QR da lupa</figcaption>
  </figure>
</header>`;
}

function faixaBeneficios(): Html {
  return html`
<div class="l-faixa" aria-label="Benefícios">
  <span>Sem aplicativo</span><span>Qualquer celular</span><span>1 toque para ligar</span><span>Atualiza sem trocar o adesivo</span>
</div>`;
}

function comoFunciona(): Html {
  return html`
<section class="l-secao l-como" id="como-funciona">
  <div class="l-como__texto">
    <h2 class="l-titulo">Como funciona</h2>
    <ol class="l-passos">
      ${PASSOS.map((p) => html`<li><strong>${p.titulo}</strong><span>${p.texto}</span></li>`)}
    </ol>
  </div>
  <figure class="l-como__celular">${ilustracaoCelular()}</figure>
</section>`;
}

function ondeColar(urlExemplo: string): Html {
  return html`
<section class="l-secao" id="onde-colar">
  <h2 class="l-titulo l-centro">Onde colar</h2>
  <div class="l-cards">
    <article class="l-card">
      ${ilustracaoCapacete(urlExemplo)}
      <h3>No capacete</h3>
      <p>É o lugar mais importante: o capacete fica com você, mesmo que a bike vá parar longe.
        Socorristas já são treinados a olhar para ele.</p>
    </article>
    <article class="l-card">
      ${ilustracaoBicicleta(urlExemplo, { comLupa: false })}
      <h3>No quadro da bike</h3>
      <p>Um segundo adesivo no tubo do selim ajuda quem encontrar a bicicleta a falar com você
        ou com a sua família.</p>
    </article>
  </div>
</section>`;
}

function oQueAparece(): Html {
  return html`
<section class="l-secao l-secao--escura" id="o-que-aparece">
  <h2 class="l-titulo l-centro">O que aparece quando alguém escaneia</h2>
  <div class="l-recursos">
    ${RECURSOS.map((r) => html`<article><h3>${r.titulo}</h3><p>${r.texto}</p></article>`)}
  </div>
</section>`;
}

function protecao(): Html {
  return html`
<section class="l-secao l-protecao" id="seguranca">
  <div class="l-protecao__icone">${ICONE_ALERTA}</div>
  <div>
    <h2 class="l-titulo">Pensado contra golpes</h2>
    <p class="l-lead">O golpe do "falso acidente" usa nome completo e parentesco para pedir PIX à família.
      Por isso a página mostra só o que salva vidas:</p>
    <ul class="l-checks">${PROTECOES.map((p) => html`<li>${p}</li>`)}</ul>
    <p class="l-dica"><strong>Combine com sua família:</strong> SAMU, bombeiros e hospitais nunca pedem PIX por telefone.</p>
  </div>
</section>`;
}

function experimente(urlExemplo: string, paginaExemplo: string): Html {
  return html`
<section class="l-secao l-experimente" id="exemplo">
  <div>
    <h2 class="l-titulo">Experimente agora</h2>
    <p class="l-lead">Aponte a câmera do seu celular para o código ao lado e veja a página de um ciclista fictício,
      exatamente como um socorrista veria.</p>
    <a class="l-btn l-btn--ghost" href="${paginaExemplo}">Abrir o exemplo</a>
  </div>
  <a class="l-experimente__qr" href="${urlExemplo}" aria-label="Abrir a página de exemplo">${qrGrande(urlExemplo)}</a>
</section>`;
}

function quemSomos(site: Site, whatsapp: string): Html {
  const [usuario = "", dominio = ""] = site.contato.email.split("@");
  const inverter = (texto: string) => [...texto].reverse().join("");

  return html`
<section class="l-secao l-contato" id="quem-somos">
  <h2 class="l-titulo l-centro">Quem somos</h2>
  <p class="l-lead l-centro">O ${site.marca} nasceu de uma pergunta simples: se eu cair sozinho na estrada,
    quem vai saber para quem ligar? É um projeto independente, feito por quem pedala, para quem pedala.</p>
  <div class="l-contato__card">
    <h3>Quer o seu ou tem alguma dúvida?</h3>
    <p>Fale comigo. Eu monto a sua página e te entrego os adesivos prontos para colar.</p>
    <div class="l-acoes l-acoes--centro">
      <a class="l-btn" href="${whatsapp}">${ICONE_WHATSAPP} WhatsApp</a>
      <a class="l-btn l-btn--ghost" href="tel:+${site.contato.telefone}">${ICONE_TELEFONE} ${formatarTelefone(site.contato.telefone)}</a>
      <a class="l-btn l-btn--ghost" id="email" href="#quem-somos" data-u="${inverter(usuario)}" data-d="${inverter(dominio)}">✉️ Mostrar e-mail</a>
    </div>
  </div>
</section>`;
}

/**
 * Monta o e-mail só no navegador, a partir de partes invertidas: robôs que varrem o HTML
 * atrás de endereços não o encontram, mas o visitante vê e clica normalmente.
 */
const SCRIPT_EMAIL = `
(function () {
  var link = document.getElementById("email");
  if (!link) return;
  var inverter = function (t) { return t.split("").reverse().join(""); };
  var email = inverter(link.dataset.u) + "@" + inverter(link.dataset.d);
  link.href = "mailto:" + email;
  link.textContent = "✉️ " + email;
})();`;
