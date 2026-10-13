import styles from './LogoSistema.module.css';

// Logo oficial do sistema (public/icons), recortada na moldura. Decorativa:
// o nome do sistema sempre aparece em texto ao lado.
function LogoSistema({ tamanho }) {
  return (
    <span className={styles.moldura} style={{ width: tamanho, height: tamanho }} aria-hidden="true">
      <img src="/icons/icon-192.png" alt="" />
    </span>
  );
}

export default LogoSistema;
