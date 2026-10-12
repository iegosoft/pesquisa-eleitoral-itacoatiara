import { useMemo } from 'react';
import { useDadosPainel } from './useDadosPainel.js';
import {
  aplicarFiltros,
  calcularCandidatoPorBairro,
  calcularDesempenhoPorBairro,
  calcularEvolucao,
  calcularIntencaoVoto,
  calcularPerfil,
  calcularResultadoFoco,
  calcularResumo,
  calcularResumoAgregado,
  intervaloDeDatasInvertido,
} from './agregacoes.js';

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

// Todos os números do Dashboard, calculados a partir dos dados em tempo real e
// do que o usuário escolheu na tela (filtros, período, candidatos abertos).
function useIndicadoresDashboard({ filtros, periodoEvolucao, candidatosAbertos }) {
  const { respostas, residencias, candidatos, bairrosDisponiveis, totalEntrevistadosAgregado } = useDadosPainel();

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

  return {
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
  };
}

export { useIndicadoresDashboard, nenhumFiltroAtivo };
