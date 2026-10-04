import { deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

function referenciaEntrevistado(residenciaId, entrevistadoId) {
  return doc(db, 'residencias', residenciaId, 'entrevistados', entrevistadoId);
}

function atualizarEntrevistado(residenciaId, entrevistadoId, { sexo, faixaIdade, votoFederal, votoEstadual }) {
  return updateDoc(referenciaEntrevistado(residenciaId, entrevistadoId), {
    sexo,
    faixa_idade: faixaIdade,
    voto_federal: votoFederal,
    voto_estadual: votoEstadual,
  });
}

// O Firestore não apaga subcoleções junto com o documento pai: a casa só é
// excluída de verdade apagando cada entrevistado e a residência no mesmo lote.
function excluirCasa(residenciaId, entrevistadoIds) {
  const lote = writeBatch(db);
  entrevistadoIds.forEach((id) => lote.delete(referenciaEntrevistado(residenciaId, id)));
  lote.delete(doc(db, 'residencias', residenciaId));
  return lote.commit();
}

// Se for o último morador da casa, a casa vai junto: uma casa sem nenhum
// entrevistado continuaria contando em "Casas visitadas".
function excluirEntrevistado(residenciaId, entrevistadoId, { ultimoDaCasa }) {
  if (ultimoDaCasa) return excluirCasa(residenciaId, [entrevistadoId]);
  return deleteDoc(referenciaEntrevistado(residenciaId, entrevistadoId));
}

export { atualizarEntrevistado, excluirEntrevistado, excluirCasa };
