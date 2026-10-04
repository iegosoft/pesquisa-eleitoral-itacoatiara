import { useEffect, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar.jsx';
import Cabecalho from '../../components/Cabecalho.jsx';
import PainelCandidatos from './PainelCandidatos.jsx';
import PainelDashboard from './Dashboard/PainelDashboard.jsx';
import PainelDados from './Dados/PainelDados.jsx';
import styles from './PaginaAdmin.module.css';

const SECOES = {
  dashboard: {
    rotulo: 'Dashboard',
    subtitulo: 'Visão geral da pesquisa de intenção de votos',
    Conteudo: PainelDashboard,
  },
  candidatos: {
    rotulo: 'Candidatos',
    subtitulo: 'Cadastro e gerenciamento dos candidatos da pesquisa',
    Conteudo: PainelCandidatos,
  },
  dados: {
    rotulo: 'Dados',
    subtitulo: 'Importação, exportação e cadastro manual de dados coletados',
    Conteudo: PainelDados,
  },
};

function pularParaConteudo(evento) {
  evento.preventDefault();
  document.getElementById('conteudo-principal')?.focus();
}

function PaginaAdmin() {
  const { secao: secaoDaUrl } = useParams();
  const secao = SECOES[secaoDaUrl];
  const primeiraSecao = useRef(true);

  // Ao trocar de seção, o título da aba muda e o foco vai para o título da
  // página: quem usa teclado continua dali, e o leitor de tela anuncia a
  // página nova. Na primeira abertura o foco fica onde o navegador colocou.
  useEffect(() => {
    if (!secao) return;
    document.title = `${secao.rotulo} · Pesquisa Eleitoral`;
    if (primeiraSecao.current) {
      primeiraSecao.current = false;
      return;
    }
    document.getElementById('titulo-pagina')?.focus();
  }, [secao]);

  if (!secao) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className={styles.shell}>
      <a href="#conteudo-principal" className={styles.pularConteudo} onClick={pularParaConteudo}>
        Pular para o conteúdo
      </a>
      <Sidebar />

      <div className={styles.areaConteudo}>
        <Cabecalho secaoAtual={secao.rotulo} titulo={secao.rotulo} subtitulo={secao.subtitulo} />
        <main id="conteudo-principal" className={styles.conteudo} tabIndex={-1}>
          <secao.Conteudo />
        </main>
      </div>
    </div>
  );
}

export default PaginaAdmin;
