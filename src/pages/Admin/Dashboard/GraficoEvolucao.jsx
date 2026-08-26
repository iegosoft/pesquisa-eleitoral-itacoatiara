import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { corFoco } from './coresGraficos.js';
import { estiloTooltip } from './estiloGraficos.js';
import styles from './Graficos.module.css';

const PERIODOS = [7, 14, 30];

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

function GraficoEvolucao({ dados, periodo, aoAlterarPeriodo }) {
  return (
    <div className={styles.cartao}>
      <div className={styles.cabecalhoComAcoes}>
        <h3>Evolução do candidato foco</h3>
        <div className={styles.seletorPeriodo}>
          {PERIODOS.map((dias) => (
            <button
              key={dias}
              type="button"
              className={`${styles.botaoPeriodo} ${periodo === dias ? styles.botaoPeriodoAtivo : ''}`}
              onClick={() => aoAlterarPeriodo(dias)}
            >
              {dias} dias
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={dados} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--cor-grafico-grid)" />
          <XAxis dataKey="data" tick={{ fontSize: 13, fill: 'var(--cor-texto-suave)' }} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            tick={{ fontSize: 13, fill: 'var(--cor-texto-suave)' }}
          />
          <Tooltip formatter={(valor) => formatarPercentual(valor)} {...estiloTooltip} />
          <Legend
            formatter={(value) => (value === 'percentualFederal' ? 'Federal' : 'Estadual')}
            wrapperStyle={{ fontSize: 13 }}
          />
          <Area
            type="monotone"
            dataKey="percentualFederal"
            stroke={corFoco('federal')}
            fill={corFoco('federal')}
            fillOpacity={0.15}
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7 }}
          />
          <Area
            type="monotone"
            dataKey="percentualEstadual"
            stroke={corFoco('estadual')}
            fill={corFoco('estadual')}
            fillOpacity={0.15}
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoEvolucao;
