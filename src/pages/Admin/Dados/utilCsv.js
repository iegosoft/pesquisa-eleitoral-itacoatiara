function baixarArquivoCsv(nomeArquivo, conteudoCsv) {
  const blob = new Blob([`﻿${conteudoCsv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatarDataBr(data) {
  if (!data) return '';
  return data.toLocaleDateString('pt-BR');
}

// Aceita "DD/MM/AAAA". Retorna null se o texto não for uma data válida.
function parseDataBr(texto) {
  const partes = texto.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!partes) return null;
  const [, dia, mes, ano] = partes;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const valida =
    data.getFullYear() === Number(ano) && data.getMonth() === Number(mes) - 1 && data.getDate() === Number(dia);
  return valida ? data : null;
}

export { baixarArquivoCsv, formatarDataBr, parseDataBr };
