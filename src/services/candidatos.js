import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';

const colecaoCandidatos = collection(db, 'candidatos');

function paraCandidato(documentoSnapshot) {
  const dados = documentoSnapshot.data();
  return {
    id: documentoSnapshot.id,
    nome: dados.nome,
    partido: dados.partido,
    cargo: dados.cargo,
    fotoUrl: dados.foto_url ?? '',
    isFoco: Boolean(dados.is_foco),
  };
}

function observarCandidatos(callback) {
  return onSnapshot(colecaoCandidatos, (snapshot) => {
    callback(snapshot.docs.map(paraCandidato));
  });
}

function observarCandidatosPorCargo(cargo, callback) {
  const consulta = query(colecaoCandidatos, where('cargo', '==', cargo));
  return onSnapshot(consulta, (snapshot) => {
    callback(snapshot.docs.map(paraCandidato));
  });
}

function criarCandidato({ nome, partido, cargo, fotoUrl, isFoco }) {
  return addDoc(colecaoCandidatos, {
    nome,
    partido,
    cargo,
    foto_url: fotoUrl ?? '',
    is_foco: Boolean(isFoco),
  });
}

function atualizarCandidato(id, { nome, partido, cargo, fotoUrl, isFoco }) {
  return updateDoc(doc(db, 'candidatos', id), {
    nome,
    partido,
    cargo,
    foto_url: fotoUrl ?? '',
    is_foco: Boolean(isFoco),
  });
}

export { observarCandidatos, observarCandidatosPorCargo, criarCandidato, atualizarCandidato };
