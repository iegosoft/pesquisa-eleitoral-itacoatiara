import { useState } from 'react';
import { buscarResidencias, buscarTodosEntrevistados } from '../../../services/estatisticas.js';
import { buscarCandidatos } from '../../../services/candidatos.js';
import { listarPesquisadores } from '../../../services/usuarios.js';
import { nomeDoVoto } from './resolverVoto.js';
import { formatarDataBr } from './utilData.js';
import { baixarWorkbook, estilizarPlanilha, COR_CABECALHO_EXPORTACAO } from './utilPlanilha.js';
import styles from './PainelDados.module.css';

const COLUNAS = [
  { header: 'Bairro', key: 'bairro', width: 18 },
  { header: 'Data da coleta', key: 'data_coleta', width: 14 },
  { header: 'Pesquisador', key: 'pesquisador', width: 22 },
  { header: 'Moradores na casa', key: 'qtd_moradores', width: 16 },
  { header: 'Sexo', key: 'sexo', width: 12 },
  { header: 'Faixa etária', key: 'faixa_idade', width: 12 },
  { header: 'Voto federal', key: 'voto_federal', width: 20 },
  { header: 'Voto estadual', key: 'voto_estadual', width: 20 },
  { header: 'ID da casa', key: 'residencia_id', width: 22 },
  { header: 'ID do morador', key: 'entrevistado_id', width: 22 },
];

async function montarLinhas() {
  const [residencias, entrevistados, candidatos, pesquisadores] = await Promise.all([
    buscarResidencias(),
    buscarTodosEntrevistados(),
    buscarCandidatos(),
    listarPesquisadores(),
  ]);

  const residenciasPorId = Object.fromEntries(residencias.map((residencia) => [residencia.id, residencia]));
  const nomePorPesquisadorId = Object.fromEntries(pesquisadores.map((p) => [p.uid, p.nome]));

  return entrevistados.map((entrevistado) => {
    const residencia = residenciasPorId[entrevistado.residenciaId];
    return {
      residencia_id: entrevistado.residenciaId,
      entrevistado_id: entrevistado.id,
      bairro: residencia?.bairro ?? '',
      data_coleta: formatarDataBr(residencia?.dataColeta),
      pesquisador: nomePorPesquisadorId[residencia?.pesquisadorId] ?? residencia?.pesquisadorId ?? '',
      qtd_moradores: residencia?.qtdMoradores ?? '',
      sexo: entrevistado.sexo,
      faixa_idade: entrevistado.faixaIdade,
      voto_federal: nomeDoVoto(entrevistado.votoFederal, candidatos),
      voto_estadual: nomeDoVoto(entrevistado.votoEstadual, candidatos),
    };
  });
}

async function gerarEBaixarPlanilha() {
  const [{ default: ExcelJS }, linhas] = await Promise.all([import('exceljs'), montarLinhas()]);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Dados brutos');
  worksheet.columns = COLUNAS;
  worksheet.addRows(linhas);
  estilizarPlanilha(worksheet, { corCabecalho: COR_CABECALHO_EXPORTACAO, ultimaColuna: 'J' });

  const dataDeHoje = new Date().toISOString().slice(0, 10);
  await baixarWorkbook(workbook, `pesquisa-eleitoral-itacoatiara-${dataDeHoje}.xlsx`);
}

function ExportarPlanilha() {
  const [exportando, setExportando] = useState(false);
  const [erro, setErro] = useState('');

  async function aoClicar() {
    setErro('');
    setExportando(true);
    try {
      await gerarEBaixarPlanilha();
    } catch {
      setErro('Não foi possível gerar o arquivo. Tente novamente.');
    } finally {
      setExportando(false);
    }
  }

  return (
    <div className={styles.cartao}>
      <h3>Exportar dados</h3>
      <p className={styles.descricao}>
        Baixa uma planilha Excel com todos os dados brutos coletados até agora: uma linha por morador
        entrevistado, com bairro, data, pesquisador e as respostas.
      </p>
      <button type="button" className={styles.botaoPrimario} onClick={aoClicar} disabled={exportando}>
        {exportando ? 'Gerando planilha...' : 'Exportar planilha'}
      </button>
      {erro && <p className={styles.erro}>{erro}</p>}
    </div>
  );
}

export default ExportarPlanilha;
