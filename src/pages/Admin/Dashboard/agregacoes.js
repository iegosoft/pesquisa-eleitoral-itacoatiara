import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FAIXAS_ETARIAS, SEXOS, VOTO_INDECISO, VOTOS_NEUTROS } from '../../../dominio/opcoes.js';
import { statusFoco } from './coresGraficos.js';

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

// Valem tanto para respostas quanto para residências: as duas listas têm
// `bairro` e `dataColeta`.
function contarBairros(registros) {
  return new Set(registros.map((registro) => registro.bairro)).size;
}

function ultimaColetaFormatada(registros) {
  const datas = registros.map((registro) => registro.dataColeta).filter(Boolean);
  return formatarUltimaColeta(datas.length ? new Date(Math.max(...datas)) : null);
}

function calcularResumo(respostas) {
  return {
    totalEntrevistados: respostas.length,
    casasVisitadas: new Set(respostas.map((resposta) => resposta.residenciaId)).size,
    bairrosCobertos: contarBairros(respostas),
    ultimaColeta: ultimaColetaFormatada(respostas),
  };
}

// Mesmo resultado de calcularResumo, mas sem depender da lista completa de
// entrevistados: casas/bairros/ultima coleta vem das residencias (ja
// carregadas para o filtro de bairro) e o total vem de uma contagem agregada.
// Só é valido quando nenhum filtro detalhado esta ativo — com filtro, o
// resumo precisa ser recalculado a partir das respostas filtradas.
function calcularResumoAgregado(residencias, totalEntrevistados) {
  return {
    totalEntrevistados,
    casasVisitadas: residencias.length,
    bairrosCobertos: contarBairros(residencias),
    ultimaColeta: ultimaColetaFormatada(residencias),
  };
}

function percentualDoTotal(quantidade, total) {
  return total ? (quantidade / total) * 100 : 0;
}

// Retorna um item por candidato do cargo, mais Indeciso e Branco/Nulo, com o
// percentual sobre o total de respostas filtradas.
function calcularIntencaoVoto(respostas, candidatosCargo, campoVoto) {
  const total = respostas.length;
  const contagem = {};
  respostas.forEach((resposta) => {
    const chave = resposta[campoVoto] ?? VOTO_INDECISO;
    contagem[chave] = (contagem[chave] ?? 0) + 1;
  });

  const itensCandidatos = candidatosCargo.map((candidato) => ({
    chave: candidato.id,
    rotulo: candidato.nome,
    partido: candidato.partido ?? '',
    fotoUrl: candidato.fotoUrl ?? '',
    cargo: candidato.cargo,
    isFoco: candidato.isFoco,
    tipo: 'candidato',
    quantidade: contagem[candidato.id] ?? 0,
    percentual: percentualDoTotal(contagem[candidato.id] ?? 0, total),
  }));

  const itensExtras = VOTOS_NEUTROS.map(({ valor, rotulo }) => ({
    chave: valor,
    rotulo,
    isFoco: false,
    tipo: valor,
    quantidade: contagem[valor] ?? 0,
    percentual: percentualDoTotal(contagem[valor] ?? 0, total),
  }));

  return [...itensCandidatos, ...itensExtras].sort((a, b) => b.percentual - a.percentual);
}

// Resposta direta à pergunta do painel ("como está o nosso candidato?") a
// partir dos itens de calcularIntencaoVoto: posição entre os candidatos,
// status e a diferença em pontos para o adversário que importa (o segundo
// colocado, se o foco lidera; o líder, se não lidera).
function calcularResultadoFoco(itens) {
  const candidatos = itens.filter((item) => item.tipo === 'candidato');
  const foco = candidatos.find((item) => item.isFoco);
  if (!foco) return null;

  const outros = candidatos.filter((item) => !item.isFoco);
  const melhorOutro = outros.reduce((melhor, item) => (!melhor || item.percentual > melhor.percentual ? item : melhor), null);
  const maiorPercentual = Math.max(0, ...candidatos.map((item) => item.percentual));
  const empatadoNoTopo = Boolean(melhorOutro) && maiorPercentual > 0 && melhorOutro.percentual === foco.percentual;

  return {
    nome: foco.rotulo,
    partido: foco.partido,
    fotoUrl: foco.fotoUrl,
    cargo: foco.cargo,
    percentual: foco.percentual,
    posicao: 1 + candidatos.filter((item) => item.percentual > foco.percentual).length,
    totalCandidatos: candidatos.length,
    status: empatadoNoTopo ? 'empate' : statusFoco(foco.percentual, maiorPercentual),
    adversario: melhorOutro?.rotulo ?? null,
    diferenca: melhorOutro ? foco.percentual - melhorOutro.percentual : null,
  };
}

// Onde um candidato é forte e onde é fraco: para cada bairro, quantos votos
// ele teve e o percentual sobre as entrevistas do bairro. Do maior para o menor
// percentual; no empate, o bairro com mais entrevistas primeiro.
function calcularCandidatoPorBairro(respostas, candidatoId, campoVoto) {
  const bairros = [...new Set(respostas.map((resposta) => resposta.bairro))];

  return bairros
    .map((bairro) => {
      const doBairro = respostas.filter((resposta) => resposta.bairro === bairro);
      const votos = doBairro.filter((resposta) => resposta[campoVoto] === candidatoId).length;
      return {
        bairro,
        entrevistas: doBairro.length,
        votos,
        percentual: (votos / doBairro.length) * 100,
        amostraPequena: doBairro.length < AMOSTRA_MINIMA_BAIRRO,
      };
    })
    .sort((a, b) => b.percentual - a.percentual || b.entrevistas - a.entrevistas);
}

const OPCOES_SEXO = SEXOS.map(({ valor, rotulo }) => ({ chave: valor, rotulo }));
const OPCOES_FAIXA_IDADE = FAIXAS_ETARIAS.map(({ valor, rotuloExtenso }) => ({ chave: valor, rotulo: rotuloExtenso }));

function distribuicao(respostas, campo, opcoes) {
  const total = respostas.length;
  return opcoes.map(({ chave, rotulo }) => {
    const quantidade = respostas.filter((resposta) => resposta[campo] === chave).length;
    return { chave, rotulo, quantidade, percentual: total ? (quantidade / total) * 100 : 0 };
  });
}

// Quem foi entrevistado: sem isso não dá para saber se um resultado reflete
// a cidade ou só um grupo (por exemplo, só homens acima de 60 anos).
function calcularPerfil(respostas) {
  return {
    total: respostas.length,
    sexo: distribuicao(respostas, 'sexo', OPCOES_SEXO),
    faixaIdade: distribuicao(respostas, 'faixaIdade', OPCOES_FAIXA_IDADE),
  };
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

  return { percentual, status: statusFoco(percentual, maiorPercentual) };
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
  calcularCandidatoPorBairro,
  calcularResultadoFoco,
  calcularPerfil,
  AMOSTRA_MINIMA_BAIRRO,
  calcularEvolucao,
};
