import { createContext, useEffect, useState } from 'react';

const TemaContext = createContext(null);

const CHAVE_ARMAZENAMENTO = 'pesquisa-eleitoral:tema';

// A escolha salva vale mais que a preferência do sistema; sem escolha salva,
// segue o modo (claro/escuro) do celular ou do computador.
function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (salvo === 'claro' || salvo === 'escuro') return salvo;
  } catch {
    // Navegação privada ou armazenamento bloqueado: segue sem a escolha salva.
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'claro' : 'escuro';
}

function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
  }, [tema]);

  function alternarTema() {
    setTema((atual) => {
      const novo = atual === 'escuro' ? 'claro' : 'escuro';
      try {
        localStorage.setItem(CHAVE_ARMAZENAMENTO, novo);
      } catch {
        // Sem armazenamento, o tema vale só até fechar a página.
      }
      return novo;
    });
  }

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>;
}

export { TemaContext, TemaProvider, CHAVE_ARMAZENAMENTO };
