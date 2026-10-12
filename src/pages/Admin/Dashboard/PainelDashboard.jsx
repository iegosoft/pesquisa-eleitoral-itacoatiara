import { useState } from 'react';
import { nenhumFiltroAtivo, useIndicadoresDashboard } from './useIndicadoresDashboard.js';
import Filtros from './Filtros.jsx';
import CardsResumo from './CardsResumo.jsx';
import ResultadoFoco from './ResultadoFoco.jsx';
import RankingIntencao from './RankingIntencao.jsx';
import PerfilAmostra from './PerfilAmostra.jsx';
import DesempenhoPorBairro from './DesempenhoPorBairro.jsx';
import GraficoEvolucao from './GraficoEvolucao.jsx';
import { SECOES_DASHBOARD } from './secoesDashboard.js';
import { pluralizar } from '../../../utils/texto.js';
import styles from './PainelDashboard.module.css';

// Título grande + uma linha dizendo que pergunta a seção responde, para o
// usuário saber o que está vendo sem precisar ler os gráficos.
function Secao({ id, complemento, children }) {
  const { titulo, descricao } = SECOES_DASHBOARD.find((secao) => secao.id === id);
  return (
    <section id={id} className={styles.secao} aria-labelledby={`titulo-${id}`}>
      <header className={styles.cabecalhoSecao}>
        <div>
          <h2 id={`titulo-${id}`} className={styles.tituloSecao}>
            {titulo}
          </h2>
          <p className={styles.descricaoSecao}>{descricao}</p>
        </div>
        {complemento && <span className={styles.complemento}>{complemento}</span>}
      </header>
      {children}
    </section>
  );
}

function filtrosIniciais() {
  return { bairro: 'todos', sexo: 'todos', faixaIdade: 'todas', dataInicio: '', dataFim: '' };
}

function PainelDashboard() {
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [periodoEvolucao, setPeriodoEvolucao] = useState(7);
  const [candidatosAbertos, setCandidatosAbertos] = useState({ federal: null, estadual: null });
  const [aviso, setAviso] = useState('');
  const {
    bairrosDisponiveis,
    respostasFiltradas,
    resumo,
    itensFederal,
    itensEstadual,
    resultadoFederal,
    resultadoEstadual,
    desempenhoPorBairro,
    perfil,
    evolucao,
    detalheFederal,
    detalheEstadual,
  } = useIndicadoresDashboard({ filtros, periodoEvolucao, candidatosAbertos });

  function alternarCandidato(cargo, id) {
    setCandidatosAbertos((atual) => ({ ...atual, [cargo]: atual[cargo] === id ? null : id }));
  }

  // Clique num bairro: filtra o painel inteiro e leva o usuário de volta ao
  // topo (os filtros), onde o aviso explica o que aconteceu e como desfazer.
  function filtrarPorBairro(bairro) {
    setFiltros((atual) => ({ ...atual, bairro }));
    setAviso(`Painel filtrado pelo bairro ${bairro}. Use "Limpar filtros" para voltar a todos os bairros.`);
    document.getElementById('titulo-filtros')?.focus();
  }

  function alterarFiltros(novos) {
    setFiltros(novos);
    setAviso('');
  }

  return (
    <div className={styles.painel}>
      <Filtros
        filtros={filtros}
        aoAlterar={alterarFiltros}
        aoLimpar={() => alterarFiltros(filtrosIniciais())}
        temFiltroAtivo={!nenhumFiltroAtivo(filtros)}
        bairrosDisponiveis={bairrosDisponiveis}
        aviso={aviso}
      />

      <Secao
        id="resultado"
        complemento={`Base: ${respostasFiltradas.length.toLocaleString('pt-BR')} ${
          pluralizar(respostasFiltradas.length, 'entrevistado', 'entrevistados')
        }`}
      >
        <ResultadoFoco federal={resultadoFederal} estadual={resultadoEstadual} />
      </Secao>

      <Secao id="coleta">
        <CardsResumo resumo={resumo} />
      </Secao>

      <Secao id="intencao">
        <div className={styles.gradeLarga}>
          <RankingIntencao
            titulo="Deputado federal"
            cargo="federal"
            itens={itensFederal}
            statusFoco={resultadoFederal?.status}
            base={respostasFiltradas.length}
            candidatoAberto={candidatosAbertos.federal}
            detalhe={detalheFederal}
            aoAlternarCandidato={(id) => alternarCandidato('federal', id)}
          />
          <RankingIntencao
            titulo="Deputado estadual"
            cargo="estadual"
            itens={itensEstadual}
            statusFoco={resultadoEstadual?.status}
            base={respostasFiltradas.length}
            candidatoAberto={candidatosAbertos.estadual}
            detalhe={detalheEstadual}
            aoAlternarCandidato={(id) => alternarCandidato('estadual', id)}
          />
        </div>
      </Secao>

      <Secao id="territorio">
        <DesempenhoPorBairro dados={desempenhoPorBairro} aoSelecionarBairro={filtrarPorBairro} />
      </Secao>

      <Secao id="perfil">
        <PerfilAmostra perfil={perfil} />
      </Secao>

      <Secao id="tendencia">
        <GraficoEvolucao
          dados={evolucao}
          periodo={periodoEvolucao}
          aoAlterarPeriodo={setPeriodoEvolucao}
          ultimaColeta={resumo.ultimaColeta}
        />
      </Secao>
    </div>
  );
}

export default PainelDashboard;
