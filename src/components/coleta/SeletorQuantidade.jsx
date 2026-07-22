import { useState } from 'react';
import styles from '../SeletorPills.module.css';
import proprio from './SeletorQuantidade.module.css';

const OPCOES_RAPIDAS = [1, 2, 3, 4];

function SeletorQuantidade({ valor, aoSelecionar }) {
  const [modoOutro, setModoOutro] = useState(valor != null && !OPCOES_RAPIDAS.includes(valor));

  function selecionarRapido(numero) {
    setModoOutro(false);
    aoSelecionar(numero);
  }

  function ativarOutro() {
    setModoOutro(true);
    aoSelecionar(null);
  }

  function aoDigitarOutro(evento) {
    aoSelecionar(evento.target.value === '' ? null : Number(evento.target.value));
  }

  return (
    <div className={styles.linha}>
      {OPCOES_RAPIDAS.map((numero) => (
        <button
          key={numero}
          type="button"
          className={`${styles.pill} ${!modoOutro && valor === numero ? styles.selecionada : ''}`}
          onClick={() => selecionarRapido(numero)}
        >
          {numero}
        </button>
      ))}
      <button
        type="button"
        className={`${styles.pill} ${modoOutro ? styles.selecionada : ''}`}
        onClick={ativarOutro}
      >
        Outro
      </button>
      {modoOutro && (
        <input
          className={proprio.campoOutro}
          type="number"
          min="1"
          inputMode="numeric"
          placeholder="Quantos?"
          value={valor ?? ''}
          onChange={aoDigitarOutro}
        />
      )}
    </div>
  );
}

export default SeletorQuantidade;
