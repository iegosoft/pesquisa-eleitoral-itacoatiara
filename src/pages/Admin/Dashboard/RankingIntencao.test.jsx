import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { calcularPerfil } from './agregacoes.js';
import PerfilAmostra from './PerfilAmostra.jsx';
import RankingIntencao from './RankingIntencao.jsx';

const ITENS = [
  { chave: 'f1', rotulo: 'Sidney Leite', partido: 'PSD', cargo: 'federal', fotoUrl: '', isFoco: true, tipo: 'candidato', quantidade: 11, percentual: 57.9 },
  { chave: 'f2', rotulo: 'Josias Melo', partido: 'PT', cargo: 'federal', fotoUrl: '', isFoco: false, tipo: 'candidato', quantidade: 5, percentual: 26.3 },
  { chave: 'indeciso', rotulo: 'Indeciso', isFoco: false, tipo: 'indeciso', quantidade: 1, percentual: 15.8 },
];

describe('RankingIntencao', () => {
  it('mostra nome, partido e percentual em texto, na ordem, legivel por leitor de tela', () => {
    render(<RankingIntencao titulo="Deputado federal" itens={ITENS} statusFoco="lidera" base={19} />);

    const linhas = screen.getAllByRole('listitem');
    expect(linhas).toHaveLength(3);
    expect(within(linhas[0]).getByText('Sidney Leite')).toBeInTheDocument();
    expect(within(linhas[0]).getByText('PSD')).toBeInTheDocument();
    expect(within(linhas[0]).getByText('57,9%')).toBeInTheDocument();
    expect(within(linhas[0]).getByText('Foco')).toBeInTheDocument();
    expect(within(linhas[0]).getByText('11 votos')).toBeInTheDocument();
    expect(within(linhas[2]).getByText('1 voto')).toBeInTheDocument();
    expect(within(linhas[2]).getByText('Indeciso')).toBeInTheDocument();
    expect(screen.getByText('Base: 19 entrevistados')).toBeInTheDocument();
  });
});

describe('calcularPerfil e PerfilAmostra', () => {
  const respostas = [
    { sexo: 'feminino', faixaIdade: '16-24' },
    { sexo: 'feminino', faixaIdade: '60+' },
    { sexo: 'masculino', faixaIdade: '60+' },
    { sexo: 'feminino', faixaIdade: '25-34' },
  ];

  it('calcula a distribuicao por sexo e faixa etaria', () => {
    const perfil = calcularPerfil(respostas);

    expect(perfil.total).toBe(4);
    expect(perfil.sexo).toEqual([
      { chave: 'feminino', rotulo: 'Feminino', quantidade: 3, percentual: 75 },
      { chave: 'masculino', rotulo: 'Masculino', quantidade: 1, percentual: 25 },
    ]);
    expect(perfil.faixaIdade.find((f) => f.chave === '60+')).toMatchObject({ rotulo: '60 anos ou mais', quantidade: 2 });
  });

  it('as roscas trazem os valores tambem em texto, na legenda', () => {
    render(<PerfilAmostra perfil={calcularPerfil(respostas)} />);

    expect(screen.getByText('Feminino').closest('li')).toHaveTextContent('75% (3)');
    expect(screen.getByText('60 anos ou mais').closest('li')).toHaveTextContent('50% (2)');
  });
});
