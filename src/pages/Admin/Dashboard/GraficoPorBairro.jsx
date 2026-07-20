import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { corFoco } from './coresGraficos.js';
import styles from './Graficos.module.css';

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

function GraficoPorBairro({ dados }) {
  return (
    <div className={styles.cartao}>
      <h3>Intenção do candidato foco por bairro</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={dados} margin={{ left: 8, right: 8, bottom: 40 }}>
          <CartesianGrid vertical={false} stroke="var(--cor-borda)" />
          <XAxis dataKey="bairro" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(valor) => formatarPercentual(valor)} />
          <Legend
            formatter={(value) => (value === 'percentualFederal' ? 'Federal' : 'Estadual')}
            wrapperStyle={{ fontSize: 13 }}
          />
          <Bar dataKey="percentualFederal" fill={corFoco('federal')} radius={[4, 4, 0, 0]} barSize={16} />
          <Bar dataKey="percentualEstadual" fill={corFoco('estadual')} radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoPorBairro;
