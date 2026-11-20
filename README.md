# Contato de Emergência

Gera uma página estática por ciclista com nome, tipo sanguíneo, alergias e contatos de emergência,
para ser aberta por um QR code colado na bicicleta.

```
site.com.br/jose-v5d9fx.html
site.com.br/maria-ww7fhv.html
```

O sufixo aleatório impede que alguém adivinhe a página só pelo nome. A raiz do site não lista
ninguém e nenhuma página é indexada por buscadores.

## Proteção contra golpes

O golpe do "falso acidente" usa nome completo e parentesco para pedir PIX à família. Por isso
a página mostra só o necessário para o socorro:

- "José B." em vez do nome completo, e só o primeiro nome na URL;
- contatos como "Maria (Esposa)", com botões de ligar e WhatsApp, sem o número escrito na tela;
- tipo sanguíneo e alergias completos (salvam vidas e não servem para golpe).

Se o link vazar (ex.: alguém fotografou o adesivo), gere um novo e invalide o antigo:

```bash
npm run trocar-codigo -- "José Blabla"
npm run publicar   # e imprima um novo adesivo
```

Combine com quem é contato de emergência: **SAMU, bombeiros e hospitais nunca pedem PIX por
telefone.** Na dúvida, desligue e ligue você mesmo para o 192 ou para o hospital.

## Uso

Requer Node 24 (`nvm use`).

```bash
npm install
npm run nova-pessoa -- --nome "José Blabla" --sangue O+ \
  --contato "Maria Blabla;Esposa;(62) 99999-8888" \
  --alergia "Dipirona"            # ou --sem-alergias
npm run dev                       # gera dist/ e serve em http://localhost:8080
```

Ou, pelo Claude Code, use o agente: `/nova-pagina José Blabla, O+, contato Maria (esposa) 62 99999-8888, alérgico a dipirona`.
Ele pergunta o que faltar e chama o mesmo comando.

| Comando | O que faz |
|---|---|
| `npm run nova-pessoa -- ...` | valida e cria `pessoas/<slug>.json` com um código aleatório |
| `npm run build` | gera o site em `dist/` |
| `npm run dev` | build + servidor local |
| `npm run check` | typecheck + testes |
| `npm run publicar` | envia os cadastros ao GitHub e publica o site |
| `npm run trocar-codigo -- "Nome"` | gera um link novo e invalida o antigo |

Para editar uma pessoa, altere `pessoas/<slug>.json` e rode o build. **Não mude o `codigo` à mão**:
ele está no QR code impresso (use `npm run trocar-codigo` só se o link vazar).

## Publicação (GitHub Pages)

As páginas são públicas: quem lê o QR code abre sem login. O que fica protegido é o
**repositório**, que é público no GitHub Pages gratuito. Se os cadastros estivessem lá, qualquer
pessoa veria de uma vez os telefones de todos os cadastrados e familiares. Por isso `pessoas/`
está no `.gitignore`, e no deploy os dados chegam pelo secret `PESSOAS_JSON`.

Uma vez só:
1. Instale o [GitHub CLI](https://cli.github.com) e rode `gh auth login`.
2. No GitHub: *Settings › Pages › Source: GitHub Actions* (e, se quiser, o domínio próprio).

Sempre que cadastrar ou editar alguém:

```bash
npm run publicar   # valida tudo, grava o secret e dispara o deploy
```

O agente `/nova-pagina` faz isso no final, depois de pedir sua confirmação.

## Arquitetura

```
src/
  dominio/   regras puras: schema da pessoa, telefone, slug, código, validação
  dados/     FontePessoas (interface) + FonteDiretorio (local) e FonteTextoJson (secret do CI)
  render/    template HTML com escape automático, páginas e CSS
  site/      gerarSite (pura: pessoas -> arquivos) e gravação em disco
  publicacao/ publicação no GitHub (secret + deploy) via ExecutorComando injetável
  cadastro/  leitura dos argumentos de "nova-pessoa"
  cli/       pontos de entrada: build, nova-pessoa, trocar-codigo, publicar, servir
```

- O domínio não conhece disco nem HTML; a renderização não conhece a origem dos dados.
- O build depende da interface `FontePessoas`, então trocar a origem não muda o resto.
- Todos os dados passam por um único schema (zod). Os erros mostram arquivo e campo, todos de uma vez.
- Todo texto interpolado no HTML é escapado por padrão.
