import { createContext, useEffect, useState } from 'react';
import { observarUsuarioAutenticado } from '../services/auth.js';
import { buscarUsuario } from '../services/usuarios.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [usuarioAuth, setUsuarioAuth] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cancelarInscricao = observarUsuarioAutenticado(async (usuario) => {
      setCarregando(true);
      setUsuarioAuth(usuario);
      setPerfil(usuario ? await buscarUsuario(usuario.uid) : null);
      setCarregando(false);
    });
    return cancelarInscricao;
  }, []);

  const valor = {
    usuarioAuth,
    role: perfil?.role ?? null,
    nome: perfil?.nome ?? null,
    carregando,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
