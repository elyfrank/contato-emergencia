import { nomeAbreviado, primeiroNome } from "../dominio/nome.ts";
import type { Contato, Pessoa } from "../dominio/pessoa.ts";
import { documento } from "./documento.ts";
import { html, type Html, type Interpolavel } from "./html.ts";
import { ANIMACAO_PEDALADA, GOTA_DE_SANGUE, ICONE_ALERTA, ICONE_TELEFONE, ICONE_WHATSAPP } from "./icones.ts";

interface ServicoEmergencia {
  readonly numero: string;
  readonly nome: string;
  readonly destaque: boolean;
}

const SERVICOS_EMERGENCIA: readonly ServicoEmergencia[] = [
  { numero: "192", nome: "SAMU", destaque: true },
  { numero: "193", nome: "Bombeiros", destaque: false },
];

const PASSOS_DE_AJUDA: readonly Html[] = [
  html`Garanta sua segurança e sinalize o local para os carros.`,
  html`Ligue para o <strong>192 (SAMU)</strong> e informe o endereço.`,
  html`Não remova o capacete nem mova o ciclista, a menos que haja perigo imediato.`,
  html`Avise um dos contatos acima e, se puder, fique por perto até o socorro chegar.`,
];

export interface OpcoesPaginaPessoa {
  /** Página de demonstração: faixa "EXEMPLO" e nenhum botão disca de verdade. */
  readonly demonstracao?: { readonly linkLanding: string };
}

/**
 * A página é pública. Para dificultar o golpe do "falso acidente", ela mostra só o necessário
 * para o socorro: nome abreviado, primeiro nome e relação dos contatos, e botões de ligar —
 * sem sobrenomes nem números de telefone escritos na tela.
 */
export function renderizarPaginaPessoa(pessoa: Pessoa, estilos: string, opcoes: OpcoesPaginaPessoa = {}): string {
  const nome = nomeAbreviado(pessoa.nome);
  const demo = opcoes.demonstracao !== undefined;
  return documento({
    titulo: `${demo ? "Exemplo" : "Emergência"} · ${nome}`,
    estilos,
    corpo: html`
${opcoes.demonstracao ? faixaDemonstracao(opcoes.demonstracao.linkLanding) : null}
${cabecalho()}
<main>
  ${identificacao(nome, pessoa)}
  ${secao("Contatos de emergência", pessoa.contatos.map((c) => cartaoContato(c, nome, demo)))}
  ${secao("Serviços de emergência", servicosEmergencia(demo))}
  ${secao("Como ajudar", comoAjudar())}
</main>
<footer>Pedale com segurança <span class="heart">♥</span></footer>`,
  });
}

function faixaDemonstracao(linkLanding: string): Html {
  return html`
<div class="demo-banner" role="note">
  <strong>EXEMPLO</strong> · dados fictícios, botões desativados
  <a href="${linkLanding}">Quero o meu →</a>
</div>`;
}

/** Link de ação real, ou um elemento inerte na página de demonstração. */
function acao(demo: boolean, classe: string, href: string, rotulo: string, conteudo: Interpolavel): Html {
  return demo
    ? html`<span class="${classe} is-demo" role="img" aria-label="${rotulo} (desativado no exemplo)">${conteudo}</span>`
    : html`<a class="${classe}" href="${href}" aria-label="${rotulo}">${conteudo}</a>`;
}

function cabecalho(): Html {
  return html`
<header class="hero">
  <div class="tag"><span class="dot"></span> Ciclista precisa de ajuda</div>
  <h1>Obrigado por parar.</h1>
  <p class="sub">Se você encontrou esta bicicleta após um acidente, abaixo estão as informações para ajudar o ciclista.</p>
  ${ANIMACAO_PEDALADA}
</header>`;
}

function identificacao(nome: string, pessoa: Pessoa): Html {
  return html`
<section class="card id" aria-label="Identificação">
  <div>
    <div class="label">Ciclista</div>
    <div class="name">${nome}</div>
  </div>
  <div class="blood" role="img" aria-label="Tipo sanguíneo ${pessoa.tipoSanguineo}">
    ${GOTA_DE_SANGUE}
    <div aria-hidden="true">
      <span class="type">${pessoa.tipoSanguineo}</span>
      <span class="small">TIPO SANG.</span>
    </div>
  </div>
  ${alergias(pessoa.alergias)}
</section>`;
}

function alergias(lista: readonly string[]): Html {
  if (lista.length === 0) {
    return html`<div class="allergy allergy--none"><span class="label">Alergias</span> Nenhuma alergia conhecida</div>`;
  }
  return html`
<div class="allergy" role="note">
  ${ICONE_ALERTA}
  <div>
    <div class="label">Alergias</div>
    <ul>${lista.map((a) => html`<li>${a}</li>`)}</ul>
  </div>
</div>`;
}

function cartaoContato(contato: Contato, nomeDoCiclista: string, demo: boolean): Html {
  const nome = primeiroNome(contato.nome);
  const mensagem = `Olá! Encontrei ${nomeDoCiclista} (ciclista) após um possível acidente. Estou no local agora.`;
  const whatsapp = `https://wa.me/${contato.telefone}?text=${encodeURIComponent(mensagem)}`;

  return html`
<section class="card contact">
  <div class="avatar" aria-hidden="true">${nome.charAt(0).toUpperCase()}</div>
  <div class="c-info">
    <div class="c-name">${nome}</div>
    <div class="c-rel">${contato.relacao}</div>
  </div>
  <div class="actions">
    ${acao(demo, "btn-round wa", whatsapp, `Mandar WhatsApp para ${nome}`, ICONE_WHATSAPP)}
    ${acao(demo, "btn-round call", `tel:+${contato.telefone}`, `Ligar para ${nome}`, ICONE_TELEFONE)}
  </div>
</section>`;
}

function servicosEmergencia(demo: boolean): Html {
  return html`
<div class="sos-grid">
  ${SERVICOS_EMERGENCIA.map((s) =>
    acao(demo, `sos${s.destaque ? " sos--destaque" : ""}`, `tel:${s.numero}`, `Ligar para ${s.nome} (${s.numero})`, html`<b>${s.numero}</b><span>${s.nome}</span>`),
  )}
</div>`;
}

function comoAjudar(): Html {
  return html`
<section class="card">
  <ol class="steps">${PASSOS_DE_AJUDA.map((passo) => html`<li><span>${passo}</span></li>`)}</ol>
</section>`;
}

function secao(titulo: string, conteudo: Interpolavel): Html {
  return html`<h2>${titulo}</h2>${conteudo}`;
}
