import { useState } from 'react';
import BarraTopo from '../../components/BarraTopo.jsx';
import PainelCandidatos from './PainelCandidatos.jsx';
import PainelDashboard from './Dashboard/PainelDashboard.jsx';
import styles from './PaginaAdmin.module.css';

const ABAS = [
  { valor: 'dashboard', rotulo: 'Dashboard' },
  { valor: 'candidatos', rotulo: 'Candidatos' },
];

function PaginaAdmin() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');

  return (
    <>
      <BarraTopo />
      <main className={styles.pagina}>
        <h1>Painel administrativo</h1>

        <nav className={styles.abas}>
          {ABAS.map((aba) => (
            <button
              key={aba.valor}
              type="button"
              className={`${styles.aba} ${abaAtiva === aba.valor ? styles.abaAtiva : ''}`}
              onClick={() => setAbaAtiva(aba.valor)}
            >
              {aba.rotulo}
            </button>
          ))}
        </nav>

        {abaAtiva === 'dashboard' && <PainelDashboard />}
        {abaAtiva === 'candidatos' && <PainelCandidatos />}
      </main>
    </>
  );
}

export default PaginaAdmin;
