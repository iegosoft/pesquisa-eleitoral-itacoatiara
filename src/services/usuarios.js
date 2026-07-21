import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

async function buscarUsuario(uid) {
  const referencia = doc(db, 'usuarios', uid);
  const snapshot = await getDoc(referencia);
  return snapshot.exists() ? snapshot.data() : null;
}

async function listarPesquisadores() {
  const consulta = query(collection(db, 'usuarios'), where('role', '==', 'pesquisador'));
  const snapshot = await getDocs(consulta);
  return snapshot.docs.map((documento) => ({ uid: documento.id, ...documento.data() }));
}

export { buscarUsuario, listarPesquisadores };
