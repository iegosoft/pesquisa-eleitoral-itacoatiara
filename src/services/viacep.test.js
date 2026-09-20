import { afterEach, describe, expect, it, vi } from 'vitest';
import { buscarEnderecoPorCep, cepValido } from './viacep.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

// Regressao da integracao com API externa (TP3): cobre os tres casos reais
// confirmados contra a API do ViaCEP (https://viacep.com.br) antes da
// implementacao — sucesso, CEP bem formatado mas inexistente, e formato
// invalido.
describe('cepValido', () => {
  it('aceita 8 digitos, com ou sem hifen', () => {
    expect(cepValido('69100-863')).toBe(true);
    expect(cepValido('69100863')).toBe(true);
  });

  it('rejeita formatos incompletos', () => {
    expect(cepValido('123')).toBe(false);
    expect(cepValido('')).toBe(false);
  });
});

describe('buscarEnderecoPorCep', () => {
  it('retorna o endereco em caso de sucesso', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          logradouro: 'Rua do Centro',
          bairro: 'Vila Lindóia',
          localidade: 'Itacoatiara',
          uf: 'AM',
        }),
      })),
    );

    const endereco = await buscarEnderecoPorCep('69100-863');
    expect(endereco).toEqual({
      logradouro: 'Rua do Centro',
      bairro: 'Vila Lindóia',
      localidade: 'Itacoatiara',
      uf: 'AM',
    });
  });

  it('lanca erro quando o CEP tem formato valido mas nao existe', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ erro: true }) })),
    );

    await expect(buscarEnderecoPorCep('69100-000')).rejects.toThrow('CEP não encontrado.');
  });

  it('lanca erro sem chamar a API quando o formato do CEP e invalido', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(buscarEnderecoPorCep('123')).rejects.toThrow('CEP inválido');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
