import { useAuth } from '../contexts/useAuth.js';
import { iniciais } from '../utils/texto.js';
import styles from './Cabecalho.module.css';

const ROTULO_POR_ROLE = {
  admin: 'Administrador',
  pesquisador: 'Pesquisador',
};

function Cabecalho({ secaoAtual, titulo, subtitulo }) {
  const { nome, role } = useAuth();

  return (
    <header className={styles.cabecalho}>
      <div className={styles.linhaSuperior}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <span>Painel administrativo</span>
          <span className={styles.separador}>/</span>
          <span className={styles.breadcrumbAtual}>{secaoAtual}</span>
        </nav>

        {nome && (
          <div className={styles.usuario}>
            <span className={styles.avatar}>{iniciais(nome)}</span>
            <span className={styles.usuarioInfo}>
              <span className={styles.usuarioNome}>{nome}</span>
              <span className={styles.usuarioRole}>{ROTULO_POR_ROLE[role] ?? role}</span>
            </span>
          </div>
        )}
      </div>

      <div className={styles.titulos}>
        <h1 id="titulo-pagina" tabIndex={-1}>
          {titulo}
        </h1>
        <p>{subtitulo}</p>
      </div>
    </header>
  );
}

export default Cabecalho;
