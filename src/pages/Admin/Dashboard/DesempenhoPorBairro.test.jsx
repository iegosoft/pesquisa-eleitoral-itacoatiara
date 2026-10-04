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

  it('traz uma tabela com os mesmos numeros do grafico, so dos dias com coleta', () => {
    const dias = [
      { data: '08/09', entrevistas: 1, percentualFederal: 100, percentualEstadual: 100 },
      { data: '09/09', entrevistas: 0, percentualFederal: null, percentualEstadual: null },
      { data: '02/10', entrevistas: 3, percentualFederal: 0, percentualEstadual: 33.333 },
    ];

    render(<GraficoEvolucao dados={dias} periodo={30} aoAlterarPeriodo={() => {}} ultimaColeta="Hoje" />);

    const tabela = screen.getByRole('table', { name: /Evolução do candidato foco nos últimos 30 dias/ });
    const linhas = within(tabela).getAllByRole('row');
    expect(linhas).toHaveLength(3);
    expect(linhas[1]).toHaveTextContent('08/09');
    expect(linhas[1]).toHaveTextContent('100,0%');
    expect(linhas[2]).toHaveTextContent('02/10');
    expect(linhas[2]).toHaveTextContent('33,3%');
    expect(screen.getByRole('img', { name: /Os valores de cada dia estão na tabela/ })).toBeInTheDocument();
  });
});
