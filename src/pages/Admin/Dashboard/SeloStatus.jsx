import styles from './SeloStatus.module.css';

// O status nunca depende só da cor: cada um tem ícone e texto próprios.
const STATUS = {
  lidera: { rotulo: 'Lidera', icone: '▲' },
  empate: { rotulo: 'Empate', icone: '=' },
  perde: { rotulo: 'Perde', icone: '▼' },
  sem_dados: { rotulo: 'Sem votos', icone: '–' },
};

function SeloStatus({ status, children, grande = false }) {
  const { rotulo, icone } = STATUS[status];
  return (
    <span className={`${styles.selo} ${styles[status]} ${grande ? styles.grande : ''}`}>
      <span aria-hidden="true">{icone}</span>
      {children ?? rotulo}
    </span>
  );
}

export default SeloStatus;
