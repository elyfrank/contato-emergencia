const DDI_BRASIL = "55";
/** 55 + DDD (sem zero) + celular (9 + 8 dígitos) ou fixo (2-5 + 7 dígitos). */
const TELEFONE_BRASIL_COMPLETO = /^55[1-9]{2}(?:9\d{8}|[2-5]\d{7})$/;

/**
 * Normaliza um telefone brasileiro para só dígitos com DDI (ex.: "5562999998888").
 * Aceita qualquer formatação: "(62) 99999-8888", "+55 62 99999 8888", "62999998888"...
 * Retorna null se não for um número brasileiro válido.
 */
export function normalizarTelefone(entrada: string): string | null {
  const digitos = entrada.replace(/\D/g, "");
  const temDdiExplicito = entrada.trim().startsWith("+");
  const semDdi = !temDdiExplicito && (digitos.length === 10 || digitos.length === 11);
  const completo = semDdi ? DDI_BRASIL + digitos : digitos;
  return TELEFONE_BRASIL_COMPLETO.test(completo) ? completo : null;
}

