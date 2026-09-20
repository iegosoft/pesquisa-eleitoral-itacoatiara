import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormularioCasa from './FormularioCasa.jsx';

function preencherCasaCompleta() {
  fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } });
  fireEvent.click(screen.getByRole('button', { name: '1' }));

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
