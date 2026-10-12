import { VOTO_BRANCO_NULO, VOTO_INDECISO, VOTOS_NEUTROS } from '../../../dominio/opcoes.js';

function nomeDoVoto(valor, candidatos) {
  const neutro = VOTOS_NEUTROS.find((opcao) => opcao.valor === valor);
  if (neutro) return neutro.rotulo;
  return candidatos.find((candidato) => candidato.id === valor)?.nome ?? '';
}

// Retorna o id do candidato, VOTO_INDECISO, VOTO_BRANCO_NULO, ou null se o
// texto não corresponder a nada (erro de digitação na planilha). Os textos
// aceitos abaixo são o que a pessoa digita na planilha, não o valor gravado.
function idDoVoto(texto, candidatosDoCargo) {
  const normalizado = texto.trim().toLowerCase();
  if (!normalizado) return null;
  if (normalizado === 'indeciso') return VOTO_INDECISO;
  if (['branco', 'nulo', 'branco/nulo', 'branco_nulo'].includes(normalizado)) return VOTO_BRANCO_NULO;

  const candidato = candidatosDoCargo.find((c) => c.nome.trim().toLowerCase() === normalizado);
  return candidato ? candidato.id : null;
}

export { nomeDoVoto, idDoVoto };
