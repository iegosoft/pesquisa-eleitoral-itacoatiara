import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { corFoco, corItemIntencaoVoto } from './coresGraficos.js';
import { estiloTooltip } from './estiloGraficos.js';
import { truncarRotulo } from './truncarRotulo.js';
import styles from './Graficos.module.css';

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

// Barra de candidato com voto ganha o degradê da série; neutros e zerados
// ficam com a cor chapada.
function corDaBarra(item, cargo) {
  const cor = corItemIntencaoVoto(item, cargo);
  return cor === corFoco(cargo) ? `url(#degrade-barra-${cargo})` : cor;
}

// O nome usa a cor de texto (a cor da série fica só na barra): o violeta
// estadual como texto teria 4,3:1 no fundo escuro, abaixo do WCAG AA.
// Candidato sem voto e neutros ficam com o texto suave. O candidato foco
// ganha um selo "FOCO" empilhado acima do nome, ambos alinhados pela borda
// direita — assim não depende de medir a largura do texto.
function RotuloCandidato({ x, y, payload, itensPorRotulo }) {
  const item = itensPorRotulo.get(payload.value);
  const destacado = item?.tipo === 'candidato' && item.percentual > 0;
  const cor = destacado ? 'var(--cor-texto)' : 'var(--cor-texto-suave)';

  return (
    <g>
      {item?.isFoco && (
        <g transform={`translate(${x - 40}, ${y - 21})`}>
          <rect width={40} height={15} rx={7.5} fill="var(--cor-texto)" />
          <text x={20} y={11} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--cor-texto-inverso)">
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

function GraficoIntencaoVoto({ titulo, itens, cargo, base }) {
  const itensPorRotulo = new Map(itens.map((item) => [item.rotulo, item]));

  return (
    <div className={styles.cartao}>
      <h3>{titulo}</h3>
      <p className={styles.subtitulo}>
        Base: {base.toLocaleString('pt-BR')} {base === 1 ? 'entrevistado' : 'entrevistados'}
      </p>

      <ResponsiveContainer width="100%" height={Math.max(itens.length * 44, 140)}>
        <BarChart data={itens} layout="vertical" margin={{ top: 10, left: 8, right: 48 }}>
          <defs>
            <linearGradient id={`degrade-barra-${cargo}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={corFoco(cargo)} stopOpacity={0.55} />
              <stop offset="100%" stopColor={corFoco(cargo)} stopOpacity={1} />
            </linearGradient>
          </defs>
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 13, fill: 'var(--cor-texto-suave)' }}
            stroke="var(--cor-grafico-grid)"
          />
          <YAxis
            type="category"
            dataKey="rotulo"
            width={120}
            tickLine={false}
            axisLine={false}
            tick={<RotuloCandidato itensPorRotulo={itensPorRotulo} />}
          />
          <Tooltip
            formatter={(valor) => [formatarPercentual(valor), 'Intenção de voto']}
            cursor={{ fill: 'var(--cor-superficie-baixa)' }}
            {...estiloTooltip}
          />
          <Bar dataKey="percentual" radius={[0, 6, 6, 0]} barSize={28}>
            {itens.map((item) => (
              <Cell key={item.chave} fill={corDaBarra(item, cargo)} />
            ))}
            <LabelList
              dataKey="percentual"
              position="right"
              formatter={formatarPercentual}
              style={{ fontSize: 14, fontWeight: 700, fill: 'var(--cor-texto)' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoIntencaoVoto;
