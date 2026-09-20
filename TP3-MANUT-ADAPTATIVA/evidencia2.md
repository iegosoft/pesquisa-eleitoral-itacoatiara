# Evidência 2 — Mudança de regulamentação (consentimento + acessibilidade)

Ver `plano-estrategia.md` para o contexto completo. Issue:
[#14](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/14).

## Funcionalidade A — Consentimento do entrevistado

Antes: o formulário de coleta salvava a casa sem nenhum registro de consentimento
do morador. Depois: um campo obrigatório de consentimento, gravado como
`consentimento: true` no documento da residência.

- Vídeo (antes): [`evidencias/regulamentacao/antes/tp3-regulamentacao-antes-video.mp4`](../evidencias/regulamentacao/antes/tp3-regulamentacao-antes-video.mp4)
- Vídeo (depois): [`evidencias/regulamentacao/depois/tp3-regulamentacao-depois-video.mp4`](../evidencias/regulamentacao/depois/tp3-regulamentacao-depois-video.mp4)
- Print do código (antes): [`evidencias/regulamentacao/antes/tp3-regulamentacao-antes-codigo.png`](../evidencias/regulamentacao/antes/tp3-regulamentacao-antes-codigo.png)
- Prints do código (depois): [`evidencias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-consentimento.png`](../evidencias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-consentimento.png)

## Funcionalidade B — Acessibilidade

Antes: o rótulo do campo "Bairro" era um `<span>` solto, sem ligação semântica
real com o campo — confirmado pelo DevTools, sem nome acessível (`Name: ""`).
Depois: um `<label htmlFor>` ligado corretamente ao `<select>` (e, nos campos de
seleção por botão como sexo/faixa etária/voto, um `<fieldset>` com `<legend>`).

- Print do DevTools (antes): [`evidencias/regulamentacao/antes/tp3-regulamentacao-antes-devtools-span.png`](../evidencias/regulamentacao/antes/tp3-regulamentacao-antes-devtools-span.png)
- Print do DevTools (depois): [`evidencias/regulamentacao/depois/tp3-regulamentacao-depois-devtools-label.png`](../evidencias/regulamentacao/depois/tp3-regulamentacao-depois-devtools-label.png)
- Print do código (depois): [`evidencias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-label.png`](../evidencias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-label.png)

Também corrigido (não fazia parte do roteiro de vídeo, comprovado por teste
automatizado): contraste de texto insuficiente no mapa de calor do painel
administrativo (branco sobre fundo âmbar/"empate", 2,15:1, e sobre cinza claro/
"sem dados", 1,48:1 — abaixo do mínimo WCAG AA de 4,5:1). Corrigido usando texto
escuro nesses dois status.

## Base legal simulada

- **Consentimento**: art. 7º, inciso I, e art. 8º da Lei 13.709/2018 (LGPD) —
  tratamento de dado pessoal mediante consentimento do titular, que deve ser
  fornecido de forma livre, informada e inequívoca. É por isso que o texto do
  checkbox descreve, em linguagem simples, para que o dado será usado
  ("de forma anônima e apenas para fins estatísticos") antes de ser aceito.
- **Acessibilidade**: Lei Brasileira de Inclusão (Lei 13.146/2015), art. 63,
  c/c as diretrizes de acessibilidade web WCAG 2.1 nível AA (contraste mínimo
  de 4,5:1 e nomes acessíveis para campos de formulário) — usadas aqui como
  critério técnico objetivo para os dois problemas corrigidos.

## Testes

- `estatisticas` da suíte completa: 15/15 testes passando, incluindo 2 novos —
  `FormularioCasa.test.jsx` (botão "Salvar casa" permanece desabilitado até o
  consentimento ser marcado) e `coresGraficos.test.js` (cor do texto do mapa de
  calor segue a razão de contraste WCAG calculada).

## Commits e Pull Request

- Ver `arquivos-alterados/README.md` para a lista de arquivos alterados.
- Pull Request: [#15](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/15)
