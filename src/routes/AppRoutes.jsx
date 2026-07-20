import { Navigate, Route, Routes } from 'react-router-dom';
import PaginaColeta from '../pages/Coleta/PaginaColeta.jsx';
import PaginaAdmin from '../pages/Admin/PaginaAdmin.jsx';
import PaginaLogin from '../pages/Login/PaginaLogin.jsx';
import RotaProtegida from './RotaProtegida.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route
        path="/coleta"
        element={
          <RotaProtegida roleExigida="pesquisador">
            <PaginaColeta />
          </RotaProtegida>
        }
      />
      <Route
        path="/admin"
        element={
          <RotaProtegida roleExigida="admin">
            <PaginaAdmin />
          </RotaProtegida>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
