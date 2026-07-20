import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

function entrar(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

function sair() {
  return signOut(auth);
}

function observarUsuarioAutenticado(callback) {
  return onAuthStateChanged(auth, callback);
}

export { entrar, sair, observarUsuarioAutenticado };
