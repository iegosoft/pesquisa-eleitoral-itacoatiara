import { useEffect, useMemo, useState } from 'react';
import { contarTotalEntrevistados } from '../../../services/estatisticas.js';
import { useDadosPesquisa } from '../../../hooks/useDadosPesquisa.js';

function useDadosPainel() {
  const { residencias, entrevistados, candidatos } = useDadosPesquisa();
  const [totalEntrevistadosAgregado, setTotalEntrevistadosAgregado] = useState(null);

  useEffect(() => {
    contarTotalEntrevistados().then(setTotalEntrevistadosAgregado);
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
