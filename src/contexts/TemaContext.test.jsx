import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import BotaoTema from '../components/BotaoTema.jsx';
import { CHAVE_ARMAZENAMENTO, TemaProvider } from './TemaContext.jsx';

function renderBotao() {
  return render(
    <TemaProvider>
      <BotaoTema />
    </TemaProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.tema;
});

describe('Alternar tema', () => {
  it('sem escolha salva, aplica um tema no html e oferece a troca', () => {
    renderBotao();

    expect(document.documentElement.dataset.tema).toBe('escuro');
    expect(screen.getByRole('button', { name: 'Tema claro' })).toBeInTheDocument();
  });

  it('ao clicar, troca o tema do sistema inteiro e guarda a escolha', () => {
    renderBotao();

    fireEvent.click(screen.getByRole('button', { name: 'Tema claro' }));

    expect(document.documentElement.dataset.tema).toBe('claro');
    expect(localStorage.getItem(CHAVE_ARMAZENAMENTO)).toBe('claro');
    expect(screen.getByRole('button', { name: 'Tema escuro' })).toBeInTheDocument();
  });

  it('respeita a escolha salva ao abrir de novo', () => {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, 'claro');

    renderBotao();

    expect(document.documentElement.dataset.tema).toBe('claro');
  });

  it('na versao compacta (so icone), o nome da acao fica disponivel para o leitor de tela', () => {
    render(
      <TemaProvider>
        <BotaoTema compacto />
      </TemaProvider>,
    );

    expect(screen.getByRole('button', { name: 'Mudar para tema claro' })).toBeInTheDocument();
  });
});
