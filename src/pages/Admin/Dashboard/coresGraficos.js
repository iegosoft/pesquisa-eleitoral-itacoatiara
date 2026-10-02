// Paleta fixa de identidade eleitoral: federal é sempre a série azul/ciano,
// estadual é sempre a violeta, em qualquer gráfico, sem variar por ranking ou
// resultado. Os tons vêm do tema (theme.css), que escolhe a versão certa para
// o fundo claro ou escuro. Indeciso e branco/nulo são neutros.
const COR_FEDERAL = 'var(--cor-serie-federal)';
const COR_ESTADUAL = 'var(--cor-serie-estadual)';
const COR_INDECISO = 'var(--cor-grafico-indeciso)';
const COR_BRANCO_NULO = 'var(--cor-grafico-branco-nulo)';
// Candidato sem nenhum voto ainda: cor apagada em vez da cor cheia da
// eleição, senão uma lista com muitos candidatos zerados vira poluição
// visual (nome forte sem barra nenhuma pra justificar o destaque).
const COR_SEM_VOTOS = 'var(--cor-grafico-sem-votos)';

function corFoco(cargo) {
  return cargo === 'estadual' ? COR_ESTADUAL : COR_FEDERAL;
}

function corItemIntencaoVoto(item, cargo) {
  if (item.tipo === 'indeciso') return COR_INDECISO;
  if (item.tipo === 'branco_nulo') return COR_BRANCO_NULO;
  if (item.percentual <= 0) return COR_SEM_VOTOS;
  return corFoco(cargo);
}

// Diferença (em pontos percentuais) até o líder pra ainda contar como
// "empate" no bairro. Sem essa margem, qualquer diferença mínima apareceria
// como "perde", o que exageraria o resultado num universo pequeno de
// entrevistados por bairro.
const MARGEM_EMPATE = 5;

// Classifica o candidato foco em cada bairro: lidera, empata (dentro da
// margem) ou perde, comparando com o maior percentual entre os candidatos
// daquele bairro. "Sem dados" quando ninguém tem voto registrado ali.
function statusFocoPorBairro(percentualFoco, maiorPercentual) {
  if (maiorPercentual <= 0) return 'sem_dados';
  if (percentualFoco >= maiorPercentual) return 'lidera';
  if (maiorPercentual - percentualFoco <= MARGEM_EMPATE) return 'empate';
  return 'perde';
}

export { corFoco, corItemIntencaoVoto, statusFocoPorBairro, MARGEM_EMPATE };
