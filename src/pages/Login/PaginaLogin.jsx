import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entrar } from '../../services/auth.js';
import { useAuth } from '../../contexts/useAuth.js';
import styles from './PaginaLogin.module.css';

const CAMINHO_POR_ROLE = {
  pesquisador: '/coleta',
  admin: '/admin',
};

function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { usuarioAuth, role, carregando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando && usuarioAuth && role) {
      navigate(CAMINHO_POR_ROLE[role] ?? '/login', { replace: true });
    }
  }, [carregando, usuarioAuth, role, navigate]);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar(email, senha);
    } catch {
      setErro('E-mail ou senha incorretos. Confira e tente novamente.');
      setEnviando(false);
    }
  }

  return (
    <main className={styles.pagina}>
      <form className={styles.cartao} onSubmit={aoEnviar}>
        <h1>Entrar</h1>
        <label className={styles.campo}>
          E-mail
          <input
            type="email"
            className={styles.campoTexto}
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label className={styles.campo}>
          Senha
          <input
            type="password"
            className={styles.campoTexto}
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {erro && <p className={styles.erro}>{erro}</p>}
        <button type="submit" className={styles.botaoEntrar} disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}

export default PaginaLogin;
