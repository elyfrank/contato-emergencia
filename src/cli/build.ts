import { readFile } from "node:fs/promises";
import { relative } from "node:path";
import { ErroDeDados } from "../dominio/erros.ts";
import { nomeDaPagina } from "../dominio/pessoa.ts";
import { PAGINA_EXEMPLO, PAGINA_LANDING } from "../site/exemplo.ts";
import { gerarSite } from "../site/gerar-site.ts";
import { gravarSite } from "../site/publicar.ts";
import { carregarPessoas, escolherFonte } from "./carregar-pessoas.ts";
import { carregarSite } from "./carregar-site.ts";
import { CONFIG } from "./config.ts";
import { executar } from "./executar.ts";

await executar(async () => {
  const pessoas = await carregarPessoas(escolherFonte());
  if (pessoas.length === 0) {
    throw new ErroDeDados([
      `nenhuma pessoa cadastrada (crie com "npm run nova-pessoa" ou defina ${CONFIG.variavelDados})`,
    ]);
  }
  const site = await carregarSite();

  const estilos = await readFile(CONFIG.arquivoEstilos, "utf8");
  const landing = site ? { site, estilos: await readFile(CONFIG.arquivoEstilosLanding, "utf8") } : undefined;
  await gravarSite(CONFIG.diretorioSaida, gerarSite({ pessoas, estilos, ...(landing ? { landing } : {}) }));

  const saida = relative(process.cwd(), CONFIG.diretorioSaida) || ".";
  console.log(`✔ ${pessoas.length} página(s) gerada(s) em ${saida}/${site ? " + landing page" : ""}`);
  if (CONFIG.emCi) return;
  if (site) console.log(`  /${PAGINA_LANDING}  (home)\n  /${PAGINA_EXEMPLO}  (demonstração)`);
  for (const pessoa of pessoas) console.log(`  /${nomeDaPagina(pessoa)}  (${pessoa.nome})`);
});
