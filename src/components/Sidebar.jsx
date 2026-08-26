import { sair } from '../services/auth.js';
import styles from './Sidebar.module.css';

const ICONES = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  candidatos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </svg>
  ),
  dados: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
    </svg>
  ),
  sair: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path d="M9 12h11m0 0-3-3m3 3-3 3" />
    </svg>
  ),
};

const ITENS = [
  { valor: 'dashboard', rotulo: 'Dashboard', icone: 'dashboard' },
  { valor: 'candidatos', rotulo: 'Candidatos', icone: 'candidatos' },
  { valor: 'dados', rotulo: 'Dados', icone: 'dados' },
];

function Sidebar({ abaAtiva, aoNavegar }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMarca}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M5 19V13" />
            <path d="M12 19V6" />
            <path d="M19 19V10" />
          </svg>
        </span>
        <span className={styles.logoTexto}>
          Pesquisa
          <br />
          Eleitoral
        </span>
      </div>

      <nav className={styles.nav}>
        {ITENS.map((item) => (
          <button
            key={item.valor}
            type="button"
            className={`${styles.item} ${abaAtiva === item.valor ? styles.itemAtivo : ''}`}
            onClick={() => aoNavegar(item.valor)}
          >
            <span className={styles.itemIcone}>{ICONES[item.icone]}</span>
            {item.rotulo}
          </button>
        ))}
      </nav>

      <button type="button" className={styles.botaoSair} onClick={sair}>
        <span className={styles.itemIcone}>{ICONES.sair}</span>
        Sair
      </button>
    </aside>
  );
}

export default Sidebar;
