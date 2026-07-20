import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';

const CAMINHO_POR_ROLE = {
  pesquisador: '/coleta',
  admin: '/admin',
};

function RotaProtegida({ roleExigida, children }) {
  const { usuarioAuth, role, carregando } = useAuth();

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!usuarioAuth) {
    return <Navigate to="/login" replace />;
  }

  if (role !== roleExigida) {
    return <Navigate to={CAMINHO_POR_ROLE[role] ?? '/login'} replace />;
  }

  return children;
}

export default RotaProtegida;
