import { useEffect, useState } from 'react';
import styles from './CardsResumo.module.css';

const DURACAO_ANIMACAO_MS = 700;

function prefereMenosMovimento() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

// Conta de 0 até o valor na entrada do painel (e ao trocar de filtro), sem
// animar para quem pediu menos movimento no sistema.
function useNumeroAnimado(valor) {
  const [exibido, setExibido] = useState(valor);

  useEffect(() => {
    if (prefereMenosMovimento()) {
      setExibido(valor);
      return undefined;
    }
    let quadro;
    const inicio = performance.now();
    function passo(agora) {
      const progresso = Math.min((agora - inicio) / DURACAO_ANIMACAO_MS, 1);
      const suavizado = 1 - (1 - progresso) ** 3;
      setExibido(Math.round(valor * suavizado));
      if (progresso < 1) quadro = requestAnimationFrame(passo);
    }
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [valor]);

  return exibido;
}

function ValorNumerico({ valor }) {
  return useNumeroAnimado(valor).toLocaleString('pt-BR');
}

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
      valor: <ValorNumerico valor={resumo.totalEntrevistados} />,
      icone: 'pessoas',
      cor: 'Azul',
    },
    {
      rotulo: 'Casas visitadas',
      valor: <ValorNumerico valor={resumo.casasVisitadas} />,
      icone: 'casa',
      cor: 'Petroleo',
    },
    {
      rotulo: 'Bairros cobertos',
      valor: <ValorNumerico valor={resumo.bairrosCobertos} />,
      icone: 'mapa',
      cor: 'Petroleo',
    },
    {
      rotulo: 'Última coleta',
      valor: resumo.ultimaColeta,
      icone: 'calendario',
      cor: 'Cinza',
      texto: true,
    },
  ];

  return (
    <div className={styles.cards}>
      {cards.map((card) => (
        <div key={card.rotulo} className={styles.card}>
          <span className={`${styles.icone} ${styles[`icone${card.cor}`]}`}>{ICONES[card.icone]}</span>
          <span className={styles.textos}>
            <span className={styles.rotulo}>{card.rotulo}</span>
            <span className={card.texto ? styles.valorTexto : styles.valor}>{card.valor}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default CardsResumo;
