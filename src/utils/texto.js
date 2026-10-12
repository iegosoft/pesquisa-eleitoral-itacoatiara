// Iniciais do primeiro e do último nome, em maiúsculas: "Iego Costa" -> "IC".
function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export { iniciais };
