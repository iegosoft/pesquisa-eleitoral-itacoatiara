import { useEffect, useState } from 'react';
import AvatarCandidato from '../../components/AvatarCandidato.jsx';
import { observarCandidatos } from '../../services/candidatos.js';
import FormularioCandidato from './FormularioCandidato.jsx';
import styles from './PainelCandidatos.module.css';

function ListaCandidatos({ titulo, candidatos, aoEditar }) {
  return (
    <div className={styles.grupo}>
      <h3>{titulo}</h3>
      {candidatos.length === 0 && <p className={styles.vazio}>Nenhum candidato cadastrado.</p>}
      {candidatos.map((candidato) => (
        <button
          key={candidato.id}
          type="button"
          className={styles.item}
          onClick={() => aoEditar(candidato)}
        >
          <AvatarCandidato candidato={candidato} />
          <span className={styles.infoCandidato}>
            <span className={styles.nome}>{candidato.nome}</span>
            <span className={styles.partido}>{candidato.partido}</span>
          </span>
          {candidato.isFoco && <span className={styles.badgeFoco}>Foco</span>}
        </button>
      ))}
    </div>
  );
}

function PainelCandidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoEmEdicao, setCandidatoEmEdicao] = useState(null);

  useEffect(() => observarCandidatos(setCandidatos), []);

  const candidatosFederal = candidatos.filter((candidato) => candidato.cargo === 'federal');
  const candidatosEstadual = candidatos.filter((candidato) => candidato.cargo === 'estadual');

  return (
    <div className={styles.painel}>
      <div className={styles.listas}>
        <ListaCandidatos
          titulo="Deputado Federal"
          candidatos={candidatosFederal}
          aoEditar={setCandidatoEmEdicao}
        />
        <ListaCandidatos
          titulo="Deputado Estadual"
          candidatos={candidatosEstadual}
          aoEditar={setCandidatoEmEdicao}
        />
      </div>

      <FormularioCandidato
        candidatoEmEdicao={candidatoEmEdicao}
        aoConcluir={() => setCandidatoEmEdicao(null)}
        aoCancelar={() => setCandidatoEmEdicao(null)}
      />
    </div>
  );
}

export default PainelCandidatos;
