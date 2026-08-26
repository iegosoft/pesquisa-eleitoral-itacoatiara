// Estilo compartilhado do tooltip do Recharts em todos os gráficos do
// dashboard — sem isso, o tooltip usa o visual padrão da lib (caixa branca
// crua, borda fina, sem sombra), que destoa do resto do design system.
const estiloTooltip = {
  contentStyle: {
    background: 'var(--cor-superficie)',
    border: '1px solid var(--cor-borda)',
    borderRadius: 'var(--raio-borda-lg)',
    boxShadow: 'var(--sombra-elevada)',
    padding: '10px 14px',
  },
  labelStyle: {
    color: 'var(--cor-texto-suave)',
    fontFamily: 'var(--fonte-base)',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
  },
  itemStyle: {
    color: 'var(--cor-texto)',
    fontFamily: 'var(--fonte-base)',
    fontSize: 13,
    fontWeight: 600,
    padding: 0,
  },
};

export { estiloTooltip };
