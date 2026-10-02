import { useMemo, useState } from 'react';
import { useDadosPainel } from './useDadosPainel.js';
import {
  aplicarFiltros,
  calcularEvolucao,
  calcularDesempenhoPorBairro,
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
import styles from './PainelDashboard.module.css';

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

  return (
    <div className={styles.painel}>
      <Filtros
        filtros={filtros}
        aoAlterar={setFiltros}
        aoLimpar={() => setFiltros(filtrosIniciais())}
        temFiltroAtivo={!nenhumFiltroAtivo(filtros)}
        bairrosDisponiveis={bairrosDisponiveis}
      />

      <ResultadoFoco federal={resultadoFederal} estadual={resultadoEstadual} base={respostasFiltradas.length} />

      <section id="coleta" className={styles.secao} aria-labelledby="titulo-coleta">
        <h2 id="titulo-coleta" className={styles.tituloSecao}>Andamento da coleta</h2>
        <CardsResumo resumo={resumo} />
      </section>

      <section id="intencao" className={styles.secao} aria-labelledby="titulo-intencao">
        <h2 id="titulo-intencao" className={styles.tituloSecao}>Intenção de voto</h2>
        <div className={styles.gradeLarga}>
          <RankingIntencao
            titulo="Deputado federal"
            itens={itensFederal}
            statusFoco={resultadoFederal?.status}
            base={respostasFiltradas.length}
          />
          <RankingIntencao
            titulo="Deputado estadual"
            itens={itensEstadual}
            statusFoco={resultadoEstadual?.status}
            base={respostasFiltradas.length}
          />
        </div>
      </section>

      <section id="territorio" className={styles.secao} aria-labelledby="titulo-territorio">
        <h2 id="titulo-territorio" className={styles.tituloSecao}>Território</h2>
        <DesempenhoPorBairro dados={desempenhoPorBairro} />
      </section>

      <section id="perfil" className={styles.secao} aria-labelledby="titulo-perfil">
        <h2 id="titulo-perfil" className={styles.tituloSecao}>Perfil da amostra</h2>
        <PerfilAmostra perfil={perfil} />
      </section>

      <section id="tendencia" className={styles.secao} aria-labelledby="titulo-tendencia">
        <h2 id="titulo-tendencia" className={styles.tituloSecao}>Tendência</h2>
        <GraficoEvolucao
          dados={evolucao}
          periodo={periodoEvolucao}
          aoAlterarPeriodo={setPeriodoEvolucao}
          ultimaColeta={resumo.ultimaColeta}
        />
      </section>
    </div>
  );
}

export default PainelDashboard;
