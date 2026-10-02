// Paleta fixa de identidade eleitoral: federal é sempre a série azul/ciano,
// estadual é sempre a violeta, em qualquer gráfico, sem variar por ranking ou
// resultado. Os tons vêm do tema (theme.css), que escolhe a versão certa para
// o fundo claro ou escuro.
const COR_FEDERAL = 'var(--cor-serie-federal)';
const COR_ESTADUAL = 'var(--cor-serie-estadual)';

function corFoco(cargo) {
  return cargo === 'estadual' ? COR_ESTADUAL : COR_FEDERAL;
}

// Diferença (em pontos percentuais) até o líder pra ainda contar como
// "empate" no bairro. Sem essa margem, qualquer diferença mínima apareceria
// como "perde", o que exageraria o resultado num universo pequeno de
// entrevistados por bairro.
const MARGEM_EMPATE = 5;

// Classifica o candidato foco (no total ou num bairro): lidera, empata (dentro da
// margem) ou perde, comparando com o maior percentual entre os candidatos
// do mesmo cargo. "Sem dados" quando ninguém tem voto registrado.
function statusFoco(percentualFoco, maiorPercentual) {
  if (maiorPercentual <= 0) return 'sem_dados';
  if (percentualFoco >= maiorPercentual) return 'lidera';
  if (maiorPercentual - percentualFoco <= MARGEM_EMPATE) return 'empate';
  return 'perde';
}

export { corFoco, statusFoco, MARGEM_EMPATE };
