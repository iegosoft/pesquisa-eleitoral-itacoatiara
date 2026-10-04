import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { atualizarEntrevistado, excluirCasa, excluirEntrevistado } from '../../../services/entrevistas.js';
import { agruparEntrevistas } from './agruparEntrevistas.js';
import PainelEntrevistas from './PainelEntrevistas.jsx';

const CASAS = [
  { id: 'c1', bairro: 'Centro', dataColeta: new Date('2026-09-08T10:00:00'), pesquisadorId: 'p1', qtdMoradores: 2 },
  { id: 'c2', bairro: 'Iracy', dataColeta: new Date('2026-10-02T10:00:00'), pesquisadorId: 'p1', qtdMoradores: 1 },
  { id: 'c3', bairro: 'Centro', dataColeta: new Date('2026-10-01T10:00:00'), pesquisadorId: 'p2', qtdMoradores: 1 },
];
const MORADORES = [
  { id: 'm1', residenciaId: 'c1', sexo: 'feminino', faixaIdade: '16-24', votoFederal: 'f1', votoEstadual: 'e1' },
  { id: 'm2', residenciaId: 'c1', sexo: 'masculino', faixaIdade: '60+', votoFederal: 'indeciso', votoEstadual: 'branco_nulo' },
  { id: 'm3', residenciaId: 'c2', sexo: 'feminino', faixaIdade: '25-34', votoFederal: 'f2', votoEstadual: 'e1' },
];
const CANDIDATOS = [
  { id: 'f1', nome: 'Sidney Leite', cargo: 'federal' },
  { id: 'f2', nome: 'Josias Melo', cargo: 'federal' },
  { id: 'e1', nome: 'DONMARQUES', cargo: 'estadual' },
];

vi.mock('../../../services/estatisticas.js', () => ({
  observarResidencias: (callback) => {
    callback(CASAS);
    return () => {};
  },
  observarTodosEntrevistados: (callback) => {
    callback(MORADORES);
    return () => {};
  },
}));
vi.mock('../../../services/candidatos.js', () => ({
  observarCandidatos: (callback) => {
    callback(CANDIDATOS);
    return () => {};
  },
}));
vi.mock('../../../services/usuarios.js', () => ({
  listarPesquisadores: () => Promise.resolve([{ uid: 'p1', nome: 'Iego PESQUISADOR' }]),
}));
vi.mock('../../../services/entrevistas.js', () => ({
  atualizarEntrevistado: vi.fn(() => Promise.resolve()),
  excluirEntrevistado: vi.fn(() => Promise.resolve()),
  excluirCasa: vi.fn(() => Promise.resolve()),
}));

beforeEach(() => {
  vi.mocked(atualizarEntrevistado).mockClear();
  vi.mocked(excluirEntrevistado).mockClear();
  vi.mocked(excluirCasa).mockClear();
});

async function renderPainel() {
  render(<PainelEntrevistas />);
  await act(() => Promise.resolve());
}

describe('agruparEntrevistas', () => {
  const nomeDoPesquisador = (id) => (id === 'p1' ? 'Iego' : 'Outro');

  it('junta os moradores por casa, mais recentes primeiro, e ignora casas sem entrevistado', () => {
    const casas = agruparEntrevistas({
      residencias: CASAS,
      entrevistados: MORADORES,
      nomeDoPesquisador,
      filtros: { bairro: 'todos', pesquisador: 'todos' },
    });

    expect(casas.map((casa) => casa.id)).toEqual(['c2', 'c1']);
    expect(casas[1].moradores).toHaveLength(2);
    expect(casas[1].pesquisador).toBe('Iego');
  });

  it('filtra por bairro e por pesquisador', () => {
    const casas = agruparEntrevistas({
      residencias: CASAS,
      entrevistados: MORADORES,
      nomeDoPesquisador,
      filtros: { bairro: 'Centro', pesquisador: 'p1' },
    });

    expect(casas.map((casa) => casa.id)).toEqual(['c1']);
  });
});

describe('PainelEntrevistas', () => {
  it('lista as casas com os moradores e as respostas por extenso', async () => {
    await renderPainel();

    const centro = screen.getByRole('article', { name: /casa de Centro/ });
    const linhas = within(centro).getAllByRole('row');
    expect(linhas[1]).toHaveTextContent('Feminino');
    expect(linhas[1]).toHaveTextContent('Sidney Leite');
    expect(linhas[2]).toHaveTextContent('Indeciso');
    expect(linhas[2]).toHaveTextContent('Branco/Nulo');
    expect(screen.getByText('2 casas · 3 entrevistados')).toBeInTheDocument();
  });

  it('corrige o voto de um morador', async () => {
    await renderPainel();

    fireEvent.click(screen.getByRole('button', { name: 'Corrigir morador 1 da casa de Centro' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Voto federal do morador 1 da casa de Centro' }), {
      target: { value: 'f2' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    });

    expect(atualizarEntrevistado).toHaveBeenCalledWith(
      'c1',
      'm1',
      expect.objectContaining({ sexo: 'feminino', faixaIdade: '16-24', votoFederal: 'f2', votoEstadual: 'e1' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Dados do morador 1 da casa de Centro corrigidos.');
  });

  it('so exclui um morador depois de confirmar', async () => {
    await renderPainel();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir morador 2 da casa de Centro' }));
    expect(excluirEntrevistado).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sim, excluir' }));
    });

    expect(excluirEntrevistado).toHaveBeenCalledWith('c1', 'm2', { ultimoDaCasa: false });
  });

  it('avisa que a casa vai junto quando e o ultimo morador', async () => {
    await renderPainel();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir morador 1 da casa de Iracy' }));

    expect(screen.getByText(/a casa também será excluída/)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sim, excluir' }));
    });
    expect(excluirEntrevistado).toHaveBeenCalledWith('c2', 'm3', { ultimoDaCasa: true });
  });

  it('exclui a casa inteira, com todos os moradores, depois de confirmar', async () => {
    await renderPainel();

    const centro = screen.getByRole('article', { name: /casa de Centro/ });
    fireEvent.click(within(centro).getByRole('button', { name: 'Excluir casa' }));
    await act(async () => {
      fireEvent.click(within(centro).getByRole('button', { name: 'Sim, excluir a casa' }));
    });

    expect(excluirCasa).toHaveBeenCalledWith('c1', ['m1', 'm2']);
  });
});
