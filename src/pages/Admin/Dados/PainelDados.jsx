import ExportarCsv from './ExportarCsv.jsx';
import ImportarCsv from './ImportarCsv.jsx';
import styles from './PainelDados.module.css';

function PainelDados() {
  return (
    <div className={styles.painel}>
      <ExportarCsv />
      <ImportarCsv />
    </div>
  );
}

export default PainelDados;
