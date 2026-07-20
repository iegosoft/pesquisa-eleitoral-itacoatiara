import { useState } from 'react';
import BarraTopo from '../../components/BarraTopo.jsx';
import PainelCandidatos from './PainelCandidatos.jsx';
import styles from './PaginaAdmin.module.css';

const ABAS = [
  { valor: 'candidatos', rotulo: 'Candidatos' },
  { valor: 'dashboard', rotulo: 'Dashboard' },
];

function PaginaAdmin() {
  const [abaAtiva, setAbaAtiva] = useState('candidatos');

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

        {abaAtiva === 'candidatos' && <PainelCandidatos />}
        {abaAtiva === 'dashboard' && <p>Dashboard — em construção.</p>}
      </main>
    </>
  );
}

export default PaginaAdmin;
