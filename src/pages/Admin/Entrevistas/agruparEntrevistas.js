// Junta residências e entrevistados numa lista de casas, cada uma com seus
// moradores, já com os nomes legíveis (pesquisador e votos), aplicando os
// filtros da tela. Casas mais recentes primeiro.
function agruparEntrevistas({ residencias, entrevistados, nomeDoPesquisador, filtros }) {
  const moradoresPorCasa = new Map();
  entrevistados.forEach((entrevistado) => {
    const lista = moradoresPorCasa.get(entrevistado.residenciaId) ?? [];
    lista.push(entrevistado);
    moradoresPorCasa.set(entrevistado.residenciaId, lista);
  });

  return residencias
    .filter((casa) => filtros.bairro === 'todos' || casa.bairro === filtros.bairro)
    .filter((casa) => filtros.pesquisador === 'todos' || casa.pesquisadorId === filtros.pesquisador)
    .map((casa) => ({
      ...casa,
      pesquisador: nomeDoPesquisador(casa.pesquisadorId),
      moradores: moradoresPorCasa.get(casa.id) ?? [],
    }))
    .filter((casa) => casa.moradores.length > 0)
    .sort((a, b) => (b.dataColeta?.getTime() ?? 0) - (a.dataColeta?.getTime() ?? 0));
}

export { agruparEntrevistas };
