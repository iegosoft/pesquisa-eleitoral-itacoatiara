import { describe, expect, it } from 'vitest';
import {
  calcularDesempenhoPorBairro,
  calcularEvolucao,
  calcularResumo,
  calcularResumoAgregado,
  calcularResultadoFoco,
} from './agregacoes.js';

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

const FOCO_FED = { id: 'f1', isFoco: true };
const OUTRO_FED = { id: 'f2', isFoco: false };
const FOCO_EST = { id: 'e1', isFoco: true };

function resposta(bairro, votoFederal, votoEstadual = 'indeciso', dataColeta = null) {
  return { bairro, votoFederal, votoEstadual, dataColeta };
}

describe('calcularDesempenhoPorBairro', () => {
  it('traz o numero de entrevistas, o percentual e o status do foco em cada cargo', () => {
    const respostas = [
      ...Array.from({ length: 4 }, () => resposta('Centro', 'f1', 'e1')),
      resposta('Centro', 'f2', 'e1'),
      resposta('Iracy', 'f2'),
    ];

    const [centro, iracy] = calcularDesempenhoPorBairro(respostas, [FOCO_FED, OUTRO_FED], [FOCO_EST]);

    expect(centro).toMatchObject({ bairro: 'Centro', entrevistas: 5, amostraPequena: false });
    expect(centro.federal).toEqual({ percentual: 80, status: 'lidera' });
    expect(centro.estadual).toEqual({ percentual: 100, status: 'lidera' });
    expect(iracy).toMatchObject({ bairro: 'Iracy', entrevistas: 1, amostraPequena: true });
    expect(iracy.federal).toEqual({ percentual: 0, status: 'perde' });
    expect(iracy.estadual).toEqual({ percentual: 0, status: 'sem_dados' });
  });

  it('ordena pelos bairros com mais entrevistas', () => {
    const respostas = [resposta('Aleixo', 'f1'), resposta('Zona', 'f1'), resposta('Zona', 'f1')];

    expect(calcularDesempenhoPorBairro(respostas, [FOCO_FED], []).map((l) => l.bairro)).toEqual(['Zona', 'Aleixo']);
  });

  it('devolve null no cargo sem candidato foco', () => {
    const [linha] = calcularDesempenhoPorBairro([resposta('Centro', 'f2')], [OUTRO_FED], []);

    expect(linha.federal).toBeNull();
    expect(linha.estadual).toBeNull();
  });
});

describe('calcularEvolucao', () => {
  it('deixa vazio (null) o dia sem coleta, em vez de 0%', () => {
    const hoje = new Date();
    const pontos = calcularEvolucao([resposta('Centro', 'f1', 'e1', hoje.getTime())], FOCO_FED, FOCO_EST, 7);

    expect(pontos).toHaveLength(7);
    expect(pontos[6]).toMatchObject({ entrevistas: 1, percentualFederal: 100, percentualEstadual: 100 });
    expect(pontos[0]).toMatchObject({ entrevistas: 0, percentualFederal: null, percentualEstadual: null });
  });
});

function item(rotulo, percentual, isFoco = false, tipo = 'candidato') {
  return { chave: rotulo, rotulo, percentual, isFoco, tipo };
}

describe('calcularResultadoFoco', () => {
  it('quando o foco lidera, compara com o segundo colocado', () => {
    const resultado = calcularResultadoFoco([
      item('Sidney', 57.9, true),
      item('Josias', 26.3),
      item('Indeciso', 10, false, 'indeciso'),
    ]);

    expect(resultado).toMatchObject({ nome: 'Sidney', posicao: 1, totalCandidatos: 2, status: 'lidera', adversario: 'Josias' });
    expect(resultado.diferenca).toBeCloseTo(31.6);
  });

  it('quando o foco perde, compara com quem lidera', () => {
    const resultado = calcularResultadoFoco([item('Ana', 50), item('Bia', 30), item('Foco', 20, true)]);

    expect(resultado).toMatchObject({ posicao: 3, status: 'perde', adversario: 'Ana', diferenca: -30 });
  });

  it('empate exato na lideranca vira empate, nao lideranca', () => {
    expect(calcularResultadoFoco([item('Ana', 40), item('Foco', 40, true)]).status).toBe('empate');
  });

  it('devolve null sem candidato foco', () => {
    expect(calcularResultadoFoco([item('Ana', 40)])).toBeNull();
  });
});
