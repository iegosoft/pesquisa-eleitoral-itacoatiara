import { useMemo, useState } from 'react';
import { useDadosPainel } from './useDadosPainel.js';
import {
  aplicarFiltros,
  calcularEvolucao,
  calcularDesempenhoPorBairro,
  calcularCandidatoPorBairro,
  calcularIntencaoVoto,
  calcularResumo,
  calcularResumoAgregado,
  calcularResultadoFoco,
  calcularPerfil,
  intervaloDeDatasInvertido,
} from './agregacoes.js';
import Filtros from './Filtros.jsx';
import CardsResumo from './CardsResumo.jsx';
import ResultadoFoco from './ResultadoFoco.jsx';
import RankingIntencao from './RankingIntencao.jsx';
import PerfilAmostra from './PerfilAmostra.jsx';
import DesempenhoPorBairro from './DesempenhoPorBairro.jsx';
import GraficoEvolucao from './GraficoEvolucao.jsx';
import { SECOES_DASHBOARD } from './secoesDashboard.js';
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

function nenhumFiltroAtivo(filtros) {
  return (
    filtros.bairro === 'todos' &&
    filtros.sexo === 'todos' &&
    filtros.faixaIdade === 'todas' &&
    !filtros.dataInicio &&
    !filtros.dataFim
  );
}

// Com o intervalo invertido, o filtro de data é ignorado (e o Filtros explica
// o erro) em vez de zerar o painel inteiro.
function paraFiltrosDeData(filtros, { ignorarData } = {}) {
  const usarData = !ignorarData && !intervaloDeDatasInvertido(filtros);
  const dataInicio = usarData && filtros.dataInicio ? new Date(`${filtros.dataInicio}T00:00:00`) : null;
  const dataFim = usarData && filtros.dataFim ? new Date(`${filtros.dataFim}T23:59:59`) : null;
  return { ...filtros, dataInicio, dataFim };
}

function PainelDashboard() {
  const { respostas, residencias, candidatos, bairrosDisponiveis, totalEntrevistadosAgregado } =
    useDadosPainel();
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [periodoEvolucao, setPeriodoEvolucao] = useState(7);
  const [candidatosAbertos, setCandidatosAbertos] = useState({ federal: null, estadual: null });
  const [aviso, setAviso] = useState('');

  const candidatosFederal = useMemo(() => candidatos.filter((c) => c.cargo === 'federal'), [candidatos]);
  const candidatosEstadual = useMemo(() => candidatos.filter((c) => c.cargo === 'estadual'), [candidatos]);
  const focoFederal = candidatosFederal.find((c) => c.isFoco) ?? null;
  const focoEstadual = candidatosEstadual.find((c) => c.isFoco) ?? null;

  const respostasFiltradas = useMemo(
    () => aplicarFiltros(respostas, paraFiltrosDeData(filtros)),
    [respostas, filtros],
  );

  // A evolução tem seletor de período próprio (7/14/30 dias), então não
  // aplicamos o filtro de intervalo de datas do topo aqui, só bairro/sexo/faixa.
  const respostasParaEvolucao = useMemo(
    () => aplicarFiltros(respostas, paraFiltrosDeData(filtros, { ignorarData: true })),
    [respostas, filtros],
  );

  // Sem filtro ativo, o resumo não precisa da lista completa de entrevistados:
  // usa a contagem agregada (1 leitura) e os dados das residências, que já são
  // buscados para o filtro de bairro. Com filtro ativo, o resumo é recalculado
  // a partir das respostas filtradas, como antes.
  const resumo = useMemo(() => {
    if (nenhumFiltroAtivo(filtros) && totalEntrevistadosAgregado !== null) {
      return calcularResumoAgregado(residencias, totalEntrevistadosAgregado);
    }
    return calcularResumo(respostasFiltradas);
  }, [filtros, residencias, totalEntrevistadosAgregado, respostasFiltradas]);
  const itensFederal = useMemo(
    () => calcularIntencaoVoto(respostasFiltradas, candidatosFederal, 'votoFederal'),
    [respostasFiltradas, candidatosFederal],
  );
  const itensEstadual = useMemo(
    () => calcularIntencaoVoto(respostasFiltradas, candidatosEstadual, 'votoEstadual'),
    [respostasFiltradas, candidatosEstadual],
  );
  const resultadoFederal = useMemo(() => calcularResultadoFoco(itensFederal), [itensFederal]);
  const resultadoEstadual = useMemo(() => calcularResultadoFoco(itensEstadual), [itensEstadual]);
  const desempenhoPorBairro = useMemo(
    () => calcularDesempenhoPorBairro(respostasFiltradas, candidatosFederal, candidatosEstadual),
    [respostasFiltradas, candidatosFederal, candidatosEstadual],
  );
  const perfil = useMemo(() => calcularPerfil(respostasFiltradas), [respostasFiltradas]);
  const evolucao = useMemo(
    () => calcularEvolucao(respostasParaEvolucao, focoFederal, focoEstadual, periodoEvolucao),
    [respostasParaEvolucao, focoFederal, focoEstadual, periodoEvolucao],
  );
  const detalheFederal = useMemo(
    () => candidatosAbertos.federal && calcularCandidatoPorBairro(respostasFiltradas, candidatosAbertos.federal, 'votoFederal'),
    [respostasFiltradas, candidatosAbertos.federal],
  );
  const detalheEstadual = useMemo(
    () =>
      candidatosAbertos.estadual && calcularCandidatoPorBairro(respostasFiltradas, candidatosAbertos.estadual, 'votoEstadual'),
    [respostasFiltradas, candidatosAbertos.estadual],
  );

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
          respostasFiltradas.length === 1 ? 'entrevistado' : 'entrevistados'
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
