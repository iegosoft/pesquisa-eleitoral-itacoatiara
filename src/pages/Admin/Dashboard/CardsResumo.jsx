import styles from './CardsResumo.module.css';

const ICONES = {
  pessoas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c0-3.3 2.5-5.8 5.5-5.8s5.5 2.5 5.5 5.8" />
      <path d="M16 8.5a3 3 0 1 1 0-6" />
      <path d="M14.5 13.5c2.6.4 4.5 2.6 4.5 5.5" />
    </svg>
  ),
  casa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6 10v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8" />
    </svg>
  ),
  mapa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  calendario: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M8 3.5v3.5M16 3.5v3.5" />
    </svg>
  ),
};

function CardsResumo({ resumo }) {
  const cards = [
    {
      rotulo: 'Entrevistados',
      valor: resumo.totalEntrevistados.toLocaleString('pt-BR'),
      icone: 'pessoas',
      cor: 'Azul',
    },
    {
      rotulo: 'Casas visitadas',
      valor: resumo.casasVisitadas.toLocaleString('pt-BR'),
      icone: 'casa',
      cor: 'Petroleo',
    },
    {
      rotulo: 'Bairros cobertos',
      valor: resumo.bairrosCobertos.toLocaleString('pt-BR'),
      icone: 'mapa',
      cor: 'Petroleo',
    },
    {
      rotulo: 'Última coleta',
      valor: resumo.ultimaColeta,
      icone: 'calendario',
      cor: 'Cinza',
    },
  ];

  return (
    <div className={styles.cards}>
      {cards.map((card) => (
        <div key={card.rotulo} className={styles.card}>
          <span className={`${styles.icone} ${styles[`icone${card.cor}`]}`}>{ICONES[card.icone]}</span>
          <span className={styles.textos}>
            <span className={styles.rotulo}>{card.rotulo}</span>
            <span className={styles.valor}>{card.valor}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default CardsResumo;
