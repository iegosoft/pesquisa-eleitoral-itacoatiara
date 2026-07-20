import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
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

// Só pode existir um candidato foco por cargo (é ele que fica destacado nos
// gráficos do painel). Ao marcar um novo, desmarca automaticamente o
// anterior do mesmo cargo.
async function garantirFocoUnico(cargo, idCandidatoFoco) {
  const consulta = query(colecaoCandidatos, where('cargo', '==', cargo), where('is_foco', '==', true));
  const snapshot = await getDocs(consulta);
  const outrosFocos = snapshot.docs.filter((documento) => documento.id !== idCandidatoFoco);

  if (outrosFocos.length === 0) {
    return;
  }

  const lote = writeBatch(db);
  outrosFocos.forEach((documento) => lote.update(documento.ref, { is_foco: false }));
  await lote.commit();
}

async function criarCandidato({ nome, partido, cargo, fotoUrl, isFoco }) {
  const referencia = await addDoc(colecaoCandidatos, {
    nome,
    partido,
    cargo,
    foto_url: fotoUrl ?? '',
    is_foco: Boolean(isFoco),
  });

  if (isFoco) {
    await garantirFocoUnico(cargo, referencia.id);
  }

  return referencia;
}

async function atualizarCandidato(id, { nome, partido, cargo, fotoUrl, isFoco }) {
  await updateDoc(doc(db, 'candidatos', id), {
    nome,
    partido,
    cargo,
    foto_url: fotoUrl ?? '',
    is_foco: Boolean(isFoco),
  });

  if (isFoco) {
    await garantirFocoUnico(cargo, id);
  }
}

export { observarCandidatos, observarCandidatosPorCargo, criarCandidato, atualizarCandidato };
