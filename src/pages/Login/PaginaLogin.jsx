import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entrar, sair } from '../../services/auth.js';
import { useAuth } from '../../contexts/useAuth.js';
import BotaoTema from '../../components/BotaoTema.jsx';
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
    if (carregando || !usuarioAuth) return;
    if (role) {
      navigate(CAMINHO_POR_ROLE[role] ?? '/login', { replace: true });
      return;
    }
    // Autenticado no Firebase Auth mas sem papel cadastrado em usuarios/{uid}
    // (ou documento sem o campo role). A sessão é encerrada para não voltar
    // ao mesmo erro toda vez que o app for reaberto.
    setErro(
      'Sua conta não tem um perfil cadastrado no sistema. Peça ao administrador para liberar o acesso ou entre com outra conta.',
    );
    setEnviando(false);
    sair();
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
      <BotaoTema compacto className={styles.botaoTema} />
      <form className={styles.cartao} onSubmit={aoEnviar}>
        <div className={styles.marca}>
          <span className={styles.logoMarca} aria-hidden="true">
            <img src="/icons/icon-192.png" alt="" />
          </span>
          <span className={styles.nomeSistema}>Pesquisa Eleitoral · Itacoatiara</span>
        </div>
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
