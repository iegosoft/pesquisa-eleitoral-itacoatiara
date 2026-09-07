import { useMemo, useState } from 'react';
import { useDadosPainel } from './useDadosPainel.js';
import {
  aplicarFiltros,
  calcularEvolucao,
  calcularIntencaoVoto,
  calcularMapaCalor,
  calcularPorBairro,
  calcularResumo,
  calcularResumoAgregado,
} from './agregacoes.js';
import Filtros from './Filtros.jsx';
import CardsResumo from './CardsResumo.jsx';
import GraficoIntencaoVoto from './GraficoIntencaoVoto.jsx';
import GraficoPorBairro from './GraficoPorBairro.jsx';
import MapaCalor from './MapaCalor.jsx';
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

function paraFiltrosDeData(filtros, { ignorarData } = {}) {
  const dataInicio = !ignorarData && filtros.dataInicio ? new Date(`${filtros.dataInicio}T00:00:00`) : null;
  const dataFim = !ignorarData && filtros.dataFim ? new Date(`${filtros.dataFim}T23:59:59`) : null;
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
  const dadosPorBairro = useMemo(
    () => calcularPorBairro(respostasFiltradas, focoFederal, focoEstadual),
    [respostasFiltradas, focoFederal, focoEstadual],
  );
  const mapaFederal = useMemo(
    () => calcularMapaCalor(respostasFiltradas, candidatosFederal, 'votoFederal'),
    [respostasFiltradas, candidatosFederal],
  );
  const mapaEstadual = useMemo(
    () => calcularMapaCalor(respostasFiltradas, candidatosEstadual, 'votoEstadual'),
    [respostasFiltradas, candidatosEstadual],
  );
  const evolucao = useMemo(
    () => calcularEvolucao(respostasParaEvolucao, focoFederal, focoEstadual, periodoEvolucao),
    [respostasParaEvolucao, focoFederal, focoEstadual, periodoEvolucao],
  );

  return (
    <div className={styles.painel}>
      <Filtros filtros={filtros} aoAlterar={setFiltros} bairrosDisponiveis={bairrosDisponiveis} />

      <CardsResumo resumo={resumo} />

      <div className={styles.grade}>
        <GraficoIntencaoVoto titulo="Deputado federal" itens={itensFederal} cargo="federal" />
        <GraficoIntencaoVoto titulo="Deputado estadual" itens={itensEstadual} cargo="estadual" />
        <GraficoEvolucao dados={evolucao} periodo={periodoEvolucao} aoAlterarPeriodo={setPeriodoEvolucao} />
      </div>

      <div className={styles.secao}>
        <GraficoPorBairro dados={dadosPorBairro} />
      </div>

      <div className={styles.grade}>
        <MapaCalor titulo="Status do foco por bairro — Federal" dados={mapaFederal} />
        <MapaCalor titulo="Status do foco por bairro — Estadual" dados={mapaEstadual} />
      </div>
    </div>
  );
}

export default PainelDashboard;
