import { ErroDeDados } from "../dominio/erros.ts";

/** Ponto de entrada comum dos comandos: erros viram mensagem legível + exit code 1. */
export async function executar(comando: () => Promise<void>, ajuda?: string): Promise<void> {
  try {
    await comando();
  } catch (erro) {
    if (erro instanceof ErroDeDados) {
      console.error(`✖ ${erro.message}`);
    } else {
      console.error(`✖ ${erro instanceof Error ? erro.message : String(erro)}`);
    }
    if (ajuda) console.error(`\n${ajuda}`);
    process.exitCode = 1;
  }
}
