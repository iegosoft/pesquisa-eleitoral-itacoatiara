import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DesempenhoPorBairro from './DesempenhoPorBairro.jsx';
import GraficoEvolucao from './GraficoEvolucao.jsx';

describe('DesempenhoPorBairro', () => {
  it('mostra entrevistas, percentual e status com texto (nao so cor) e marca amostra pequena', () => {
    render(
      <DesempenhoPorBairro
        dados={[
          {
            bairro: 'Centro',
            entrevistas: 1,
            amostraPequena: true,
            federal: { percentual: 100, status: 'lidera' },
            estadual: null,
          },
        ]}
      />,
    );

    const bloco = screen.getByRole('listitem');
    expect(within(bloco).getByText('1 entrevista')).toBeInTheDocument();
    expect(within(bloco).getByText('Amostra pequena')).toBeInTheDocument();
    expect(within(bloco).getByText('100%')).toBeInTheDocument();
    expect(within(bloco).getByText('Lidera')).toBeInTheDocument();
    expect(within(bloco).getByText('sem candidato foco')).toBeInTheDocument();
  });

  it('explica o criterio de lidera, empate e perde', () => {
    render(<DesempenhoPorBairro dados={[]} />);

    expect(screen.getByText(/até 5 pontos do primeiro/i)).toBeInTheDocument();
    expect(screen.getByText('Sem dados suficientes ainda.')).toBeInTheDocument();
  });
});

describe('GraficoEvolucao', () => {
  it('avisa quando o periodo nao tem coleta, em vez de desenhar 0%', () => {
    const dias = Array.from({ length: 7 }, (_, i) => ({
      data: `0${i + 1}/10`,
      entrevistas: 0,
      percentualFederal: null,
      percentualEstadual: null,
    }));

    render(<GraficoEvolucao dados={dias} periodo={7} aoAlterarPeriodo={() => {}} ultimaColeta="08/09/2026" />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Nenhuma coleta nos últimos 7 dias. Última coleta: 08/09/2026.',
    );
    expect(screen.getByRole('button', { name: '7 dias' })).toHaveAttribute('aria-pressed', 'true');
  });
});
