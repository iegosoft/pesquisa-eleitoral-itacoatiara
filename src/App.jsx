import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { TemaProvider } from './contexts/TemaContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <TemaProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TemaProvider>
  );
}

export default App;
