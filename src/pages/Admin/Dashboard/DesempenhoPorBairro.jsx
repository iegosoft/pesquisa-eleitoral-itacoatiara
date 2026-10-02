import { AMOSTRA_MINIMA_BAIRRO } from './agregacoes.js';
import { MARGEM_EMPATE } from './coresGraficos.js';
import SeloStatus from './SeloStatus.jsx';
import styles from './DesempenhoPorBairro.module.css';

const ORDEM_STATUS = ['lidera', 'empate', 'perde'];

function contarStatus(dados, cargo) {
  const contagem = { lidera: 0, empate: 0, perde: 0 };
  dados.forEach((linha) => {
    const status = linha[cargo]?.status;
    if (status in contagem) contagem[status] += 1;
  });
  return contagem;
}

function ResumoCargo({ rotulo, cargo, dados }) {
  if (!dados.some((linha) => linha[cargo])) return null;
  const contagem = contarStatus(dados, cargo);

  return (
    <div className={styles.resumoCargo}>
      <span className={styles.resumoRotulo}>
        <span className={`${styles.marcador} ${styles[`marcador_${cargo}`]}`} aria-hidden="true" />
        {rotulo}
      </span>
      {ORDEM_STATUS.map((status) => (
        <SeloStatus key={status} status={status}>
          {status === 'lidera' && `Lidera em ${contagem.lidera}`}
          {status === 'empate' && `Empata em ${contagem.empate}`}
          {status === 'perde' && `Perde em ${contagem.perde}`}
        </SeloStatus>
      ))}
    </div>
  );
}

function LinhaCargo({ rotulo, cargo, desempenho }) {
  return (
    <div className={styles.linhaCargo}>
      <dt>
        <span className={`${styles.marcador} ${styles[`marcador_${cargo}`]}`} aria-hidden="true" />
        {rotulo}
      </dt>
      <dd>
        {desempenho ? (
          <>
            <span className={styles.percentual}>{desempenho.percentual.toFixed(0)}%</span>
            <SeloStatus status={desempenho.status} />
          </>
        ) : (
          <span className={styles.semFoco}>sem candidato foco</span>
        )}
      </dd>
    </div>
  );
}

function DesempenhoPorBairro({ dados }) {
  return (
    <section className={styles.cartao} aria-labelledby="titulo-desempenho-bairro">
      <h3 id="titulo-desempenho-bairro">Desempenho do candidato foco por bairro</h3>
      <div className={styles.topo}>
        <p className={styles.explicacao}>
          <strong>Lidera</strong>: o foco tem o maior percentual do bairro. <strong>Empate</strong>: está a
          até {MARGEM_EMPATE} pontos do primeiro. <strong>Perde</strong>: está mais de {MARGEM_EMPATE} pontos
          atrás. Bairros com menos de {AMOSTRA_MINIMA_BAIRRO} entrevistas têm resultado pouco confiável e
          aparecem com borda tracejada.
        </p>
        {dados.length > 0 && (
          <div className={styles.resumo}>
            <ResumoCargo rotulo="Federal" cargo="federal" dados={dados} />
            <ResumoCargo rotulo="Estadual" cargo="estadual" dados={dados} />
          </div>
        )}
      </div>

      {dados.length === 0 ? (
        <p className={styles.vazio}>Sem dados suficientes ainda.</p>
      ) : (
        <ul className={styles.grade}>
          {dados.map((linha) => (
            <li
              key={linha.bairro}
              className={`${styles.bloco} ${linha.amostraPequena ? styles.blocoAmostraPequena : ''}`}
            >
              <div className={styles.blocoTopo}>
                <span className={styles.bairro}>{linha.bairro}</span>
                <span className={styles.entrevistas}>
                  {linha.entrevistas} {linha.entrevistas === 1 ? 'entrevista' : 'entrevistas'}
                </span>
              </div>
              {linha.amostraPequena && <span className={styles.avisoAmostra}>Amostra pequena</span>}
              <dl className={styles.cargos}>
                <LinhaCargo rotulo="Federal" cargo="federal" desempenho={linha.federal} />
                <LinhaCargo rotulo="Estadual" cargo="estadual" desempenho={linha.estadual} />
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default DesempenhoPorBairro;
