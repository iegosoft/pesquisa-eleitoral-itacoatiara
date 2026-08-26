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
const COR_SEM_DADOS = '#f1f5f9';
const COR_FOCO_FEDERAL = '#0f6e56';
const COR_FOCO_ESTADUAL = '#5dcaa5';

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

// Marca cada candidato com a posição dele no ranking (ignora indeciso e
// branco/nulo) — usado tanto pro gráfico de ranking quanto pro mapa de
// bairros, pra garantir que o mesmo candidato sempre apareça com a mesma
// cor nos dois lugares.
function comIndiceDeRanking(itens) {
  let indice = -1;
  return itens.map((item) => {
    if (item.tipo === 'candidato') indice += 1;
    return { ...item, indiceRanking: indice };
  });
}

export {
  corFoco,
  corPorRanking,
  corItemIntencaoVoto,
  comIndiceDeRanking,
  COR_INDECISO,
  COR_BRANCO_NULO,
  COR_SEM_DADOS,
};
