import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { corItemIntencaoVoto } from './coresGraficos.js';
import { estiloTooltip } from './estiloGraficos.js';
import { truncarRotulo } from './truncarRotulo.js';
import styles from './Graficos.module.css';

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

// Rótulo do eixo colorido igual à cor da própria barra — dispensa uma
// legenda separada. O candidato foco ganha um selo "FOCO" empilhado acima
// do nome (não só uma estrela), ambos alinhados pela borda direita — assim
// não depende de medir a largura do texto pra não sobrepor o nome.
function RotuloCandidato({ x, y, payload, itensPorRotulo, cargo }) {
  const item = itensPorRotulo.get(payload.value);
  const cor = item ? corItemIntencaoVoto(item, cargo) : 'var(--cor-texto-suave)';

  return (
    <g>
      {item?.isFoco && (
        <g transform={`translate(${x - 40}, ${y - 21})`}>
          <rect width={40} height={15} rx={7.5} fill="var(--cor-texto)" />
          <text x={20} y={11} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">
            FOCO
          </text>
        </g>
      )}
      <text x={x} y={y} dy={4} textAnchor="end" fontSize={14} fontWeight={item?.isFoco ? 700 : 500} fill={cor}>
        {truncarRotulo(payload.value)}
        <title>{payload.value}</title>
      </text>
    </g>
  );
}

function GraficoIntencaoVoto({ titulo, itens, cargo }) {
  const itensPorRotulo = new Map(itens.map((item) => [item.rotulo, item]));

  return (
    <div className={styles.cartao}>
      <h3>{titulo}</h3>

      <ResponsiveContainer width="100%" height={Math.max(itens.length * 44, 140)}>
        <BarChart data={itens} layout="vertical" margin={{ top: 10, left: 8, right: 48 }}>
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 13, fill: 'var(--cor-texto-suave)' }}
          />
          <YAxis
            type="category"
            dataKey="rotulo"
            width={120}
            tickLine={false}
            axisLine={false}
            tick={<RotuloCandidato itensPorRotulo={itensPorRotulo} cargo={cargo} />}
          />
          <Tooltip formatter={(valor) => formatarPercentual(valor)} {...estiloTooltip} />
          <Bar dataKey="percentual" radius={[0, 6, 6, 0]} barSize={28}>
            {itens.map((item) => (
              <Cell key={item.chave} fill={corItemIntencaoVoto(item, cargo)} />
            ))}
            <LabelList
              dataKey="percentual"
              position="right"
              formatter={formatarPercentual}
              style={{ fontSize: 14, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoIntencaoVoto;
