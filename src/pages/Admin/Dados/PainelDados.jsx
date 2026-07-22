import ExportarPlanilha from './ExportarPlanilha.jsx';
import ImportarPlanilha from './ImportarPlanilha.jsx';
import CadastroManual from './CadastroManual.jsx';
import styles from './PainelDados.module.css';

function PainelDados() {
  return (
    <div className={styles.painel}>
      <ExportarPlanilha />
      <ImportarPlanilha />
      <CadastroManual />
    </div>
  );
}

export default PainelDados;
