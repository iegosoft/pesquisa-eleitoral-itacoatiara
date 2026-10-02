import AvatarCandidato from '../../../components/AvatarCandidato.jsx';
import SeloStatus from './SeloStatus.jsx';
import styles from './ResultadoFoco.module.css';

const RAIO_ANEL = 54;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO_ANEL;

function formatarPontos(valor) {
  const pontos = Math.abs(valor).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  return `${pontos} ${Math.abs(valor) === 1 ? 'ponto' : 'pontos'}`;
}

function manchete({ nome, status, posicao }, rotuloCargo) {
  const cargo = rotuloCargo.toLowerCase();
  if (status === 'lidera') return `${nome} lidera para ${cargo}`;
  if (status === 'empate') return `${nome} está empatado na disputa para ${cargo}`;
  if (status === 'perde') return `${nome} está em ${posicao}º lugar para ${cargo}`;
  return `${nome} ainda não tem votos registrados para ${cargo}`;
}

function frase({ status, adversario, diferenca }) {
  if (status === 'sem_dados') return 'Ainda não há votos registrados para este cargo.';
  if (!adversario) return 'É o único candidato cadastrado neste cargo.';
  if (status === 'lidera') return `${formatarPontos(diferenca)} à frente de ${adversario}.`;
  if (diferenca === 0) return `Empatado na liderança com ${adversario}.`;
  return `${formatarPontos(diferenca)} atrás de ${adversario}, que lidera.`;
}

// Anel em volta da foto: o arco preenchido é o percentual do candidato, na
// cor do resultado dele. O número também aparece em texto, ao lado.
function AnelFoto({ resultado }) {
  const preenchido = (resultado.percentual / 100) * CIRCUNFERENCIA;
  return (
    <div className={styles.anel}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle className={styles.anelTrilho} cx="64" cy="64" r={RAIO_ANEL} />
        <circle
          className={styles.anelValor}
          cx="64"
          cy="64"
          r={RAIO_ANEL}
          strokeDasharray={`${preenchido} ${CIRCUNFERENCIA}`}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <AvatarCandidato
        candidato={{ nome: resultado.nome, cargo: resultado.cargo, fotoUrl: resultado.fotoUrl }}
        className={styles.fotoAnel}
        decorativo
      />
    </div>
  );
}

function CartaoResultado({ rotuloCargo, resultado }) {
  if (!resultado) {
    return (
      <div className={`${styles.cartao} ${styles.sem_dados}`}>
        <span className={styles.cargo}>{rotuloCargo}</span>
        <p className={styles.frase}>Nenhum candidato foco marcado para este cargo.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.cartao} ${styles[resultado.status]}`}>
      <div className={styles.topo}>
        <span className={styles.cargo}>{rotuloCargo}</span>
        <SeloStatus status={resultado.status} grande />
      </div>
      <div className={styles.corpo}>
        <AnelFoto resultado={resultado} />
        <div className={styles.textos}>
          <p className={styles.manchete}>{manchete(resultado, rotuloCargo)}</p>
          <div className={styles.linhaNumero}>
            <span className={styles.percentual}>
              {resultado.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
            </span>
            <span className={styles.posicao}>
              {resultado.posicao}º de {resultado.totalCandidatos}
              {resultado.partido && ` · ${resultado.partido}`}
            </span>
          </div>
          <p className={styles.frase}>{frase(resultado)}</p>
        </div>
      </div>
    </div>
  );
}

function ResultadoFoco({ federal, estadual, base }) {
  return (
    <section id="resultado" className={styles.secao} aria-labelledby="titulo-resultado-foco">
      <div className={styles.cabecalho}>
        <h2 id="titulo-resultado-foco">Resultado do candidato foco</h2>
        <span className={styles.base}>
          Base: {base.toLocaleString('pt-BR')} {base === 1 ? 'entrevistado' : 'entrevistados'}
        </span>
      </div>
      <div className={styles.grade}>
        <CartaoResultado rotuloCargo="Deputado federal" resultado={federal} />
        <CartaoResultado rotuloCargo="Deputado estadual" resultado={estadual} />
      </div>
    </section>
  );
}

export default ResultadoFoco;
