// Centraliza configurações de formatação de números e utilitários
//tempoDecimals define quantas casas decimais usar para conversões de tempo
export const tempoDecimals = 2;

export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  return n.toFixed(decimals);
}

export default {
  tempoDecimals,
  formatNumber,
};
