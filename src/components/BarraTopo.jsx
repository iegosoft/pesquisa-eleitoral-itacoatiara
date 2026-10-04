import { sair } from '../services/auth.js';
import { useAuth } from '../contexts/useAuth.js';
import BotaoTema from './BotaoTema.jsx';
import styles from './BarraTopo.module.css';

function BarraTopo() {
  const { nome } = useAuth();

  return (
    <header className={styles.barra} data-tema="escuro">
      <div className={styles.marca}>
        <span className={styles.logoMarca} aria-hidden="true">
          <img src="/icons/icon-192.png" alt="" />
        </span>
        <span className={styles.logoTexto}>Pesquisa Eleitoral</span>
      </div>
      <div className={styles.usuario}>
        {nome && <span className={styles.nome}>{nome}</span>}
        <BotaoTema compacto />
        <button type="button" className={styles.botaoSair} onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  );
}

export default BarraTopo;
