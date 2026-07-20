import { collection, doc, serverTimestamp, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

function salvarResidencia({ bairro, pesquisadorId, qtdMoradores, entrevistados, dataColeta }) {
  const lote = writeBatch(db);
  const referenciaResidencia = doc(collection(db, 'residencias'));

  lote.set(referenciaResidencia, {
    bairro,
    pesquisador_id: pesquisadorId,
    qtd_moradores: qtdMoradores,
    // A coleta em campo grava com a data/hora de agora; a inserção em lote
    // retroativa (dados de papel) informa a data real da visita.
    data_coleta: dataColeta ? Timestamp.fromDate(dataColeta) : serverTimestamp(),
  });

  const colecaoEntrevistados = collection(referenciaResidencia, 'entrevistados');
  entrevistados.forEach((entrevistado) => {
    lote.set(doc(colecaoEntrevistados), {
      sexo: entrevistado.sexo,
      faixa_idade: entrevistado.faixaIdade,
      voto_federal: entrevistado.votoFederal,
      voto_estadual: entrevistado.votoEstadual,
    });
  });

  return lote.commit();
}

export { salvarResidencia };
