import { sair } from '../services/auth.js';
import { useAuth } from '../contexts/useAuth.js';
import styles from './BarraTopo.module.css';

function BarraTopo() {
  const { nome } = useAuth();

  return (
    <header className={styles.barra}>
      {nome && <span className={styles.nome}>{nome}</span>}
      <button type="button" className={styles.botaoSair} onClick={sair}>
        Sair
      </button>
    </header>
  );
}

export default BarraTopo;
