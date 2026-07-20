import { collection, collectionGroup, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function paraResidencia(documentoSnapshot) {
  const dados = documentoSnapshot.data();
  return {
    id: documentoSnapshot.id,
    bairro: dados.bairro,
    dataColeta: dados.data_coleta ? dados.data_coleta.toDate() : null,
    pesquisadorId: dados.pesquisador_id,
    qtdMoradores: dados.qtd_moradores,
  };
}

function paraEntrevistado(documentoSnapshot) {
  const dados = documentoSnapshot.data();
  return {
    id: documentoSnapshot.id,
    residenciaId: documentoSnapshot.ref.parent.parent.id,
    sexo: dados.sexo,
    faixaIdade: dados.faixa_idade,
    votoFederal: dados.voto_federal,
    votoEstadual: dados.voto_estadual,
  };
}

function observarResidencias(callback) {
  return onSnapshot(collection(db, 'residencias'), (snapshot) => {
    callback(snapshot.docs.map(paraResidencia));
  });
}

function observarTodosEntrevistados(callback) {
  return onSnapshot(collectionGroup(db, 'entrevistados'), (snapshot) => {
    callback(snapshot.docs.map(paraEntrevistado));
  });
}

export { observarResidencias, observarTodosEntrevistados };
