import { useEffect, useState } from 'react';
import FormularioCasa from '../../../components/coleta/FormularioCasa.jsx';
import { observarBairros } from '../../../services/bairros.js';
import { observarCandidatosPorCargo } from '../../../services/candidatos.js';
import { listarPesquisadores } from '../../../services/usuarios.js';
import { salvarResidencia } from '../../../services/residencias.js';
import styles from './PainelDados.module.css';

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function CadastroManual() {
  const [pesquisadores, setPesquisadores] = useState(null);
  const [erroPesquisadores, setErroPesquisadores] = useState(false);
  const [pesquisadorId, setPesquisadorId] = useState('');
  const [data, setData] = useState(hoje);
  const [bairros, setBairros] = useState([]);
  const [candidatosFederal, setCandidatosFederal] = useState([]);
  const [candidatosEstadual, setCandidatosEstadual] = useState([]);

  useEffect(() => {
    listarPesquisadores()
      .then(setPesquisadores)
      .catch(() => setErroPesquisadores(true));
    const cancelarBairros = observarBairros(setBairros);
    const cancelarFederal = observarCandidatosPorCargo('federal', setCandidatosFederal);
    const cancelarEstadual = observarCandidatosPorCargo('estadual', setCandidatosEstadual);
    return () => {
      cancelarBairros();
      cancelarFederal();
      cancelarEstadual();
    };
  }, []);

  function aoSalvar(dados) {
    return salvarResidencia({
      bairro: dados.bairro,
      pesquisadorId,
      qtdMoradores: dados.quantidadeMoradores,
      entrevistados: dados.moradores,
      dataColeta: new Date(`${data}T12:00:00`),
    });
  }

  return (
    <div className={styles.cartao}>
      <h3>Cadastro manual</h3>
      <p className={styles.descricao}>
        Pra socorrer um pesquisador que não conseguiu usar o app sozinho: preenche a casa aqui mesmo, sem
        precisar montar uma planilha.
      </p>

      {erroPesquisadores && (
        <p className={styles.erro}>Não foi possível carregar a lista de pesquisadores. Tente recarregar a página.</p>
      )}

      {pesquisadores?.length === 0 && (
        <p className={styles.erro}>
          Nenhum pesquisador cadastrado ainda. Crie um usuário com papel "pesquisador" antes de continuar.
        </p>
      )}

      {pesquisadores && pesquisadores.length > 0 && (
        <>
          <label className={styles.campo}>
            Pesquisador
            <select
              className={styles.campoTexto}
              value={pesquisadorId}
              onChange={(evento) => setPesquisadorId(evento.target.value)}
            >
              <option value="" disabled>
                Selecione quem coletou
              </option>
              {pesquisadores.map((pesquisador) => (
                <option key={pesquisador.uid} value={pesquisador.uid}>
                  {pesquisador.nome}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.campo}>
            Data da coleta
            <input
              type="date"
              className={styles.campoTexto}
              value={data}
              max={hoje()}
              onChange={(evento) => setData(evento.target.value)}
            />
          </label>

          {pesquisadorId && (
            <FormularioCasa
              bairros={bairros}
              candidatosFederal={candidatosFederal}
              candidatosEstadual={candidatosEstadual}
              aoSalvar={aoSalvar}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CadastroManual;
