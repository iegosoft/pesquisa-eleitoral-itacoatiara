// Percentual no formato brasileiro, com um número fixo de casas decimais:
// formatarPercentual(57.89, 1) -> "57,9%"; formatarPercentual(57.89, 0) -> "58%".
function formatarPercentual(valor, casasDecimais) {
  const numero = valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  });
  return `${numero}%`;
}

export { formatarPercentual };
