// Cor por posição no ranking, dentro do matiz da própria eleição (azul pro
// federal, roxo pro estadual — igual ao mockup de referência): o 1º lugar
// leva o tom mais forte, os seguintes vão clareando. A cor aqui é ordinal
// (indica posição, não identidade fixa do candidato) — 4 degraus, validados
// como rampa ordinal (luminosidade monótona, degraus visíveis, ponta clara
// ainda legível sobre o fundo branco — skill de dataviz, --ordinal). Além
// da 4ª posição, repete o tom mais claro.
const RAMPA_FEDERAL = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa'];
const RAMPA_ESTADUAL = ['#4c1d95', '#7c3aed', '#8b5cf6', '#a78bfa'];

const COR_INDECISO = '#d3d1c7';
const COR_BRANCO_NULO = '#e1e0d9';
const COR_FOCO_FEDERAL = '#0f6e56';
const COR_FOCO_ESTADUAL = '#5dcaa5';
// Base do mapa de calor pra linha de candidato não-foco: aqui a cor
// carrega intensidade (percentual, via opacidade), não identidade — quem é
// quem já está no rótulo da linha —, por isso fica neutra, fora da
// paleta categórica de candidato.
const COR_NEUTRA_MAPA_CALOR = '#73726c';

function corFoco(cargo) {
  return cargo === 'estadual' ? COR_FOCO_ESTADUAL : COR_FOCO_FEDERAL;
}

function corPorRanking(indiceEntreCandidatos, cargo) {
  const rampa = cargo === 'estadual' ? RAMPA_ESTADUAL : RAMPA_FEDERAL;
  return rampa[Math.min(indiceEntreCandidatos, rampa.length - 1)];
}

function corItemIntencaoVoto(item, indiceEntreCandidatos, cargo) {
  if (item.tipo === 'indeciso') return COR_INDECISO;
  if (item.tipo === 'branco_nulo') return COR_BRANCO_NULO;
  return corPorRanking(indiceEntreCandidatos, cargo);
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
  const corBase = isFoco ? corFoco(cargo) : COR_NEUTRA_MAPA_CALOR;
  if (percentual <= 0) return 'transparent';
  const alpha = 0.12 + (Math.min(percentual, 100) / 100) * 0.78;
  return hexParaRgba(corBase, alpha);
}

export { corFoco, corItemIntencaoVoto, corMapaCalor, COR_INDECISO, COR_BRANCO_NULO };
