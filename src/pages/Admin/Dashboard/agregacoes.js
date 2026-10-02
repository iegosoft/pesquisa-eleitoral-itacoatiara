import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { statusFocoPorBairro } from './coresGraficos.js';

function aplicarFiltros(respostas, filtros) {
  return respostas.filter((resposta) => {
    if (filtros.bairro !== 'todos' && resposta.bairro !== filtros.bairro) return false;
    if (filtros.sexo !== 'todos' && resposta.sexo !== filtros.sexo) return false;
    if (filtros.faixaIdade !== 'todas' && resposta.faixaIdade !== filtros.faixaIdade) return false;
    if (filtros.dataInicio && (!resposta.dataColeta || resposta.dataColeta < filtros.dataInicio)) return false;
    if (filtros.dataFim && (!resposta.dataColeta || resposta.dataColeta > filtros.dataFim)) return false;
    return true;
  });
}

// Datas dos filtros vêm do <input type="date"> como "aaaa-mm-dd", então a
// comparação de texto já respeita a ordem cronológica.
function intervaloDeDatasInvertido(filtros) {
  return Boolean(filtros.dataInicio && filtros.dataFim && filtros.dataInicio > filtros.dataFim);
}

function formatarUltimaColeta(data) {
  if (!data) return '—';
  if (isToday(data)) return 'Hoje';
  if (isYesterday(data)) return 'Ontem';
  return format(data, 'dd/MM/yyyy', { locale: ptBR });
}

function calcularResumo(respostas) {
  const totalEntrevistados = respostas.length;
  const casasVisitadas = new Set(respostas.map((resposta) => resposta.residenciaId)).size;
  const bairrosCobertos = new Set(respostas.map((resposta) => resposta.bairro)).size;
  const datas = respostas.map((resposta) => resposta.dataColeta).filter(Boolean);
  const ultimaColeta = datas.length ? new Date(Math.max(...datas)) : null;

  return {
    totalEntrevistados,
    casasVisitadas,
    bairrosCobertos,
    ultimaColeta: formatarUltimaColeta(ultimaColeta),
  };
}

// Mesmo resultado de calcularResumo, mas sem depender da lista completa de
// entrevistados: casas/bairros/ultima coleta vem das residencias (ja
// carregadas para o filtro de bairro) e o total vem de uma contagem agregada.
// Só é valido quando nenhum filtro detalhado esta ativo — com filtro, o
// resumo precisa ser recalculado a partir das respostas filtradas.
function calcularResumoAgregado(residencias, totalEntrevistados) {
  const casasVisitadas = residencias.length;
  const bairrosCobertos = new Set(residencias.map((residencia) => residencia.bairro)).size;
  const datas = residencias.map((residencia) => residencia.dataColeta).filter(Boolean);
  const ultimaColeta = datas.length ? new Date(Math.max(...datas)) : null;

  return {
    totalEntrevistados,
    casasVisitadas,
    bairrosCobertos,
    ultimaColeta: formatarUltimaColeta(ultimaColeta),
  };
}

// Retorna um item por candidato do cargo, mais Indeciso e Branco/Nulo, com o
// percentual sobre o total de respostas filtradas.
function calcularIntencaoVoto(respostas, candidatosCargo, campoVoto) {
  const total = respostas.length;
  const contagem = {};
  respostas.forEach((resposta) => {
    const chave = resposta[campoVoto] ?? 'indeciso';
    contagem[chave] = (contagem[chave] ?? 0) + 1;
  });

  const itensCandidatos = candidatosCargo.map((candidato) => ({
    chave: candidato.id,
    rotulo: candidato.nome,
    isFoco: candidato.isFoco,
    tipo: 'candidato',
    percentual: total ? ((contagem[candidato.id] ?? 0) / total) * 100 : 0,
  }));

  const itensExtras = [
    {
      chave: 'indeciso',
      rotulo: 'Indeciso',
      isFoco: false,
      tipo: 'indeciso',
      percentual: total ? ((contagem.indeciso ?? 0) / total) * 100 : 0,
    },
    {
      chave: 'branco_nulo',
      rotulo: 'Branco/Nulo',
      isFoco: false,
      tipo: 'branco_nulo',
      percentual: total ? ((contagem.branco_nulo ?? 0) / total) * 100 : 0,
    },
  ];

  return [...itensCandidatos, ...itensExtras].sort((a, b) => b.percentual - a.percentual);
}

// Abaixo dessa quantidade de entrevistas, o percentual de um bairro oscila
// demais (1 entrevista vira "100%") e o painel sinaliza "amostra pequena".
const AMOSTRA_MINIMA_BAIRRO = 5;

function desempenhoNoCargo(doBairro, candidatosCargo, campoVoto) {
  const foco = candidatosCargo.find((candidato) => candidato.isFoco);
  if (!foco) return null;

  const total = doBairro.length;
  const percentualDe = (id) => (doBairro.filter((resposta) => resposta[campoVoto] === id).length / total) * 100;
  const percentual = percentualDe(foco.id);
  const maiorPercentual = Math.max(0, ...candidatosCargo.map((candidato) => percentualDe(candidato.id)));

  return { percentual, status: statusFocoPorBairro(percentual, maiorPercentual) };
}

// Uma linha por bairro, com o número de entrevistas e, para cada cargo, o
// percentual do candidato foco e o status dele (lidera/empate/perde) em
// relação aos concorrentes. Bairros com mais entrevistas vêm primeiro.
function calcularDesempenhoPorBairro(respostas, candidatosFederal, candidatosEstadual) {
  const bairros = [...new Set(respostas.map((resposta) => resposta.bairro))];

  return bairros
    .map((bairro) => {
      const doBairro = respostas.filter((resposta) => resposta.bairro === bairro);
      return {
        bairro,
        entrevistas: doBairro.length,
        amostraPequena: doBairro.length < AMOSTRA_MINIMA_BAIRRO,
        federal: desempenhoNoCargo(doBairro, candidatosFederal, 'votoFederal'),
        estadual: desempenhoNoCargo(doBairro, candidatosEstadual, 'votoEstadual'),
      };
    })
    .sort((a, b) => b.entrevistas - a.entrevistas || a.bairro.localeCompare(b.bairro, 'pt-BR'));
}

function calcularEvolucao(respostas, focoFederal, focoEstadual, dias) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const pontos = [];

  for (let i = dias - 1; i >= 0; i -= 1) {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() - i);

    const doDia = respostas.filter((resposta) => {
      if (!resposta.dataColeta) return false;
      const dataResposta = new Date(resposta.dataColeta);
      dataResposta.setHours(0, 0, 0, 0);
      return dataResposta.getTime() === dia.getTime();
    });

    // Dia sem coleta fica sem valor (null), não 0%: senão o gráfico
    // desenharia uma queda que não aconteceu.
    const total = doDia.length;
    pontos.push({
      data: dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      entrevistas: total,
      percentualFederal:
        focoFederal && total
          ? (doDia.filter((resposta) => resposta.votoFederal === focoFederal.id).length / total) * 100
          : null,
      percentualEstadual:
        focoEstadual && total
          ? (doDia.filter((resposta) => resposta.votoEstadual === focoEstadual.id).length / total) * 100
          : null,
    });
  }

  return pontos;
}

export {
  aplicarFiltros,
  intervaloDeDatasInvertido,
  calcularResumo,
  calcularResumoAgregado,
  calcularIntencaoVoto,
  calcularDesempenhoPorBairro,
  AMOSTRA_MINIMA_BAIRRO,
  calcularEvolucao,
};
