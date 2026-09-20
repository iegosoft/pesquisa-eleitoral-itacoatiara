// Integração com o ViaCEP (https://viacep.com.br) — API pública usada para
// preencher o bairro automaticamente a partir do CEP no cadastro de
// residência. O sistema não consumia nenhuma API externa antes desta
// manutenção adaptativa (Estratégia 3, migração/integração de API externa).

function limparCep(cep) {
  return cep.replace(/\D/g, '');
}

function cepValido(cep) {
  return /^\d{8}$/.test(limparCep(cep));
}

// Retorna { logradouro, bairro, localidade, uf } em caso de sucesso, ou
// lanca um erro com uma mensagem adequada para exibir ao pesquisador.
async function buscarEnderecoPorCep(cep) {
  const cepLimpo = limparCep(cep);
  if (!cepValido(cepLimpo)) {
    throw new Error('CEP inválido. Digite os 8 números do CEP.');
  }

  let resposta;
  try {
    resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  } catch {
    throw new Error('Não foi possível consultar o CEP agora. Verifique sua conexão.');
  }

  if (!resposta.ok) {
    throw new Error('Não foi possível consultar o CEP agora. Tente novamente.');
  }

  const dados = await resposta.json();
  if (dados.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    logradouro: dados.logradouro,
    bairro: dados.bairro,
    localidade: dados.localidade,
    uf: dados.uf,
  };
}

export { buscarEnderecoPorCep, cepValido };
