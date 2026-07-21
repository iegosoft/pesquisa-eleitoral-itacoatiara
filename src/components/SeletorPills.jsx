import styles from './SeletorPills.module.css';

function SeletorPills({ opcoes, valorSelecionado, aoSelecionar }) {
  return (
    <div className={styles.linha}>
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          className={`${styles.pill} ${valorSelecionado === opcao.valor ? styles.selecionada : ''}`}
          onClick={() => aoSelecionar(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}

export default SeletorPills;
