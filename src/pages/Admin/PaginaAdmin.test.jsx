import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { TemaProvider } from '../../contexts/TemaContext.jsx';
import PaginaAdmin from './PaginaAdmin.jsx';

vi.mock('./Dashboard/PainelDashboard.jsx', () => ({ default: () => <p>conteudo-dashboard</p> }));
vi.mock('./PainelCandidatos.jsx', () => ({ default: () => <p>conteudo-candidatos</p> }));
vi.mock('./Dados/PainelDados.jsx', () => ({ default: () => <p>conteudo-dados</p> }));

function renderNaUrl(url) {
  return render(
    <TemaProvider>
      <MemoryRouter initialEntries={[url]}>
        <AuthContext.Provider value={{ usuarioAuth: { uid: 'a' }, role: 'admin', nome: 'Admin Teste', carregando: false }}>
          <Routes>
            <Route path="/admin/:secao?" element={<PaginaAdmin />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    </TemaProvider>,
  );
}

describe('PaginaAdmin', () => {
  it('abre a secao indicada na URL', () => {
    renderNaUrl('/admin/candidatos');

    expect(screen.getByText('conteudo-candidatos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Candidatos' })).toHaveAttribute('aria-current', 'page');
  });

  it('redireciona /admin para o dashboard', () => {
    renderNaUrl('/admin');

    expect(screen.getByText('conteudo-dashboard')).toBeInTheDocument();
  });

  it('redireciona secao inexistente para o dashboard', () => {
    renderNaUrl('/admin/qualquer-coisa');

    expect(screen.getByText('conteudo-dashboard')).toBeInTheDocument();
  });

  it('oferece o link Pular para o conteudo, que leva o foco ao conteudo principal', () => {
    renderNaUrl('/admin/dashboard');

    const link = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(link).toHaveAttribute('href', '#conteudo-principal');
    fireEvent.click(link);
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('ao trocar de secao, leva o foco ao titulo da pagina e atualiza o titulo da aba', () => {
    renderNaUrl('/admin/dashboard');
    expect(document.title).toBe('Dashboard · Pesquisa Eleitoral');

    fireEvent.click(screen.getByRole('link', { name: 'Dados' }));

    expect(screen.getByText('conteudo-dados')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1, name: 'Dados' }));
    expect(document.title).toBe('Dados · Pesquisa Eleitoral');
  });
});
