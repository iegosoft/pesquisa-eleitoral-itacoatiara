import { corStatusMapa, statusFocoPorBairro } from './coresGraficos.js';
import styles from './MapaCalor.module.css';

const LEGENDA = [
  { status: 'lidera', rotulo: 'Lidera' },
  { status: 'empate', rotulo: 'Empate' },
  { status: 'perde', rotulo: 'Perde' },
  { status: 'sem_dados', rotulo: 'Sem dados' },
];

// Por bairro, compara o percentual do candidato foco com o maior percentual
// entre todos os candidatos daquele cargo ali — não é "quem lidera o
// bairro" (identidade), é "como o nosso candidato está indo" (status).
function calcularStatusPorBairro({ bairros, linhas }) {
  const linhaFoco = linhas.find(({ candidato }) => candidato.isFoco);
  if (!linhaFoco) return null;

  return bairros.map((bairro) => {
    const percentualFoco = linhaFoco.valoresPorBairro.find((item) => item.bairro === bairro)?.percentual ?? 0;
    const maiorPercentual = Math.max(
      0,
      ...linhas.map((linha) => linha.valoresPorBairro.find((item) => item.bairro === bairro)?.percentual ?? 0),
    );
    return { bairro, percentualFoco, status: statusFocoPorBairro(percentualFoco, maiorPercentual) };
  });
}

function MapaCalor({ titulo, dados }) {
  if (dados.bairros.length === 0 || dados.linhas.length === 0) {
    return (
      <div className={styles.cartao}>
        <h3>{titulo}</h3>
        <p className={styles.vazio}>Sem dados suficientes ainda.</p>
      </div>
    );
  }

  const status = calcularStatusPorBairro(dados);

  if (!status) {
    return (
      <div className={styles.cartao}>
        <h3>{titulo}</h3>
        <p className={styles.vazio}>Nenhum candidato marcado como foco pra esse cargo ainda.</p>
      </div>
    );
  }

  return (
    <div className={styles.cartao}>
      <h3>{titulo}</h3>

      <div className={styles.legenda}>
        {LEGENDA.map((item) => (
          <span key={item.status} className={styles.legendaItem}>
            <span className={styles.legendaCor} style={{ background: corStatusMapa(item.status) }} />
            {item.rotulo}
          </span>
        ))}
      </div>

      <div className={styles.grade}>
        {status.map(({ bairro, percentualFoco, status: statusBairro }) => (
          <div key={bairro} className={styles.bloco} style={{ background: corStatusMapa(statusBairro) }}>
            <span className={styles.blocoBairro}>{bairro}</span>
            <span className={styles.blocoPercentual}>
              {statusBairro === 'sem_dados' ? '—' : `${percentualFoco.toFixed(0)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapaCalor;
