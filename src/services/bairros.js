import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const referenciaBairros = doc(db, 'configuracoes', 'bairros');

function observarBairros(callback) {
  return onSnapshot(referenciaBairros, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.data().lista ?? []) : []);
  });
}

export { observarBairros };
