import type { RegistroBruto } from "../dominio/validacao.ts";

/**
 * De onde vêm os dados das pessoas. O build depende só desta abstração,
 * então trocar a origem (pasta local, secret do CI, API...) não muda o resto do código.
 */
export interface FontePessoas {
  carregar(): Promise<RegistroBruto[]>;
}
