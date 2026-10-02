import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { intervaloDeDatasInvertido } from './agregacoes.js';
import Filtros from './Filtros.jsx';

const FILTROS_VAZIOS = { bairro: 'todos', sexo: 'todos', faixaIdade: 'todas', dataInicio: '', dataFim: '' };

function renderFiltros(filtros, props = {}) {
  return render(
    <Filtros
      filtros={{ ...FILTROS_VAZIOS, ...filtros }}
      aoAlterar={() => {}}
      aoLimpar={() => {}}
      temFiltroAtivo={false}
      bairrosDisponiveis={[]}
      {...props}
    />,
  );
}

describe('intervaloDeDatasInvertido', () => {
  it('so acusa erro quando as duas datas existem e a inicial e depois da final', () => {
    expect(intervaloDeDatasInvertido({ dataInicio: '2026-09-30', dataFim: '2026-09-01' })).toBe(true);
    expect(intervaloDeDatasInvertido({ dataInicio: '2026-09-01', dataFim: '2026-09-30' })).toBe(false);
    expect(intervaloDeDatasInvertido({ dataInicio: '2026-09-30', dataFim: '2026-09-30' })).toBe(false);
    expect(intervaloDeDatasInvertido({ dataInicio: '2026-09-30', dataFim: '' })).toBe(false);
  });
});

describe('Filtros — intervalo de datas', () => {
  it('explica o erro quando o intervalo esta invertido', () => {
    renderFiltros({ dataInicio: '2026-09-30', dataFim: '2026-09-01' });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A data inicial (30/09/2026) é depois da data final (01/09/2026)',
    );
    expect(screen.getByLabelText('De')).toHaveAttribute('aria-invalid', 'true');
  });

  it('limita o calendario de cada data pela outra', () => {
    renderFiltros({ dataInicio: '2026-09-01', dataFim: '2026-09-30' });

    expect(screen.getByLabelText('De')).toHaveAttribute('max', '2026-09-30');
    expect(screen.getByLabelText('Até')).toHaveAttribute('min', '2026-09-01');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('mostra "Limpar filtros" so com filtro ativo', () => {
    const aoLimpar = vi.fn();
    const { rerender } = renderFiltros({});
    expect(screen.queryByRole('button', { name: 'Limpar filtros' })).not.toBeInTheDocument();

    rerender(
      <Filtros
        filtros={{ ...FILTROS_VAZIOS, sexo: 'feminino' }}
        aoAlterar={() => {}}
        aoLimpar={aoLimpar}
        temFiltroAtivo
        bairrosDisponiveis={[]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(aoLimpar).toHaveBeenCalled();
  });
});
