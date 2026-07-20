import Papa from 'papaparse';
import { baixarArquivoCsv } from './utilCsv.js';

const COLUNAS_MODELO = [
  'casa_id',
  'bairro',
  'data_coleta',
  'pesquisador',
  'qtd_moradores',
  'sexo',
  'faixa_idade',
  'voto_federal',
  'voto_estadual',
];

const LINHAS_EXEMPLO = [
  {
    casa_id: '1',
    bairro: 'Centro',
    data_coleta: '15/07/2026',
    pesquisador: 'Maria Souza',
    qtd_moradores: '3',
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
    qtd_moradores: '3',
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
    qtd_moradores: '1',
    sexo: 'masculino',
    faixa_idade: '35-44',
    voto_federal: 'Maria Paes',
    voto_estadual: 'Branco/Nulo',
  },
];

function baixarModeloCsv() {
  const csv = Papa.unparse({ fields: COLUNAS_MODELO, data: LINHAS_EXEMPLO });
  baixarArquivoCsv('modelo-importacao-pesquisa-eleitoral.csv', csv);
}

export { baixarModeloCsv, COLUNAS_MODELO };
