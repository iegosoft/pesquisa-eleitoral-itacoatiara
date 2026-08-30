// Sem limite, um nome de candidato longo cresce livremente para a esquerda
// no rotulo do grafico (textAnchor="end") e ultrapassa a area visivel do
// SVG, cortando o proprio texto e o selo FOCO junto (ver bugs-e-classificacao.md).
function truncarRotulo(rotulo, limite = 16) {
  if (typeof rotulo !== 'string' || rotulo.length <= limite) return rotulo;
  return `${rotulo.slice(0, limite - 1).trimEnd()}…`;
}

export { truncarRotulo };
