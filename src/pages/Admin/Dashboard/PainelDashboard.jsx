import { useMemo, useState } from 'react';
import { useDadosPainel } from './useDadosPainel.js';
import {
  aplicarFiltros,
  calcularEvolucao,
  calcularIntencaoVoto,
  calcularMapaCalor,
  calcularPorBairro,
  calcularResumo,
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

function paraFiltrosDeData(filtros, { ignorarData } = {}) {
  const dataInicio = !ignorarData && filtros.dataInicio ? new Date(`${filtros.dataInicio}T00:00:00`) : null;
  const dataFim = !ignorarData && filtros.dataFim ? new Date(`${filtros.dataFim}T23:59:59`) : null;
  return { ...filtros, dataInicio, dataFim };
}

function PainelDashboard() {
  const { respostas, candidatos, bairrosDisponiveis } = useDadosPainel();
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

  const resumo = useMemo(() => calcularResumo(respostasFiltradas), [respostasFiltradas]);
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
      </div>

      <div className={styles.secao}>
        <GraficoPorBairro dados={dadosPorBairro} />
      </div>

      <div className={styles.grade}>
        <MapaCalor titulo="Mapa de calor — Federal" dados={mapaFederal} cargo="federal" />
        <MapaCalor titulo="Mapa de calor — Estadual" dados={mapaEstadual} cargo="estadual" />
      </div>

      <div className={styles.secao}>
        <GraficoEvolucao dados={evolucao} periodo={periodoEvolucao} aoAlterarPeriodo={setPeriodoEvolucao} />
      </div>
    </div>
  );
}

export default PainelDashboard;
