---
name: nova-pagina
description: Cria a página de contato de emergência de uma nova pessoa (ciclista) neste projeto, a partir de nome completo, tipo sanguíneo, até 2 contatos de emergência e alergias. Use quando o usuário pedir para criar, cadastrar ou adicionar uma nova página/pessoa.
argument-hint: "[nome completo, tipo sanguíneo, contatos (nome, relação, telefone), alergias]"
allowed-tools: Bash(npm run -s nova-pessoa:*), Bash(npm run -s build), Bash(node -v), Read, AskUserQuestion
---

# Criar página de emergência

Você cadastra uma pessoa e gera a página dela. **Quem valida os dados é o código do projeto**
(`npm run nova-pessoa`), não você: seu trabalho é coletar os dados certos, chamar o comando
e repassar o resultado. Esta página é lida por desconhecidos numa emergência médica, então
**nunca invente, complete ou suponha** nenhum dado.

Dados recebidos: $ARGUMENTS

## 1. Reúna os dados

| Campo | Regra |
|---|---|
| Nome completo | obrigatório; vira a URL (`jose-da-silva-xxxxxx.html`) |
| Tipo sanguíneo | obrigatório; um de A+, A-, B+, B-, AB+, AB-, O+, O- |
| Contatos | 1 ou 2; cada um com **nome**, **relação** (Mãe, Esposa...) e **telefone brasileiro com DDD** |
| Alergias | obrigatório saber: uma lista, ou a confirmação explícita de que não há nenhuma |

- Se faltar algo, pergunte **tudo o que falta de uma vez só** (uma única pergunta ou mensagem).
- Se as alergias não foram mencionadas, pergunte. Silêncio **não** significa "sem alergias".
- Se o tipo sanguíneo veio sem o fator Rh (ex.: só "O"), pergunte se é positivo ou negativo.
- Não pergunte o que já foi informado.

## 2. Garanta o Node 24

Rode `node -v`. Se for menor que v24, prefixe os comandos seguintes com
`source ~/.nvm/nvm.sh && nvm use >/dev/null && ` (o projeto tem `.nvmrc`).

## 3. Crie o cadastro

Cada valor entre aspas duplas; escape `"`, `$` e `` ` `` que aparecerem dentro dos valores.
Contato no formato `"Nome;Relação;Telefone"`.

```bash
npm run -s nova-pessoa -- \
  --nome "José da Silva" \
  --sangue O+ \
  --contato "Maria da Silva;Esposa;(62) 99999-8888" \
  --contato "Pedro da Silva;Irmão;62 98888-7777" \
  --alergia "Dipirona" --alergia "Penicilina"
# sem alergias: troque as --alergia por --sem-alergias
```

Se o comando recusar os dados (✖ Dados inválidos), mostre o problema ao usuário em linguagem
simples, peça a correção e rode de novo. **Nunca** crie ou edite o JSON em `pessoas/` à mão
para contornar a validação.

Se já existir cadastro com o mesmo nome, não sobrescreva: avise o usuário e pergunte se ele quer
editar a pessoa existente (`pessoas/<slug>.json`, mantendo o `codigo`) ou usar um nome diferente.

## 4. Gere o site

```bash
npm run -s build
```

## 5. Confirme e publique

Mostre ao usuário, de forma curta:
- o caminho da página (ex.: `/jose-da-silva-v5d9fx.html`) e o link local `http://localhost:8080/<página>`
  (se o servidor não estiver rodando: `npm run dev`);
- um resumo dos dados cadastrados (nome, tipo sanguíneo, alergias, contatos), para ele conferir.

Então pergunte (AskUserQuestion) se pode **publicar agora**. A página fica pública na internet,
então só publique com um "sim" explícito nesta conversa. Com o sim:

```bash
npm run -s publicar
```

Esse comando publica **todos** os cadastros de `pessoas/` (o site inteiro é regerado no deploy),
valida tudo antes e não envia nada se houver erro. Ao final, informe que a página entra no ar em
cerca de 1 minuto em `https://<domínio>/<página>`, e que esse é o link para gerar o QR code.

Se falhar porque o `gh` não está instalado ou logado, explique e sugira ao usuário rodar
`! gh auth login`. Não tente contornar de outra forma.

## Regras que não mudam

- O `codigo` de uma pessoa já cadastrada nunca muda: ele está no QR code colado na bicicleta.
- Dados pessoais não vão para o git (`pessoas/` está no `.gitignore`). Não force o commit.
