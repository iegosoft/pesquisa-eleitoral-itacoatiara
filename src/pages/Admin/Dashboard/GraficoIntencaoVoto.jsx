import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { corItemIntencaoVoto } from './coresGraficos.js';
import styles from './Graficos.module.css';

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

// Rótulo do eixo colorido igual à cor da própria barra (como em institutos
// de pesquisa reais) — dispensa uma legenda separada, já que a cor e o
// nome do candidato aparecem juntos na mesma linha.
function RotuloCandidato({ x, y, payload, itensPorRotulo }) {
  const item = itensPorRotulo.get(payload.value);
  const cor = item ? corItemIntencaoVoto(item) : 'var(--cor-texto-suave)';

  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={13} fontWeight={item?.isFoco ? 700 : 500} fill={cor}>
      {item?.isFoco ? '★ ' : ''}
      {payload.value}
    </text>
  );
}

function GraficoIntencaoVoto({ titulo, itens }) {
  const itensPorRotulo = new Map(itens.map((item) => [item.rotulo, item]));

  return (
    <div className={styles.cartao}>
      <h3>{titulo}</h3>

      <ResponsiveContainer width="100%" height={Math.max(itens.length * 44, 140)}>
        <BarChart data={itens} layout="vertical" margin={{ left: 8, right: 24 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="rotulo"
            width={120}
            tickLine={false}
            axisLine={false}
            tick={<RotuloCandidato itensPorRotulo={itensPorRotulo} />}
          />
          <Tooltip formatter={(valor) => formatarPercentual(valor)} />
          <Bar dataKey="percentual" radius={[0, 6, 6, 0]} barSize={26}>
            {itens.map((item) => (
              <Cell
                key={item.chave}
                fill={corItemIntencaoVoto(item)}
                stroke={item.isFoco ? 'var(--cor-texto)' : 'none'}
                strokeWidth={item.isFoco ? 2 : 0}
              />
            ))}
            <LabelList
              dataKey="percentual"
              position="right"
              formatter={formatarPercentual}
              style={{ fontSize: 13, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoIntencaoVoto;
