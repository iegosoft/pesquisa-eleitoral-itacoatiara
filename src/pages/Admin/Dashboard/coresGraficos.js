const GRADIENTE_CONCORRENTES = ['#73726c', '#b4b2a9', '#d3d1c7'];
const COR_INDECISO = '#d3d1c7';
const COR_BRANCO_NULO = '#e1e0d9';
const COR_FOCO_FEDERAL = '#0f6e56';
const COR_FOCO_ESTADUAL = '#5dcaa5';

function corFoco(cargo) {
  return cargo === 'estadual' ? COR_FOCO_ESTADUAL : COR_FOCO_FEDERAL;
}

function corItemIntencaoVoto(item, cargo) {
  if (item.tipo === 'indeciso') return COR_INDECISO;
  if (item.tipo === 'branco_nulo') return COR_BRANCO_NULO;
  if (item.isFoco) return corFoco(cargo);
  return GRADIENTE_CONCORRENTES[item.indiceConcorrente % GRADIENTE_CONCORRENTES.length];
}

function hexParaRgba(hex, alpha) {
  const valor = hex.replace('#', '');
  const r = parseInt(valor.slice(0, 2), 16);
  const g = parseInt(valor.slice(2, 4), 16);
  const b = parseInt(valor.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Intensidade proporcional ao percentual: base verde pro candidato foco,
// cinza pros demais, com um piso de opacidade pra célula nunca sumir.
function corMapaCalor(percentual, isFoco, cargo) {
  const corBase = isFoco ? corFoco(cargo) : GRADIENTE_CONCORRENTES[0];
  if (percentual <= 0) return 'transparent';
  const alpha = 0.12 + (Math.min(percentual, 100) / 100) * 0.78;
  return hexParaRgba(corBase, alpha);
}

export { corFoco, corItemIntencaoVoto, corMapaCalor, GRADIENTE_CONCORRENTES, COR_INDECISO, COR_BRANCO_NULO };
