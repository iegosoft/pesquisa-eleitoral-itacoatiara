import { describe, expect, it } from 'vitest';
import { calcularResumo, calcularResumoAgregado } from './agregacoes.js';

describe('calcularResumoAgregado', () => {
  it('deriva casas visitadas e bairros cobertos das residencias, sem depender da lista de entrevistados', () => {
    const residencias = [
      { id: '1', bairro: 'Centro', dataColeta: new Date('2026-01-01') },
      { id: '2', bairro: 'Centro', dataColeta: new Date('2026-01-02') },
      { id: '3', bairro: 'Aparecida', dataColeta: new Date('2026-01-03') },
    ];

    const resumo = calcularResumoAgregado(residencias, 50);

    expect(resumo.totalEntrevistados).toBe(50);
    expect(resumo.casasVisitadas).toBe(3);
    expect(resumo.bairrosCobertos).toBe(2);
  });

  it('retorna "—" quando nao ha nenhuma coleta registrada', () => {
    const resumo = calcularResumoAgregado([], 0);
    expect(resumo.ultimaColeta).toBe('—');
  });

  it('bate com calcularResumo quando aplicado aos mesmos dados (sem filtro)', () => {
    const residencias = [
      { id: '1', bairro: 'Centro', dataColeta: new Date('2026-01-05') },
      { id: '2', bairro: 'Aparecida', dataColeta: new Date('2026-01-06') },
    ];
    const respostas = [
      { residenciaId: '1', bairro: 'Centro', dataColeta: new Date('2026-01-05') },
      { residenciaId: '1', bairro: 'Centro', dataColeta: new Date('2026-01-05') },
      { residenciaId: '2', bairro: 'Aparecida', dataColeta: new Date('2026-01-06') },
    ];

    const resumoAntigo = calcularResumo(respostas);
    const resumoNovo = calcularResumoAgregado(residencias, respostas.length);

    expect(resumoNovo).toEqual(resumoAntigo);
  });
});
