import { FonteDiretorio } from "../dados/fonte-diretorio.ts";
import { ErroDeDados } from "../dominio/erros.ts";
import { nomeDaPagina } from "../dominio/pessoa.ts";
import { executorDoSistema } from "../publicacao/executor.ts";
import { publicarNoGithub, type Secret } from "../publicacao/publicar-github.ts";
import { carregarPessoas } from "./carregar-pessoas.ts";
import { carregarSite } from "./carregar-site.ts";
import { CONFIG } from "./config.ts";
import { executar } from "./executar.ts";

await executar(async () => {
  const pessoas = await carregarPessoas(new FonteDiretorio(CONFIG.diretorioPessoas));
  if (pessoas.length === 0) throw new ErroDeDados(["nenhuma pessoa cadastrada para publicar"]);
  // Lê só o site.json local (ignora SITE_JSON do ambiente): publicamos o que está nesta máquina.
  const site = await carregarSite({});

  const secrets: Secret[] = [{ nome: CONFIG.variavelDados, valor: JSON.stringify(pessoas) }];
  if (site) secrets.push({ nome: CONFIG.variavelSite, valor: JSON.stringify(site) });

  await publicarNoGithub(secrets, executorDoSistema, CONFIG.workflowPublicacao);

  console.log(`✔ ${pessoas.length} pessoa(s)${site ? " + landing page" : ""} enviada(s) e deploy iniciado:`);
  for (const pessoa of pessoas) console.log(`  /${nomeDaPagina(pessoa)}  (${pessoa.nome})`);
  console.log('  Acompanhe com "gh run watch". Leva cerca de 1 minuto para entrar no ar.');
});
