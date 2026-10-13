import { useEffect, useState } from 'react';
import { observarResidencias, observarTodosEntrevistados } from '../services/estatisticas.js';
import { observarCandidatos } from '../services/candidatos.js';

// Os dados da pesquisa em tempo real (residências, entrevistados e
// candidatos), atualizados sozinhos quando algo muda no banco. Usado pelo
// Dashboard e pela tela de Entrevistas.
function useDadosPesquisa() {
  const [residencias, setResidencias] = useState([]);
  const [entrevistados, setEntrevistados] = useState([]);
  const [candidatos, setCandidatos] = useState([]);

  useEffect(() => {
    const cancelarResidencias = observarResidencias(setResidencias);
    const cancelarEntrevistados = observarTodosEntrevistados(setEntrevistados);
    const cancelarCandidatos = observarCandidatos(setCandidatos);
    return () => {
      cancelarResidencias();
      cancelarEntrevistados();
      cancelarCandidatos();
    };
  }, []);

  return { residencias, entrevistados, candidatos };
}

export { useDadosPesquisa };
