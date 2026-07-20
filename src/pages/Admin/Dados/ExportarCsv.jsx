import { useState } from 'react';
import Papa from 'papaparse';
import { buscarResidencias, buscarTodosEntrevistados } from '../../../services/estatisticas.js';
import { buscarCandidatos } from '../../../services/candidatos.js';
import { listarPesquisadores } from '../../../services/usuarios.js';
import { nomeDoVoto } from './resolverVoto.js';
import { baixarArquivoCsv, formatarDataBr } from './utilCsv.js';
import styles from './PainelDados.module.css';

async function montarLinhasCsv() {
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

function ExportarCsv() {
  const [exportando, setExportando] = useState(false);
  const [erro, setErro] = useState('');

  async function aoClicar() {
    setErro('');
    setExportando(true);
    try {
      const linhas = await montarLinhasCsv();
      const csv = Papa.unparse(linhas);
      const dataDeHoje = new Date().toISOString().slice(0, 10);
      baixarArquivoCsv(`pesquisa-eleitoral-itacoatiara-${dataDeHoje}.csv`, csv);
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
        Baixa um CSV com todos os dados brutos coletados até agora: uma linha por morador entrevistado, com
        bairro, data, pesquisador e as respostas.
      </p>
      <button type="button" className={styles.botaoPrimario} onClick={aoClicar} disabled={exportando}>
        {exportando ? 'Gerando arquivo...' : 'Exportar CSV'}
      </button>
      {erro && <p className={styles.erro}>{erro}</p>}
    </div>
  );
}

export default ExportarCsv;
