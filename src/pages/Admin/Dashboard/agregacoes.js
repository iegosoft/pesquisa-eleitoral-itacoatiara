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

function formatarUltimaColeta(data) {
  if (!data) return '—';

  const ehMesmoDia = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const hoje = new Date();
  if (ehMesmoDia(data, hoje)) return 'Hoje';

  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);
  if (ehMesmoDia(data, ontem)) return 'Ontem';

  return data.toLocaleDateString('pt-BR');
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

// Retorna um item por candidato do cargo, mais Indeciso e Branco/Nulo, com o
// percentual sobre o total de respostas filtradas. "indiceConcorrente" é a
// posição estável do candidato (não-foco) na lista, usada só pra escolher o
// tom de cinza — não muda conforme o resultado da votação.
function calcularIntencaoVoto(respostas, candidatosCargo, campoVoto) {
  const total = respostas.length;
  const contagem = {};
  respostas.forEach((resposta) => {
    const chave = resposta[campoVoto] ?? 'indeciso';
    contagem[chave] = (contagem[chave] ?? 0) + 1;
  });

  let indiceConcorrente = 0;
  const itensCandidatos = candidatosCargo.map((candidato) => {
    const item = {
      chave: candidato.id,
      rotulo: candidato.nome,
      isFoco: candidato.isFoco,
      tipo: 'candidato',
      indiceConcorrente: candidato.isFoco ? null : indiceConcorrente,
      percentual: total ? ((contagem[candidato.id] ?? 0) / total) * 100 : 0,
    };
    if (!candidato.isFoco) indiceConcorrente += 1;
    return item;
  });

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

function calcularPorBairro(respostas, focoFederal, focoEstadual) {
  const bairros = [...new Set(respostas.map((resposta) => resposta.bairro))].sort();

  return bairros.map((bairro) => {
    const doBairro = respostas.filter((resposta) => resposta.bairro === bairro);
    const total = doBairro.length;
    const percentualFederal =
      focoFederal && total
        ? (doBairro.filter((resposta) => resposta.votoFederal === focoFederal.id).length / total) * 100
        : 0;
    const percentualEstadual =
      focoEstadual && total
        ? (doBairro.filter((resposta) => resposta.votoEstadual === focoEstadual.id).length / total) * 100
        : 0;
    return { bairro, percentualFederal, percentualEstadual };
  });
}

function calcularMapaCalor(respostas, candidatosCargo, campoVoto) {
  const bairros = [...new Set(respostas.map((resposta) => resposta.bairro))].sort();

  const linhas = candidatosCargo.map((candidato) => {
    const valoresPorBairro = bairros.map((bairro) => {
      const doBairro = respostas.filter((resposta) => resposta.bairro === bairro);
      const total = doBairro.length;
      const percentual = total
        ? (doBairro.filter((resposta) => resposta[campoVoto] === candidato.id).length / total) * 100
        : 0;
      return { bairro, percentual };
    });
    return { candidato, valoresPorBairro };
  });

  return { bairros, linhas };
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

    const total = doDia.length;
    pontos.push({
      data: dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      percentualFederal:
        focoFederal && total
          ? (doDia.filter((resposta) => resposta.votoFederal === focoFederal.id).length / total) * 100
          : 0,
      percentualEstadual:
        focoEstadual && total
          ? (doDia.filter((resposta) => resposta.votoEstadual === focoEstadual.id).length / total) * 100
          : 0,
    });
  }

  return pontos;
}

export {
  aplicarFiltros,
  calcularResumo,
  calcularIntencaoVoto,
  calcularPorBairro,
  calcularMapaCalor,
  calcularEvolucao,
};
