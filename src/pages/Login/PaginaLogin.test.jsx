import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { sair } from '../../services/auth.js';
import PaginaLogin from './PaginaLogin.jsx';

vi.mock('../../services/auth.js', () => ({ entrar: vi.fn(), sair: vi.fn() }));

beforeEach(() => {
  vi.mocked(sair).mockClear();
});

function renderComAuth(valorAuth) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={valorAuth}>
        <PaginaLogin />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('PaginaLogin', () => {
  it('avisa o usuario e libera o botao quando esta autenticado mas sem perfil cadastrado', () => {
    renderComAuth({ usuarioAuth: { uid: 'sem-role' }, role: null, nome: null, carregando: false });

    expect(screen.getByText(/não tem um perfil cadastrado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).not.toBeDisabled();
  });

  it('encerra a sessao da conta sem perfil e orienta a entrar com outra conta', () => {
    renderComAuth({ usuarioAuth: { uid: 'sem-role' }, role: null, nome: null, carregando: false });

    expect(sair).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/entre com outra conta/i)).toBeInTheDocument();
  });

  it('nao encerra a sessao de quem tem perfil', () => {
    renderComAuth({ usuarioAuth: { uid: 'admin-1' }, role: 'admin', nome: 'Admin', carregando: false });

    expect(sair).not.toHaveBeenCalled();
  });

  it('nao mostra o aviso de perfil enquanto ainda esta carregando', () => {
    renderComAuth({ usuarioAuth: { uid: 'x' }, role: null, nome: null, carregando: true });

    expect(screen.queryByText(/não tem um perfil cadastrado/i)).not.toBeInTheDocument();
  });

  it('redireciona sem mostrar aviso quando o usuario tem role', () => {
    renderComAuth({ usuarioAuth: { uid: 'admin-1' }, role: 'admin', nome: 'Admin', carregando: false });

    expect(screen.queryByText(/não tem um perfil cadastrado/i)).not.toBeInTheDocument();
  });
});
