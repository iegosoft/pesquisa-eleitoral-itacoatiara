// Iniciais do primeiro e do último nome, em maiúsculas: "Iego Costa" -> "IC".
function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

// Escolhe a forma da palavra conforme a quantidade:
// pluralizar(1, 'voto', 'votos') -> "voto"; pluralizar(3, 'voto', 'votos') -> "votos".
function pluralizar(quantidade, singular, plural) {
  return quantidade === 1 ? singular : plural;
}

export { iniciais, pluralizar };
