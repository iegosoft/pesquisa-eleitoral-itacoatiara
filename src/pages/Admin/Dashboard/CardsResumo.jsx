import styles from './CardsResumo.module.css';

function CardsResumo({ resumo }) {
  const cards = [
    { rotulo: 'Entrevistados', valor: resumo.totalEntrevistados.toLocaleString('pt-BR') },
    { rotulo: 'Casas visitadas', valor: resumo.casasVisitadas.toLocaleString('pt-BR') },
    { rotulo: 'Bairros cobertos', valor: resumo.bairrosCobertos.toLocaleString('pt-BR') },
    { rotulo: 'Última coleta', valor: resumo.ultimaColeta },
  ];

  return (
    <div className={styles.cards}>
      {cards.map((card) => (
        <div key={card.rotulo} className={styles.card}>
          <span className={styles.rotulo}>{card.rotulo}</span>
          <span className={styles.valor}>{card.valor}</span>
        </div>
      ))}
    </div>
  );
}

export default CardsResumo;
