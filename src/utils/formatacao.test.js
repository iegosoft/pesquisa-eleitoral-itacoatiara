import { describe, expect, it } from 'vitest';
import { formatarPercentual } from './formatacao.js';

// As cópias que existiam antes da refatoração, reproduzidas aqui só para
// provar que a função compartilhada dá exatamente o mesmo resultado.
function copiaComUmaCasa(valor) {
  return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}
function copiaSemCasas(valor) {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`;
}

const VALORES = [0, 5.3, 9.0909, 13.636, 22.7272, 50, 54.5454, 57.89, 66.666, 99.95, 100];

describe('formatarPercentual', () => {
  it('com 1 casa, igual à cópia antiga do ranking e da evolução', () => {
    VALORES.forEach((valor) => expect(formatarPercentual(valor, 1)).toBe(copiaComUmaCasa(valor)));
    expect(formatarPercentual(57.89, 1)).toBe('57,9%');
  });

  it('sem casas, igual à cópia antiga do perfil da amostra', () => {
    VALORES.forEach((valor) => expect(formatarPercentual(valor, 0)).toBe(copiaSemCasas(valor)));
    expect(formatarPercentual(66.666, 0)).toBe('67%');
  });
});
