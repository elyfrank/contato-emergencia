import { readFile } from "node:fs/promises";
import { relative } from "node:path";
import { ErroDeDados } from "../dominio/erros.ts";
import { nomeDaPagina } from "../dominio/pessoa.ts";
import { gerarSite } from "../site/gerar-site.ts";
import { gravarSite } from "../site/publicar.ts";
import { carregarPessoas, escolherFonte } from "./carregar-pessoas.ts";
import { CONFIG } from "./config.ts";
import { executar } from "./executar.ts";

await executar(async () => {
  const pessoas = await carregarPessoas(escolherFonte());
  if (pessoas.length === 0) {
    throw new ErroDeDados([
      `nenhuma pessoa cadastrada (crie com "npm run nova-pessoa" ou defina ${CONFIG.variavelDados})`,
    ]);
  }

  const estilos = await readFile(CONFIG.arquivoEstilos, "utf8");
  const arquivos = gerarSite(pessoas, estilos);
  await gravarSite(CONFIG.diretorioSaida, arquivos);

  const saida = relative(process.cwd(), CONFIG.diretorioSaida) || ".";
  console.log(`✔ ${pessoas.length} página(s) gerada(s) em ${saida}/`);
  for (const pessoa of pessoas) console.log(`  /${nomeDaPagina(pessoa)}  (${pessoa.nome})`);
});
