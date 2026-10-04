import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { calcularCandidatoPorBairro } from './agregacoes.js';
import DesempenhoPorBairro from './DesempenhoPorBairro.jsx';
import Filtros from './Filtros.jsx';
import RankingIntencao from './RankingIntencao.jsx';

const ITENS = [
  { chave: 'f1', rotulo: 'Sidney Leite', partido: 'PSD', cargo: 'federal', fotoUrl: '', isFoco: true, tipo: 'candidato', quantidade: 2, percentual: 66.7 },
  { chave: 'indeciso', rotulo: 'Indeciso', isFoco: false, tipo: 'indeciso', quantidade: 1, percentual: 33.3 },
];

describe('calcularCandidatoPorBairro', () => {
  it('mostra votos e percentual do candidato em cada bairro, do mais forte ao mais fraco', () => {
    const respostas = [
      { bairro: 'Centro', votoFederal: 'f1' },
      { bairro: 'Centro', votoFederal: 'f2' },
      { bairro: 'Iracy', votoFederal: 'f1' },
    ];

    expect(calcularCandidatoPorBairro(respostas, 'f1', 'votoFederal')).toEqual([
      { bairro: 'Iracy', entrevistas: 1, votos: 1, percentual: 100, amostraPequena: true },
      { bairro: 'Centro', entrevistas: 2, votos: 1, percentual: 50, amostraPequena: true },
    ]);
  });
});

describe('Ranking interativo', () => {
  it('o nome do candidato e um botao que abre o desempenho bairro a bairro', () => {
    const aoAlternar = vi.fn();
    render(
      <RankingIntencao titulo="Deputado federal" cargo="federal" itens={ITENS} statusFoco="lidera" base={3} candidatoAberto={null} detalhe={null} aoAlternarCandidato={aoAlternar} />,
    );

    const botao = screen.getByRole('button', { name: 'Sidney Leite' });
    expect(botao).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(botao);
    expect(aoAlternar).toHaveBeenCalledWith('f1');
    expect(screen.queryByRole('button', { name: 'Indeciso' })).not.toBeInTheDocument();
  });

  it('com o candidato aberto, mostra cada bairro e leva o foco ao titulo do detalhe', () => {
    render(
      <RankingIntencao
        titulo="Deputado federal"
        cargo="federal"
        itens={ITENS}
        statusFoco="lidera"
        base={3}
        candidatoAberto="f1"
        detalhe={[{ bairro: 'Centro', entrevistas: 2, votos: 1, percentual: 50, amostraPequena: true }]}
        aoAlternarCandidato={() => {}}
      />,
    );

    const detalhe = screen.getByRole('region', { name: 'Sidney Leite bairro a bairro' });
    expect(within(detalhe).getByText('Centro')).toBeInTheDocument();
    expect(within(detalhe).getByText('50,0%')).toBeInTheDocument();
    expect(within(detalhe).getByText('1 de 2 entrevistas')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Sidney Leite bairro a bairro' }));
    expect(screen.getByRole('button', { name: 'Sidney Leite' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Territorio interativo', () => {
  it('clicar num bairro pede para filtrar o painel por ele', () => {
    const aoSelecionar = vi.fn();
    render(
      <DesempenhoPorBairro
        aoSelecionarBairro={aoSelecionar}
        dados={[{ bairro: 'Centro', entrevistas: 6, amostraPequena: false, federal: { percentual: 50, status: 'lidera' }, estadual: null }]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar o painel pelo bairro Centro' }));
    expect(aoSelecionar).toHaveBeenCalledWith('Centro');
  });

  it('o aviso de painel filtrado aparece junto dos filtros, numa regiao anunciada', () => {
    render(
      <Filtros
        filtros={{ bairro: 'Centro', sexo: 'todos', faixaIdade: 'todas', dataInicio: '', dataFim: '' }}
        aoAlterar={() => {}}
        aoLimpar={() => {}}
        temFiltroAtivo
        bairrosDisponiveis={['Centro']}
        aviso="Painel filtrado pelo bairro Centro."
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Painel filtrado pelo bairro Centro.');
  });
});
