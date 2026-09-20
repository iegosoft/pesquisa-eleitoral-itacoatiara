import { describe, expect, it } from 'vitest';
import { corTextoMapa } from './coresGraficos.js';

// Regressao da correcao de acessibilidade (TP3): as cores de fundo "empate"
// (#f59e0b) e "sem_dados" (#cbd5e1) nao tem contraste suficiente (WCAG AA,
// minimo 4.5:1) com texto branco — medido em 2.15:1 e 1.48:1. Esses dois
// status precisam de texto escuro; os demais (fundo mais escuro) continuam
// com texto branco.
describe('corTextoMapa', () => {
  it('usa texto escuro em fundos claros que falhariam o contraste com branco', () => {
    expect(corTextoMapa('empate')).toBe('#0f172a');
    expect(corTextoMapa('sem_dados')).toBe('#0f172a');
  });

  it('mantem texto branco em fundos escuros o suficiente', () => {
    expect(corTextoMapa('lidera')).toBe('#fff');
    expect(corTextoMapa('perde')).toBe('#fff');
  });
});
