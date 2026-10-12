import { VOTO_BRANCO_NULO, VOTO_INDECISO } from '../../dominio/opcoes.js';
import AvatarCandidato from '../AvatarCandidato.jsx';
import styles from './GradeCandidatos.module.css';

function GradeCandidatos({ candidatos, valorSelecionado, aoSelecionar }) {
  return (
    <div className={styles.grade}>
      {candidatos.map((candidato) => (
        <button
          key={candidato.id}
          type="button"
          className={`${styles.opcao} ${valorSelecionado === candidato.id ? styles.selecionada : ''}`}
          onClick={() => aoSelecionar(candidato.id)}
        >
          <AvatarCandidato candidato={candidato} className={styles.foto} decorativo />
          <span>{candidato.nome}</span>
        </button>
      ))}

      <button
        type="button"
        className={`${styles.opcao} ${valorSelecionado === VOTO_INDECISO ? styles.selecionada : ''}`}
        onClick={() => aoSelecionar(VOTO_INDECISO)}
      >
        <span className={styles.avatarNeutro} aria-hidden="true" style={{ background: 'var(--cor-superficie-baixa)' }}>
          ?
        </span>
        <span>Indeciso</span>
      </button>

      <button
        type="button"
        className={`${styles.opcao} ${valorSelecionado === VOTO_BRANCO_NULO ? styles.selecionada : ''}`}
        onClick={() => aoSelecionar(VOTO_BRANCO_NULO)}
      >
        <span className={styles.avatarNeutro} aria-hidden="true" style={{ background: 'var(--cor-superficie-baixa)' }}>
          —
        </span>
        <span>Branco/Nulo</span>
      </button>
    </div>
  );
}

export default GradeCandidatos;
