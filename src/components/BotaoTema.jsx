import { useTema } from '../contexts/useTema.js';
import styles from './BotaoTema.module.css';

const ICONE_SOL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const ICONE_LUA = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
  </svg>
);

// `compacto`: só o ícone (barra superior da coleta e login); o nome da ação
// continua disponível para o leitor de tela e na dica do mouse.
function BotaoTema({ compacto = false, className = '' }) {
  const { tema, alternarTema } = useTema();
  const proximo = tema === 'escuro' ? 'claro' : 'escuro';
  const rotulo = `Mudar para tema ${proximo}`;

  return (
    <button
      type="button"
      className={`${compacto ? styles.compacto : styles.completo} ${className}`}
      onClick={alternarTema}
      aria-label={compacto ? rotulo : undefined}
      title={rotulo}
    >
      <span className={styles.icone} aria-hidden="true">
        {tema === 'escuro' ? ICONE_SOL : ICONE_LUA}
      </span>
      {!compacto && <span>{`Tema ${proximo}`}</span>}
    </button>
  );
}

export default BotaoTema;
