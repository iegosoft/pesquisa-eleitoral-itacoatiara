import { corMapaCalor } from './coresGraficos.js';
import styles from './MapaCalor.module.css';

function MapaCalor({ titulo, dados, cargo }) {
  const { bairros, linhas } = dados;

  if (bairros.length === 0 || linhas.length === 0) {
    return (
      <div className={styles.cartao}>
        <h3>{titulo}</h3>
        <p className={styles.vazio}>Sem dados suficientes ainda.</p>
      </div>
    );
  }

  return (
    <div className={styles.cartao}>
      <h3>{titulo}</h3>
      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Candidato</th>
              {bairros.map((bairro) => (
                <th key={bairro}>{bairro}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ candidato, valoresPorBairro }) => (
              <tr key={candidato.id}>
                <th scope="row">{candidato.nome}</th>
                {valoresPorBairro.map(({ bairro, percentual }) => (
                  <td
                    key={bairro}
                    style={{ background: corMapaCalor(percentual, candidato.isFoco, cargo) }}
                  >
                    {percentual > 0 ? `${percentual.toFixed(0)}%` : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MapaCalor;
