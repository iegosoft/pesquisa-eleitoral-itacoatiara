import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { corFoco } from './coresGraficos.js';
import { estiloTooltip } from './estiloGraficos.js';
import styles from './Graficos.module.css';

const PERIODOS = [7, 14, 30];

const SERIES = [
  { chave: 'percentualFederal', nome: 'Federal', cargo: 'federal' },
  { chave: 'percentualEstadual', nome: 'Estadual', cargo: 'estadual' },
];

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

function rotuloDoDia(data, payload) {
  const entrevistas = payload?.[0]?.payload.entrevistas ?? 0;
  return `${data} · ${entrevistas} ${entrevistas === 1 ? 'entrevista' : 'entrevistas'}`;
}

function GraficoEvolucao({ dados, periodo, aoAlterarPeriodo, ultimaColeta }) {
  const temColetaNoPeriodo = dados.some((ponto) => ponto.entrevistas > 0);

  return (
    <div className={`${styles.cartao} ${styles.graficoEvolucao}`}>
      <div className={`${styles.cabecalhoComAcoes} ${styles.cabecalhoPeriodo}`}>
        <span className={styles.rotuloPeriodo}>Período:</span>
        <div className={styles.seletorPeriodo} role="group" aria-label="Período">
          {PERIODOS.map((dias) => (
            <button
              key={dias}
              type="button"
              aria-pressed={periodo === dias}
              className={`${styles.botaoPeriodo} ${periodo === dias ? styles.botaoPeriodoAtivo : ''}`}
              onClick={() => aoAlterarPeriodo(dias)}
            >
              {dias} dias
            </button>
          ))}
        </div>
      </div>

      {temColetaNoPeriodo ? (
        <>
          <p className={styles.subtitulo}>
            Cada ponto é um dia com coleta. Linha contínua liga dias seguidos; a linha tracejada atravessa
            dias sem coleta, em que não houve medição.
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dados} margin={{ left: 8, right: 8, top: 8 }}>
              <defs>
                {SERIES.map(({ cargo }) => (
                  <linearGradient key={cargo} id={`degrade-evolucao-${cargo}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={corFoco(cargo)} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={corFoco(cargo)} stopOpacity={0} />
                  </linearGradient>
                ))}
                <filter id="brilho-evolucao" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="desfoque" />
                  <feMerge>
                    <feMergeNode in="desfoque" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--cor-grafico-grid)" />
              <XAxis dataKey="data" tick={{ fontSize: 13, fill: 'var(--cor-texto-suave)' }} stroke="var(--cor-grafico-grid)" />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
                tick={{ fontSize: 13, fill: 'var(--cor-texto-suave)' }}
                stroke="var(--cor-grafico-grid)"
              />
              <Tooltip
                formatter={(valor) => formatarPercentual(valor)}
                labelFormatter={rotuloDoDia}
                cursor={{ stroke: 'var(--cor-texto-suave)', strokeDasharray: '4 4' }}
                {...estiloTooltip}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: 'var(--cor-texto-suave)' }} />
              {/* Por baixo: tracejado fraco ligando todos os dias com coleta, para
                  a tendência aparecer de ponta a ponta. Fica fora da legenda e do
                  tooltip; o trecho sólido por cima é o que foi medido em dias seguidos. */}
              {SERIES.map(({ chave, cargo }) => (
                <Area
                  key={`${chave}-tracejado`}
                  type="linear"
                  dataKey={chave}
                  connectNulls
                  stroke={corFoco(cargo)}
                  strokeOpacity={0.55}
                  strokeDasharray="6 6"
                  strokeWidth={2}
                  fill="none"
                  dot={false}
                  activeDot={false}
                  legendType="none"
                  tooltipType="none"
                  isAnimationActive={false}
                />
              ))}
              {SERIES.map(({ chave, nome, cargo }) => (
                <Area
                  key={chave}
                  type="monotone"
                  dataKey={chave}
                  name={nome}
                  connectNulls={false}
                  stroke={corFoco(cargo)}
                  fill={`url(#degrade-evolucao-${cargo})`}
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, stroke: 'var(--cor-superficie-solida)', fill: corFoco(cargo) }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--cor-superficie-solida)' }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p className={styles.semDados} role="status">
          Nenhuma coleta nos últimos {periodo} dias. Última coleta: {ultimaColeta}. Escolha um período maior
          para ver a evolução.
        </p>
      )}
    </div>
  );
}

export default GraficoEvolucao;
