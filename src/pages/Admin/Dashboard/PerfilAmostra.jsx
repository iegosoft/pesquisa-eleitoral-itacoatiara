import styles from './PerfilAmostra.module.css';

const RAIO = 46;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;
// Folga entre as fatias, para que fatias vizinhas não se fundam.
const FOLGA = 2;

const CORES_SEXO = {
  feminino: 'var(--cor-perfil-feminino)',
  masculino: 'var(--cor-perfil-masculino)',
};
const CORES_IDADE = ['var(--cor-idade-1)', 'var(--cor-idade-2)', 'var(--cor-idade-3)', 'var(--cor-idade-4)', 'var(--cor-idade-5)'];

function formatarPercentual(valor) {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`;
}

function Rosca({ titulo, fatias, total }) {
  let acumulado = 0;
  const comVotos = fatias.filter((fatia) => fatia.quantidade > 0);

  return (
    <figure className={styles.rosca}>
      <figcaption className={styles.titulo}>{titulo}</figcaption>
      <div className={styles.corpo}>
        <div className={styles.grafico}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className={styles.trilho} cx="60" cy="60" r={RAIO} />
            {comVotos.map((fatia) => {
              const comprimento = (fatia.percentual / 100) * CIRCUNFERENCIA;
              const folga = comVotos.length > 1 ? FOLGA : 0;
              const segmento = (
                <circle
                  key={fatia.chave}
                  className={styles.fatia}
                  cx="60"
                  cy="60"
                  r={RAIO}
                  stroke={fatia.cor}
                  strokeDasharray={`${Math.max(comprimento - folga, 0)} ${CIRCUNFERENCIA}`}
                  strokeDashoffset={-acumulado}
                  transform="rotate(-90 60 60)"
                />
              );
              acumulado += comprimento;
              return segmento;
            })}
          </svg>
          <span className={styles.centro}>
            <strong>{total.toLocaleString('pt-BR')}</strong>
            <span>{total === 1 ? 'pessoa' : 'pessoas'}</span>
          </span>
        </div>

        <ul className={styles.legenda}>
          {fatias.map((fatia) => (
            <li key={fatia.chave}>
              <span className={styles.marcador} style={{ background: fatia.cor }} aria-hidden="true" />
              <span className={styles.rotulo}>{fatia.rotulo}</span>
              <span className={styles.valor}>
                {formatarPercentual(fatia.percentual)}
                <span className={styles.quantidade}> ({fatia.quantidade})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

function PerfilAmostra({ perfil }) {
  if (perfil.total === 0) {
    return (
      <div className={styles.cartao}>
        <p className={styles.vazio}>Sem entrevistas para mostrar o perfil.</p>
      </div>
    );
  }

  return (
    <div className={styles.cartao}>
      <p className={styles.explicacao}>
        Quem foi ouvido. Se um grupo estiver sobrando ou faltando, o resultado pode não representar a cidade.
      </p>
      <div className={styles.grade}>
        <Rosca
          titulo="Sexo"
          total={perfil.total}
          fatias={perfil.sexo.map((fatia) => ({ ...fatia, cor: CORES_SEXO[fatia.chave] }))}
        />
        <Rosca
          titulo="Faixa etária"
          total={perfil.total}
          fatias={perfil.faixaIdade.map((fatia, indice) => ({ ...fatia, cor: CORES_IDADE[indice] }))}
        />
      </div>
    </div>
  );
}

export default PerfilAmostra;
