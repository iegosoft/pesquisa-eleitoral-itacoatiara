// Paleta categórica de identidade — mesma lógica usada por institutos de
// pesquisa (Datafolha, Ipec etc.): cada candidato tem sua própria cor fixa,
// nunca reaproveitada pra indicar quem está na frente; indeciso e
// branco/nulo ficam neutros, fora da paleta de candidato. Oito matizes,
// ordem fixa, validados contra daltonismo (ΔE ≥ 8 adjacente, piso de visão
// normal ≥ 15 — ver skill de dataviz, references/palette.md). Três tons
// (aqua, amarelo, magenta) ficam abaixo de 3:1 de contraste sobre o fundo
// claro do app — por isso o gráfico nunca depende só da cor: rótulo direto
// do percentual em cada barra + legenda com texto sempre presentes.
const PALETA_CANDIDATOS = [
  '#2a78d6', // azul
  '#eb6834', // laranja
  '#1baf7a', // aqua
  '#eda100', // amarelo
  '#e87ba4', // magenta
  '#008300', // verde
  '#4a3aa7', // violeta
  '#e34948', // vermelho
];

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

// Hash estável do id do candidato pro índice da paleta: a cor de um
// candidato não muda conforme o resultado da votação nem a ordem da lista,
// só depende da identidade dele.
function corCandidato(id) {
  const soma = [...id].reduce((total, caractere) => total + caractere.charCodeAt(0), 0);
  return PALETA_CANDIDATOS[soma % PALETA_CANDIDATOS.length];
}

function corItemIntencaoVoto(item) {
  if (item.tipo === 'indeciso') return COR_INDECISO;
  if (item.tipo === 'branco_nulo') return COR_BRANCO_NULO;
  return corCandidato(item.chave);
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

export { corFoco, corCandidato, corItemIntencaoVoto, corMapaCalor, COR_INDECISO, COR_BRANCO_NULO };
