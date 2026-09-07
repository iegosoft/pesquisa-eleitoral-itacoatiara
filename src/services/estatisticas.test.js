import { describe, expect, it, vi } from 'vitest';

const getCountFromServerMock = vi.fn(async () => ({ data: () => ({ count: 312 }) }));
const getDocsMock = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (_db, caminho) => ({ caminho }),
  collectionGroup: (_db, caminho) => ({ caminho }),
  getCountFromServer: (...args) => getCountFromServerMock(...args),
  getDocs: (...args) => getDocsMock(...args),
  onSnapshot: vi.fn(),
}));

vi.mock('./firebase.js', () => ({ db: {} }));

const { contarTotalEntrevistados } = await import('./estatisticas.js');

// Regressao da melhoria preventiva (TP2): o resumo do painel nao pode mais
// precisar baixar o documento de cada entrevistado so para exibir uma
// contagem — deve usar a agregacao nativa do Firestore.
describe('contarTotalEntrevistados', () => {
  it('usa getCountFromServer (agregacao) e nao baixa nenhum documento', async () => {
    const total = await contarTotalEntrevistados();

    expect(total).toBe(312);
    expect(getCountFromServerMock).toHaveBeenCalledTimes(1);
    expect(getDocsMock).not.toHaveBeenCalled();
  });
});
