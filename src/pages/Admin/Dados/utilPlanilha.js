const COR_CABECALHO_EXPORTACAO = 'FF0F6E56'; // verde escuro do sistema
const COR_CABECALHO_MODELO = 'FF2563EB'; // azul de ação/seleção do sistema
const COR_LINHA_PAR = 'FFF3F5F0';

async function baixarWorkbook(workbook, nomeArquivo) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Aplica o estilo padrão do sistema numa planilha: cabeçalho colorido em
// negrito, linha travada no topo, filtro automático e zebra suave nas
// linhas — só formatação visual, sem gradiente nem sombra.
function estilizarPlanilha(worksheet, { corCabecalho, ultimaColuna }) {
  const linhaCabecalho = worksheet.getRow(1);
  linhaCabecalho.eachCell((celula) => {
    celula.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    celula.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: corCabecalho } };
    celula.alignment = { vertical: 'middle' };
  });
  linhaCabecalho.height = 22;

  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  worksheet.autoFilter = `A1:${ultimaColuna}1`;

  worksheet.eachRow((linha, numeroLinha) => {
    if (numeroLinha === 1) return;
    if (numeroLinha % 2 === 0) {
      linha.eachCell({ includeEmpty: true }, (celula) => {
        celula.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COR_LINHA_PAR } };
      });
    }
    linha.eachCell((celula) => {
      celula.alignment = { vertical: 'middle' };
    });
  });
}

export { baixarWorkbook, estilizarPlanilha, COR_CABECALHO_EXPORTACAO, COR_CABECALHO_MODELO };
