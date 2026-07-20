import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { corItemIntencaoVoto } from './coresGraficos.js';
import styles from './Graficos.module.css';

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

function GraficoIntencaoVoto({ titulo, itens, cargo }) {
  return (
    <div className={styles.cartao}>
      <h3>{titulo}</h3>

      <div className={styles.legenda}>
        {itens.map((item) => (
          <span key={item.chave} className={styles.legendaItem}>
            <span
              className={styles.legendaCor}
              style={{ background: corItemIntencaoVoto(item, cargo) }}
            />
            {item.rotulo} {formatarPercentual(item.percentual)}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={Math.max(itens.length * 44, 140)}>
        <BarChart data={itens} layout="vertical" margin={{ left: 8, right: 24 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="rotulo" width={110} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(valor) => formatarPercentual(valor)} />
          <Bar dataKey="percentual" radius={[0, 4, 4, 0]} barSize={22}>
            {itens.map((item) => (
              <Cell key={item.chave} fill={corItemIntencaoVoto(item, cargo)} />
            ))}
            <LabelList dataKey="percentual" position="right" formatter={formatarPercentual} style={{ fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoIntencaoVoto;
