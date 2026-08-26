import { useState } from 'react';
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

function PaginaAdmin() {
  const [secaoAtiva, setSecaoAtiva] = useState('dashboard');
  const secao = SECOES[secaoAtiva];

  return (
    <div className={styles.shell}>
      <Sidebar abaAtiva={secaoAtiva} aoNavegar={setSecaoAtiva} />

      <div className={styles.areaConteudo}>
        <Cabecalho secaoAtual={secao.rotulo} titulo={secao.rotulo} subtitulo={secao.subtitulo} />
        <main className={styles.conteudo}>
          <secao.Conteudo />
        </main>
      </div>
    </div>
  );
}

export default PaginaAdmin;
