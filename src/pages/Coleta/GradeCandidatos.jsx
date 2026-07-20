import AvatarCandidato from '../../components/AvatarCandidato.jsx';
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
          <AvatarCandidato candidato={candidato} />
          <span>{candidato.nome}</span>
        </button>
      ))}

      <button
        type="button"
        className={`${styles.opcao} ${valorSelecionado === 'indeciso' ? styles.selecionada : ''}`}
        onClick={() => aoSelecionar('indeciso')}
      >
        <span className={styles.avatarNeutro} style={{ background: 'var(--cor-indeciso)' }}>
          ?
        </span>
        <span>Indeciso</span>
      </button>

      <button
        type="button"
        className={`${styles.opcao} ${valorSelecionado === 'branco_nulo' ? styles.selecionada : ''}`}
        onClick={() => aoSelecionar('branco_nulo')}
      >
        <span className={styles.avatarNeutro} style={{ background: 'var(--cor-branco-nulo)' }}>
          —
        </span>
        <span>Branco/Nulo</span>
      </button>
    </div>
  );
}

export default GradeCandidatos;
