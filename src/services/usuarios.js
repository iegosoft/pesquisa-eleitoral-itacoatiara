import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

async function buscarUsuario(uid) {
  const referencia = doc(db, 'usuarios', uid);
  const snapshot = await getDoc(referencia);
  return snapshot.exists() ? snapshot.data() : null;
}

export { buscarUsuario };
