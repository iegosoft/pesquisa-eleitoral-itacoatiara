import { corPorRanking, COR_SEM_DADOS } from './coresGraficos.js';
import styles from './MapaCalor.module.css';

// Pra cada bairro, acha o candidato com maior percentual entre as linhas
// já calculadas em calcularMapaCalor (mesmo dado, só reorganizado: em vez
// de candidato -> bairros, vira bairro -> quem lidera ali).
function calcularLiderancaPorBairro({ bairros, linhas }) {
  return bairros.map((bairro) => {
    let liderCandidatoId = null;
    let maiorPercentual = 0;
    linhas.forEach(({ candidato, valoresPorBairro }) => {
      const valor = valoresPorBairro.find((item) => item.bairro === bairro)?.percentual ?? 0;
      if (valor > maiorPercentual) {
        maiorPercentual = valor;
        liderCandidatoId = candidato.id;
      }
    });
    return { bairro, liderCandidatoId, percentual: maiorPercentual };
  });
}

function MapaCalor({ titulo, dados, itensRanking, cargo }) {
  if (dados.bairros.length === 0 || dados.linhas.length === 0) {
    return (
      <div className={styles.cartao}>
        <h3>{titulo}</h3>
        <p className={styles.vazio}>Sem dados suficientes ainda.</p>
      </div>
    );
  }

  const candidatosPorId = new Map(itensRanking.filter((item) => item.tipo === 'candidato').map((item) => [item.chave, item]));
  const lideranca = calcularLiderancaPorBairro(dados);

  return (
    <div className={styles.cartao}>
      <h3>{titulo}</h3>
      <div className={styles.grade}>
        {lideranca.map(({ bairro, liderCandidatoId, percentual }) => {
          const lider = liderCandidatoId ? candidatosPorId.get(liderCandidatoId) : null;
          const cor = lider ? corPorRanking(lider.indiceRanking, cargo) : COR_SEM_DADOS;

          return (
            <div
              key={bairro}
              className={`${styles.bloco} ${lider ? '' : styles.blocoVazio}`}
              style={lider ? { background: cor } : undefined}
            >
              <span className={styles.blocoBairro}>{bairro}</span>
              {lider ? (
                <>
                  <span className={styles.blocoLider}>
                    {lider.isFoco && '★ '}
                    {lider.rotulo}
                  </span>
                  <span className={styles.blocoPercentual}>{percentual.toFixed(0)}%</span>
                </>
              ) : (
                <span className={styles.blocoLider}>Sem dados</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MapaCalor;
