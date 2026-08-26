// Paleta fixa de identidade eleitoral: federal é sempre azul, estadual é
// sempre roxo — em qualquer gráfico, sem variar por ranking ou resultado.
// Indeciso e branco/nulo são neutros, fora da paleta de candidato.
const COR_FEDERAL = '#2563eb';
const COR_ESTADUAL = '#7c3aed';
const COR_INDECISO = '#94a3b8';
const COR_BRANCO_NULO = '#cbd5e1';

// Status do candidato foco por bairro (não é identidade, é resultado
// relativo aos concorrentes ali).
const COR_MAPA_LIDERA = '#15803d';
const COR_MAPA_EMPATE = '#f59e0b';
const COR_MAPA_PERDE = '#dc2626';
const COR_MAPA_SEM_DADOS = '#cbd5e1';

function corFoco(cargo) {
  return cargo === 'estadual' ? COR_ESTADUAL : COR_FEDERAL;
}

function corItemIntencaoVoto(item, cargo) {
  if (item.tipo === 'indeciso') return COR_INDECISO;
  if (item.tipo === 'branco_nulo') return COR_BRANCO_NULO;
  return corFoco(cargo);
}

// Diferença (em pontos percentuais) até o líder pra ainda contar como
// "empate" no mapa por bairro. Sem essa margem, qualquer diferença mínima
// apareceria como "perde", o que exageraria o resultado num universo
// pequeno de entrevistados por bairro.
const MARGEM_EMPATE_MAPA = 5;

// Classifica o candidato foco em cada bairro: lidera, empata (dentro da
// margem) ou perde, comparando com o maior percentual entre os candidatos
// daquele bairro. "Sem dados" quando ninguém tem voto registrado ali.
function statusFocoPorBairro(percentualFoco, maiorPercentual) {
  if (maiorPercentual <= 0) return 'sem_dados';
  if (percentualFoco >= maiorPercentual) return 'lidera';
  if (maiorPercentual - percentualFoco <= MARGEM_EMPATE_MAPA) return 'empate';
  return 'perde';
}

function corStatusMapa(status) {
  switch (status) {
    case 'lidera':
      return COR_MAPA_LIDERA;
    case 'empate':
      return COR_MAPA_EMPATE;
    case 'perde':
      return COR_MAPA_PERDE;
    default:
      return COR_MAPA_SEM_DADOS;
  }
}

export { corFoco, corItemIntencaoVoto, statusFocoPorBairro, corStatusMapa, COR_INDECISO, COR_BRANCO_NULO };
