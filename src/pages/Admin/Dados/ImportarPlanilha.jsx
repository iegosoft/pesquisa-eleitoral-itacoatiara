import { useState } from 'react';
import { buscarCandidatos } from '../../../services/candidatos.js';
import { listarPesquisadores } from '../../../services/usuarios.js';
import { salvarResidencia } from '../../../services/residencias.js';
import { validarLinhas } from './validarImportacao.js';
import { baixarModeloXlsx } from './modeloXlsx.js';
import { lerArquivoImportacao } from './lerArquivoImportacao.js';
import styles from './PainelDados.module.css';

function ImportarPlanilha() {
  const [status, setStatus] = useState('ocioso');
  const [erros, setErros] = useState([]);
  const [casas, setCasas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');

  async function processarArquivo(arquivo) {
    setStatus('validando');
    setMensagemErro('');
    setResultado(null);
    try {
      const [linhas, candidatos, pesquisadores] = await Promise.all([
        lerArquivoImportacao(arquivo),
        buscarCandidatos(),
        listarPesquisadores(),
      ]);
      const candidatosFederal = candidatos.filter((c) => c.cargo === 'federal');
      const candidatosEstadual = candidatos.filter((c) => c.cargo === 'estadual');

      const { erros: errosValidacao, casas: casasValidadas } = validarLinhas(linhas, {
        candidatosFederal,
        candidatosEstadual,
        pesquisadores,
      });
      setErros(errosValidacao);
      setCasas(casasValidadas);
      setStatus(errosValidacao.length > 0 ? 'com-erros' : 'pronto');
    } catch {
      setMensagemErro('Não foi possível ler o arquivo. Confira se é um .csv ou .xlsx válido.');
      setStatus('ocioso');
    }
  }

  function aoSelecionarArquivo(evento) {
    const arquivo = evento.target.files[0];
    evento.target.value = '';
    if (arquivo) processarArquivo(arquivo);
  }

  async function confirmarImportacao() {
    setStatus('importando');
    try {
      await Promise.all(casas.map((casa) => salvarResidencia(casa)));
      const totalEntrevistados = casas.reduce((soma, casa) => soma + casa.entrevistados.length, 0);
      setResultado({ casas: casas.length, entrevistados: totalEntrevistados });
      setCasas([]);
      setStatus('concluido');
    } catch {
      setMensagemErro('Falha ao gravar os dados. Tente novamente.');
      setStatus('pronto');
    }
  }

  function cancelar() {
    setStatus('ocioso');
    setErros([]);
    setCasas([]);
  }

  const totalEntrevistadosPendentes = casas.reduce((soma, casa) => soma + casa.entrevistados.length, 0);

  return (
    <div className={styles.cartao}>
      <h3>Inserção em lote</h3>
      <p className={styles.descricao}>
        Pra digitar retroativamente dados coletados em papel. Baixe o modelo, preencha uma linha por morador
        entrevistado (moradores da mesma casa usam o mesmo "casa_id") e envie o arquivo.
      </p>

      <div className={styles.acoes}>
        <button type="button" className={styles.botaoSecundario} onClick={baixarModeloXlsx}>
          Baixar modelo
        </button>

        <label className={styles.botaoArquivo}>
          {status === 'validando' ? 'Lendo arquivo...' : 'Escolher arquivo'}
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={aoSelecionarArquivo}
            disabled={status === 'validando' || status === 'importando'}
          />
        </label>
      </div>

      {mensagemErro && <p className={styles.erro}>{mensagemErro}</p>}

      {status === 'com-erros' && (
        <div className={styles.blocoErros}>
          <p>{erros.length} linha(s) com problema — corrija o arquivo e envie de novo:</p>
          <ul>
            {erros.slice(0, 20).map((erro) => (
              <li key={erro.linha}>
                Linha {erro.linha}: {erro.mensagens.join('; ')}
              </li>
            ))}
          </ul>
          {erros.length > 20 && <p>...e mais {erros.length - 20} linha(s).</p>}
          <button type="button" className={styles.botaoSecundario} onClick={cancelar}>
            Fechar
          </button>
        </div>
      )}

      {status === 'pronto' && (
        <div className={styles.blocoConfirmacao}>
          <p>
            Arquivo validado: {casas.length} casa(s), {totalEntrevistadosPendentes} morador(es) entrevistado(s).
          </p>
          <div className={styles.acoes}>
            <button type="button" className={styles.botaoSecundario} onClick={cancelar}>
              Cancelar
            </button>
            <button type="button" className={styles.botaoPrimario} onClick={confirmarImportacao}>
              Confirmar importação
            </button>
          </div>
        </div>
      )}

      {status === 'importando' && <p>Importando...</p>}

      {status === 'concluido' && resultado && (
        <p className={styles.sucesso}>
          Importação concluída: {resultado.casas} casa(s) e {resultado.entrevistados} morador(es) adicionados.
        </p>
      )}
    </div>
  );
}

export default ImportarPlanilha;
