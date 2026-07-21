function nomeDoVoto(valor, candidatos) {
  if (valor === 'indeciso') return 'Indeciso';
  if (valor === 'branco_nulo') return 'Branco/Nulo';
  return candidatos.find((candidato) => candidato.id === valor)?.nome ?? '';
}

// Retorna o id do candidato, 'indeciso', 'branco_nulo', ou null se o texto
// não corresponder a nada (erro de digitação na planilha).
function idDoVoto(texto, candidatosDoCargo) {
  const normalizado = texto.trim().toLowerCase();
  if (!normalizado) return null;
  if (normalizado === 'indeciso') return 'indeciso';
  if (['branco', 'nulo', 'branco/nulo', 'branco_nulo'].includes(normalizado)) return 'branco_nulo';

  const candidato = candidatosDoCargo.find((c) => c.nome.trim().toLowerCase() === normalizado);
  return candidato ? candidato.id : null;
}

export { nomeDoVoto, idDoVoto };
