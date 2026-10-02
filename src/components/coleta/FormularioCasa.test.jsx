import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormularioCasa from './FormularioCasa.jsx';

function renderFormulario() {
  render(
    <FormularioCasa
      bairros={['Centro']}
      candidatosFederal={[]}
      candidatosEstadual={[]}
      aoSalvar={() => Promise.resolve()}
    />,
  );
}

function preencherCasaCompleta(quantidade = '1') {
  fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } });
  fireEvent.click(screen.getByRole('button', { name: quantidade }));

  fireEvent.click(
    within(screen.getByRole('group', { name: 'Sexo' })).getByRole('button', { name: 'Feminino' }),
  );
  fireEvent.click(
    within(screen.getByRole('group', { name: 'Faixa de idade' })).getByRole('button', { name: '16-24' }),
  );
  fireEvent.click(
    within(screen.getByRole('group', { name: 'Voto para deputado federal' })).getByRole('button', {
      name: /indeciso/i,
    }),
  );
  fireEvent.click(
    within(screen.getByRole('group', { name: 'Voto para deputado estadual' })).getByRole('button', {
      name: /indeciso/i,
    }),
  );
}

// Regressao da adaptacao de regulamentacao (TP3): a casa so pode ser salva
// depois que o consentimento do morador for marcado, mesmo com todos os
// outros campos preenchidos.
describe('FormularioCasa — consentimento do entrevistado', () => {
  it('mantem "Salvar casa" desabilitado ate o consentimento ser marcado', () => {
    render(
      <FormularioCasa
        bairros={['Centro']}
        candidatosFederal={[]}
        candidatosEstadual={[]}
        aoSalvar={() => Promise.resolve()}
      />,
    );

    preencherCasaCompleta();

    expect(screen.getByRole('button', { name: 'Salvar casa' })).toBeDisabled();

    fireEvent.click(screen.getByLabelText(/consentiu em participar/i));

    expect(screen.getByRole('button', { name: 'Salvar casa' })).not.toBeDisabled();
  });
});

describe('FormularioCasa — controle dos moradores e pendencias', () => {
  it('lista o que falta para salvar e some quando tudo esta preenchido', () => {
    renderFormulario();
    fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } });
    fireEvent.click(screen.getByRole('button', { name: '1' }));

    const pendencias = screen.getByRole('status');
    expect(pendencias).toHaveTextContent('Morador 1: sexo, faixa de idade, voto federal, voto estadual');
    expect(pendencias).toHaveTextContent('Marcar o consentimento do morador');

    preencherCasaCompleta();
    fireEvent.click(screen.getByLabelText(/consentiu em participar/i));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('nao deixa adicionar mais entrevistados do que moradores da casa', () => {
    renderFormulario();
    preencherCasaCompleta('1');

    expect(screen.getByRole('button', { name: /adicionar próximo morador/i })).toBeDisabled();
    expect(screen.getByText(/todos os 1 morador\(es\) da casa já foram adicionados/i)).toBeInTheDocument();
  });

  it('permite remover um morador adicionado', () => {
    renderFormulario();
    preencherCasaCompleta('2');
    fireEvent.click(screen.getByRole('button', { name: /adicionar próximo morador/i }));

    expect(screen.getByRole('heading', { name: 'Morador 2' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remover morador 2' }));

    expect(screen.queryByRole('heading', { name: 'Morador 2' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /remover morador/i })).not.toBeInTheDocument();
  });

  it('bloqueia o salvamento quando ha mais entrevistados do que moradores', () => {
    renderFormulario();
    preencherCasaCompleta('2');
    fireEvent.click(screen.getByRole('button', { name: /adicionar próximo morador/i }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));

    expect(screen.getByRole('status')).toHaveTextContent('A casa tem 1 morador(es), mas há 2 entrevistados');
    expect(screen.getByRole('button', { name: 'Salvar casa' })).toBeDisabled();
  });
});
