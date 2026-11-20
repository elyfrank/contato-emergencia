import { FonteDiretorio } from "../dados/fonte-diretorio.ts";
import { nomeDaPagina } from "../dominio/pessoa.ts";
import { executorDoSistema } from "../publicacao/executor.ts";
import { publicarNoGithub } from "../publicacao/publicar-github.ts";
import { carregarPessoas } from "./carregar-pessoas.ts";
import { CONFIG } from "./config.ts";
import { executar } from "./executar.ts";

await executar(async () => {
  const pessoas = await carregarPessoas(new FonteDiretorio(CONFIG.diretorioPessoas));
  await publicarNoGithub(pessoas, executorDoSistema, {
    nomeSecret: CONFIG.variavelDados,
    workflow: CONFIG.workflowPublicacao,
  });

  console.log(`✔ ${pessoas.length} pessoa(s) enviada(s) e deploy iniciado:`);
  for (const pessoa of pessoas) console.log(`  /${nomeDaPagina(pessoa)}  (${pessoa.nome})`);
  console.log('  Acompanhe com "gh run watch". Leva cerca de 1 minuto para entrar no ar.');
});
