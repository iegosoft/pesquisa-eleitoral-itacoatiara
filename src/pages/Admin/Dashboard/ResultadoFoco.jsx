import SeloStatus from './SeloStatus.jsx';
import styles from './ResultadoFoco.module.css';

function formatarPontos(valor) {
  const pontos = Math.abs(valor).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  return `${pontos} ${Math.abs(valor) === 1 ? 'ponto' : 'pontos'}`;
}

function frase(resultado) {
  const { status, adversario, diferenca } = resultado;
  if (status === 'sem_dados') return 'Ainda não há votos registrados para este cargo.';
  if (!adversario) return 'É o único candidato cadastrado neste cargo.';
  if (status === 'lidera') return `${formatarPontos(diferenca)} à frente de ${adversario}.`;
  if (diferenca === 0) return `Empatado na liderança com ${adversario}.`;
  return `${formatarPontos(diferenca)} atrás de ${adversario}, que lidera.`;
}

function CartaoResultado({ cargo, rotuloCargo, resultado }) {
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
        <span className={styles.cargo}>
          <span className={`${styles.marcador} ${styles[`marcador_${cargo}`]}`} aria-hidden="true" />
          {rotuloCargo}
        </span>
        <SeloStatus status={resultado.status} grande />
      </div>
      <div className={styles.linhaNumero}>
        <span className={styles.percentual}>
          {resultado.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
        </span>
        <span className={styles.nome}>{resultado.nome}</span>
      </div>
      <p className={styles.frase}>{frase(resultado)}</p>
      <p className={styles.detalhe}>
        {resultado.posicao}º de {resultado.totalCandidatos} candidatos
      </p>
    </div>
  );
}

function ResultadoFoco({ federal, estadual, base }) {
  return (
    <section className={styles.secao} aria-labelledby="titulo-resultado-foco">
      <div className={styles.cabecalho}>
        <h2 id="titulo-resultado-foco">Resultado do candidato foco</h2>
        <span className={styles.base}>
          Base: {base.toLocaleString('pt-BR')} {base === 1 ? 'entrevistado' : 'entrevistados'}
        </span>
      </div>
      <div className={styles.grade}>
        <CartaoResultado cargo="federal" rotuloCargo="Deputado federal" resultado={federal} />
        <CartaoResultado cargo="estadual" rotuloCargo="Deputado estadual" resultado={estadual} />
      </div>
    </section>
  );
}

export default ResultadoFoco;
