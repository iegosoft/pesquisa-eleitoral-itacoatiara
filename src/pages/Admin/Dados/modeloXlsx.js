import { baixarWorkbook, estilizarPlanilha, COR_CABECALHO_MODELO } from './utilPlanilha.js';

const COLUNAS_MODELO = [
  { header: 'casa_id', key: 'casa_id', width: 10 },
  { header: 'bairro', key: 'bairro', width: 18 },
  { header: 'data_coleta', key: 'data_coleta', width: 14 },
  { header: 'pesquisador', key: 'pesquisador', width: 22 },
  { header: 'qtd_moradores', key: 'qtd_moradores', width: 14 },
  { header: 'sexo', key: 'sexo', width: 12 },
  { header: 'faixa_idade', key: 'faixa_idade', width: 12 },
  { header: 'voto_federal', key: 'voto_federal', width: 20 },
  { header: 'voto_estadual', key: 'voto_estadual', width: 20 },
];

const LINHAS_EXEMPLO = [
  {
    casa_id: '1',
    bairro: 'Centro',
    data_coleta: '15/07/2026',
    pesquisador: 'Maria Souza',
    qtd_moradores: 3,
    sexo: 'feminino',
    faixa_idade: '25-34',
    voto_federal: 'João Silva',
    voto_estadual: 'Ana Reis',
  },
  {
    casa_id: '1',
    bairro: 'Centro',
    data_coleta: '15/07/2026',
    pesquisador: 'Maria Souza',
    qtd_moradores: 3,
    sexo: 'masculino',
    faixa_idade: '60+',
    voto_federal: 'Indeciso',
    voto_estadual: 'Carlos T.',
  },
  {
    casa_id: '2',
    bairro: 'Colônia',
    data_coleta: '15/07/2026',
    pesquisador: 'Maria Souza',
    qtd_moradores: 1,
    sexo: 'masculino',
    faixa_idade: '35-44',
    voto_federal: 'Maria Paes',
    voto_estadual: 'Branco/Nulo',
  },
];

const LINHAS_INSTRUCOES = [
  ['Como preencher', ''],
  ['casa_id', 'Um código qualquer que você escolhe pra identificar a casa (ex.: "1", "2"...). Moradores da mesma casa repetem o mesmo casa_id e os mesmos dados de bairro/data/pesquisador/qtd_moradores.'],
  ['bairro', 'Nome do bairro, exatamente como está cadastrado no sistema.'],
  ['data_coleta', 'Data em que a pesquisa foi feita, no formato DD/MM/AAAA (ex.: 15/07/2026).'],
  ['pesquisador', 'Nome exatamente igual ao cadastrado no sistema (aba Candidatos > Pesquisadores, ou peça ao administrador).'],
  ['qtd_moradores', 'Quantas pessoas moram na casa (um número).'],
  ['sexo', 'feminino ou masculino.'],
  ['faixa_idade', '16-24, 25-34, 35-44, 45-59 ou 60+.'],
  ['voto_federal', 'Nome do candidato a deputado federal (igual ao cadastrado), ou Indeciso, ou Branco/Nulo.'],
  ['voto_estadual', 'Nome do candidato a deputado estadual (igual ao cadastrado), ou Indeciso, ou Branco/Nulo.'],
];

async function baixarModeloXlsx() {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();

  const dados = workbook.addWorksheet('Dados');
  dados.columns = COLUNAS_MODELO;
  dados.addRows(LINHAS_EXEMPLO);
  estilizarPlanilha(dados, { corCabecalho: COR_CABECALHO_MODELO, ultimaColuna: 'I' });

  const instrucoes = workbook.addWorksheet('Instruções');
  instrucoes.columns = [
    { header: 'Coluna', key: 'coluna', width: 16 },
    { header: 'O que colocar', key: 'texto', width: 90 },
  ];
  instrucoes.addRows(LINHAS_INSTRUCOES.map(([coluna, texto]) => ({ coluna, texto })));
  instrucoes.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  instrucoes.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COR_CABECALHO_MODELO } };
  instrucoes.getColumn('texto').alignment = { wrapText: true, vertical: 'middle' };

  await baixarWorkbook(workbook, 'modelo-importacao-pesquisa-eleitoral.xlsx');
}

export { baixarModeloXlsx, COLUNAS_MODELO };
