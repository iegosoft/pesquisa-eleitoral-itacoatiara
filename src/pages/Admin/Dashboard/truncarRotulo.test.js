import { describe, expect, it } from 'vitest';
import { truncarRotulo } from './truncarRotulo.js';

describe('truncarRotulo', () => {
  it('mantém nomes curtos sem alteração', () => {
    expect(truncarRotulo('Josias Melo')).toBe('Josias Melo');
  });

  it('trunca nomes longos com reticências, respeitando o limite padrão', () => {
    const resultado = truncarRotulo('Alessandro Nascimento Vasconcelos Ferreira');
    expect(resultado.length).toBeLessThanOrEqual(16);
    expect(resultado.endsWith('…')).toBe(true);
  });

  it('aceita um limite customizado', () => {
    expect(truncarRotulo('Marcos Santos', 6)).toBe('Marco…');
  });

  it('não trunca um nome com exatamente o tamanho do limite', () => {
    expect(truncarRotulo('123456789012345678', 18)).toBe('123456789012345678');
  });
});
