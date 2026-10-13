import { sair } from '../services/auth.js';
import { useAuth } from '../contexts/useAuth.js';
import BotaoTema from './BotaoTema.jsx';
import LogoSistema from './LogoSistema.jsx';
import styles from './BarraTopo.module.css';

function BarraTopo() {
  const { nome } = useAuth();

  return (
    <header className={styles.barra}>
      <div className={styles.marca}>
        <LogoSistema tamanho={36} />
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
