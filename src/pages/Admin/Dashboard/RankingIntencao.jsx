import AvatarCandidato from '../../../components/AvatarCandidato.jsx';
import styles from './RankingIntencao.module.css';

function formatarPercentual(valor) {
  return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

// O candidato foco leva a cor do próprio resultado (lidera/empata/perde);
// concorrentes ficam em cinza sólido e indeciso/branco num cinza apagado.
function classeDaBarra(item, statusFoco) {
  if (item.tipo !== 'candidato') return styles.barraNeutra;
  if (item.isFoco) return styles[`barra_${statusFoco}`] ?? styles.barraConcorrente;
  return styles.barraConcorrente;
}

function FotoItem({ item }) {
  if (item.tipo === 'candidato') {
    return (
      <AvatarCandidato
        candidato={{ nome: item.rotulo, cargo: item.cargo, fotoUrl: item.fotoUrl }}
        className={styles.foto}
        decorativo
      />
    );
  }
  return (
    <span className={`${styles.foto} ${styles.fotoNeutra}`} aria-hidden="true">
      {item.tipo === 'indeciso' ? '?' : '–'}
    </span>
  );
}

function RankingIntencao({ titulo, itens, statusFoco, base }) {
  const maior = Math.max(...itens.map((item) => item.percentual), 1);

  return (
    <div className={styles.cartao}>
      <div className={styles.cabecalho}>
        <h3>{titulo}</h3>
        <span className={styles.base}>
          Base: {base.toLocaleString('pt-BR')} {base === 1 ? 'entrevistado' : 'entrevistados'}
        </span>
      </div>

      <ol className={styles.lista}>
        {itens.map((item, indice) => (
          <li key={item.chave} className={`${styles.item} ${item.isFoco ? styles.itemFoco : ''}`}>
            <FotoItem item={item} />
            <div className={styles.identificacao}>
              <span className={styles.nome}>
                {item.rotulo}
                {item.isFoco && <span className={styles.seloFoco}>Foco</span>}
              </span>
              {item.partido && <span className={styles.partido}>{item.partido}</span>}
            </div>
            <div className={styles.trilho} aria-hidden="true">
              <span
                className={`${styles.barra} ${classeDaBarra(item, statusFoco)}`}
                style={{ width: `${(item.percentual / maior) * 100}%`, animationDelay: `${indice * 70}ms` }}
              />
            </div>
            <span className={styles.percentual}>{formatarPercentual(item.percentual)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RankingIntencao;
