import { sair } from '../services/auth.js';
import { useAuth } from '../contexts/useAuth.js';
import styles from './BarraTopo.module.css';

function BarraTopo() {
  const { nome } = useAuth();

  return (
    <header className={styles.barra}>
      {nome && <span>{nome}</span>}
      <button type="button" onClick={sair}>
        Sair
      </button>
    </header>
  );
}

export default BarraTopo;
