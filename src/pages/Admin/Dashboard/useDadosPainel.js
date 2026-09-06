import { useEffect, useMemo, useState } from 'react';
import {
  contarTotalEntrevistados,
  observarResidencias,
  observarTodosEntrevistados,
} from '../../../services/estatisticas.js';
import { observarCandidatos } from '../../../services/candidatos.js';

function useDadosPainel() {
  const [residencias, setResidencias] = useState([]);
  const [entrevistados, setEntrevistados] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [totalEntrevistadosAgregado, setTotalEntrevistadosAgregado] = useState(null);

  useEffect(() => {
    const cancelarResidencias = observarResidencias(setResidencias);
    const cancelarEntrevistados = observarTodosEntrevistados(setEntrevistados);
    const cancelarCandidatos = observarCandidatos(setCandidatos);
    contarTotalEntrevistados().then(setTotalEntrevistadosAgregado);
    return () => {
      cancelarResidencias();
      cancelarEntrevistados();
      cancelarCandidatos();
    };
  }, []);

  const respostas = useMemo(() => {
    const residenciasPorId = Object.fromEntries(residencias.map((residencia) => [residencia.id, residencia]));
    return entrevistados
      .map((entrevistado) => {
        const residencia = residenciasPorId[entrevistado.residenciaId];
        if (!residencia) return null;
        return {
          ...entrevistado,
          bairro: residencia.bairro,
          dataColeta: residencia.dataColeta,
        };
      })
      .filter(Boolean);
  }, [residencias, entrevistados]);

  const bairrosDisponiveis = useMemo(
    () => [...new Set(residencias.map((residencia) => residencia.bairro))].sort(),
    [residencias],
  );

  return { respostas, residencias, candidatos, bairrosDisponiveis, totalEntrevistadosAgregado };
}

export { useDadosPainel };
