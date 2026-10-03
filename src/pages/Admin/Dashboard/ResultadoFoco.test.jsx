import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResultadoFoco from './ResultadoFoco.jsx';

describe('ResultadoFoco', () => {
  it('responde de cara se o foco lidera e por quantos pontos', () => {
    render(
      <ResultadoFoco
        federal={{ nome: 'Sidney Leite', percentual: 57.9, posicao: 1, totalCandidatos: 3, status: 'lidera', adversario: 'Josias Melo', diferenca: 31.6 }}
        estadual={{ nome: 'Foco Est', percentual: 20, posicao: 2, totalCandidatos: 4, status: 'perde', adversario: 'Ana', diferenca: -30 }}
      />,
    );

    expect(screen.getByText('31,6 pontos à frente de Josias Melo.')).toBeInTheDocument();
    expect(screen.getByText('30 pontos atrás de Ana, que lidera.')).toBeInTheDocument();
    expect(screen.getByText('Lidera')).toBeInTheDocument();
    expect(screen.getByText('Perde')).toBeInTheDocument();
    expect(screen.getByText('Sidney Leite lidera para deputado federal')).toBeInTheDocument();
    expect(screen.getByText('Foco Est está em 2º lugar para deputado estadual')).toBeInTheDocument();
  });

  it('avisa quando o cargo nao tem candidato foco', () => {
    render(<ResultadoFoco federal={null} estadual={null} />);

    expect(screen.getAllByText('Nenhum candidato foco marcado para este cargo.')).toHaveLength(2);
  });
});
