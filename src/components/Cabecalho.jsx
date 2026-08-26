import { useAuth } from '../contexts/useAuth.js';
import styles from './Cabecalho.module.css';

const ROTULO_POR_ROLE = {
  admin: 'Administrador',
  pesquisador: 'Pesquisador',
};

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

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
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>
    </header>
  );
}

export default Cabecalho;
