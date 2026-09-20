# Evidência 3 — Migração/simulação de API externa (ViaCEP)

Ver `plano-estrategia.md` para o contexto completo. Issue:
[#16](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/16).

## Antes

O sistema não consumia nenhuma API externa (confirmado por busca no código —
nenhum uso de `fetch`/`axios`/`XMLHttpRequest` fora do SDK do Firebase). O
formulário de coleta só tinha o campo "Bairro", selecionado manualmente.

- Vídeo: [`evidencias/api/antes/tp3-api-antes-video.mp4`](../evidencias/api/antes/tp3-api-antes-video.mp4)
- Print: [`evidencias/api/antes/tp3-api-antes-formulario-sem-cep.png`](../evidencias/api/antes/tp3-api-antes-formulario-sem-cep.png)

## Testes no Postman (antes de integrar no sistema)

Testados três cenários reais contra a API pública do ViaCEP
(`https://viacep.com.br`), usando CEPs reais de Itacoatiara-AM:

| CEP | Resultado | Evidência |
|---|---|---|
| `69100200` | Sucesso — bairro "Centenário" (já cadastrado no sistema) | [`postman/tp3-api-postman-sucesso-centenario.png`](../evidencias/api/postman/tp3-api-postman-sucesso-centenario.png) |
| `69100863` | Sucesso na API, mas bairro "Vila Lindóia" não está na lista do sistema | [`postman/tp3-api-postman-mismatch-vila-lindoia.png`](../evidencias/api/postman/tp3-api-postman-mismatch-vila-lindoia.png) |
| `69100000` | CEP bem formatado, mas inexistente (`{"erro": true}`) | [`postman/tp3-api-postman-nao-encontrado.png`](../evidencias/api/postman/tp3-api-postman-nao-encontrado.png) |

## Depois

Novo campo de CEP, opcional, no formulário de coleta (`src/services/viacep.js`
+ `FormularioCasa.jsx`). Busca o endereço no ViaCEP e tenta preencher o bairro
automaticamente — só quando o bairro devolvido já está na lista cadastrada no
sistema. Caso contrário, avisa o pesquisador e mantém a seleção manual
disponível, sem nunca preencher errado.

- Vídeo: [`evidencias/api/depois/tp3-api-depois-video.mp4`](../evidencias/api/depois/tp3-api-depois-video.mp4)
- Print (CEP com bairro reconhecido): [`depois/tp3-api-depois-sistema-sucesso-centenario.png`](../evidencias/api/depois/tp3-api-depois-sistema-sucesso-centenario.png)
- Print (CEP com bairro fora da lista): [`depois/tp3-api-depois-sistema-mismatch-vila-lindoia.png`](../evidencias/api/depois/tp3-api-depois-sistema-mismatch-vila-lindoia.png)
- Print (CEP inexistente): [`depois/tp3-api-depois-sistema-nao-encontrado.png`](../evidencias/api/depois/tp3-api-depois-sistema-nao-encontrado.png)

## Testes

5 novos testes automatizados (`src/services/viacep.test.js`), cobrindo sucesso,
CEP válido mas inexistente, e formato inválido (sem sequer chamar a API nesse
último caso). Suíte completa: 20/20 testes passando.

## Commits e Pull Request

- Ver `arquivos-alterados/README.md` para a lista de arquivos alterados.
- Pull Request: [#17](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/17)
