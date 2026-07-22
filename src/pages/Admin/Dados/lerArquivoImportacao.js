import Papa from 'papaparse';

function paraTexto(valor) {
  if (valor instanceof Date) {
    const dia = String(valor.getDate()).padStart(2, '0');
    const mes = String(valor.getMonth() + 1).padStart(2, '0');
    const ano = valor.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
  return valor == null ? '' : String(valor).trim();
}

function lerArquivoCsv(arquivo) {
  return new Promise((resolve, reject) => {
    Papa.parse(arquivo, {
      header: true,
      skipEmptyLines: true,
      complete: (resultado) => resolve(resultado.data),
      error: reject,
    });
  });
}

async function lerArquivoXlsx(arquivo) {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await arquivo.arrayBuffer());
  const planilha = workbook.worksheets[0];
  if (!planilha) return [];

  const cabecalhos = [];
  planilha.getRow(1).eachCell((celula, coluna) => {
    cabecalhos[coluna] = paraTexto(celula.value);
  });

  const linhas = [];
  planilha.eachRow((linha, numeroLinha) => {
    if (numeroLinha === 1) return;
    const objeto = {};
    let temConteudo = false;
    linha.eachCell({ includeEmpty: true }, (celula, coluna) => {
      const chave = cabecalhos[coluna];
      if (!chave) return;
      const valor = paraTexto(celula.value);
      if (valor) temConteudo = true;
      objeto[chave] = valor;
    });
    if (temConteudo) linhas.push(objeto);
  });

  return linhas;
}

// Aceita tanto .csv quanto .xlsx/.xls, retornando sempre o mesmo formato:
// um array de objetos { nome_da_coluna: valor_em_texto }.
function lerArquivoImportacao(arquivo) {
  const nome = arquivo.name.toLowerCase();
  if (nome.endsWith('.csv')) return lerArquivoCsv(arquivo);
  if (nome.endsWith('.xlsx') || nome.endsWith('.xls')) return lerArquivoXlsx(arquivo);
  return Promise.reject(new Error('Formato de arquivo não suportado. Envie um .csv ou .xlsx.'));
}

export { lerArquivoImportacao };
