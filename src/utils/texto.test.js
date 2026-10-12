import { describe, expect, it } from 'vitest';
import { iniciais } from './texto.js';

describe('iniciais', () => {
  it('usa a primeira letra do primeiro e do último nome, em maiúsculas', () => {
    expect(iniciais('Iego Costa')).toBe('IC');
    expect(iniciais('alessandro nascimento vasconcelos')).toBe('AV');
  });

  it('com um nome só, usa uma letra; ignora espaços sobrando', () => {
    expect(iniciais('DONMARQUES')).toBe('D');
    expect(iniciais('  Josias   Melo ')).toBe('JM');
  });
});
