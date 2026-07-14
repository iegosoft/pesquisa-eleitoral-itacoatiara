import { Navigate, Route, Routes } from 'react-router-dom';
import PaginaColeta from '../pages/Coleta/PaginaColeta.jsx';
import PaginaAdmin from '../pages/Admin/PaginaAdmin.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/coleta" element={<PaginaColeta />} />
      <Route path="/admin" element={<PaginaAdmin />} />
      <Route path="/" element={<Navigate to="/coleta" replace />} />
      <Route path="*" element={<Navigate to="/coleta" replace />} />
    </Routes>
  );
}

export default AppRoutes;
