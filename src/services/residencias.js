import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

function salvarResidencia({ bairro, pesquisadorId, qtdMoradores, entrevistados }) {
  const lote = writeBatch(db);
  const referenciaResidencia = doc(collection(db, 'residencias'));

  lote.set(referenciaResidencia, {
    bairro,
    pesquisador_id: pesquisadorId,
    qtd_moradores: qtdMoradores,
    data_coleta: serverTimestamp(),
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
