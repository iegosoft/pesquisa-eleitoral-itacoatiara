# Evidência 2 — Mudança de regulamentação (consentimento + acessibilidade)

Ver `plano-estrategia.md` para o contexto completo. Issue:
[#14](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/14).

## Funcionalidade A — Consentimento do entrevistado

Antes: o formulário de coleta salvava a casa sem nenhum registro de consentimento
do morador. Depois: um campo obrigatório de consentimento, gravado como
`consentimento: true` no documento da residência.

- Vídeo (antes): [`evidencias/regulamentacao/antes/video1-antes-regulamentacao.mp4`](../evidencias/regulamentacao/antes/video1-antes-regulamentacao.mp4)
- Vídeo (depois): [`evidencias/regulamentacao/depois/video2-depois-regulamentacao.mp4`](../evidencias/regulamentacao/depois/video2-depois-regulamentacao.mp4)
- Print do código (antes): [`evidencias/regulamentacao/antes/print-antes-codigo.png`](../evidencias/regulamentacao/antes/print-antes-codigo.png)
- Prints do código (depois): [`evidencias/regulamentacao/depois/print-codigo-consentimento.png`](../evidencias/regulamentacao/depois/print-codigo-consentimento.png)

## Funcionalidade B — Acessibilidade

Antes: o rótulo do campo "Bairro" era um `<span>` solto, sem ligação semântica
real com o campo — confirmado pelo DevTools, sem nome acessível (`Name: ""`).
Depois: um `<label htmlFor>` ligado corretamente ao `<select>` (e, nos campos de
seleção por botão como sexo/faixa etária/voto, um `<fieldset>` com `<legend>`).

- Print do DevTools (antes): [`evidencias/regulamentacao/antes/print-antes-devtools.png`](../evidencias/regulamentacao/antes/print-antes-devtools.png)
- Print do DevTools (depois): [`evidencias/regulamentacao/depois/print-devtools-label.png`](../evidencias/regulamentacao/depois/print-devtools-label.png)
- Print do código (depois): [`evidencias/regulamentacao/depois/print-codigo-label.png`](../evidencias/regulamentacao/depois/print-codigo-label.png)

Também corrigido (não fazia parte do roteiro de vídeo, comprovado por teste
automatizado): contraste de texto insuficiente no mapa de calor do painel
administrativo (branco sobre fundo âmbar/"empate", 2,15:1, e sobre cinza claro/
"sem dados", 1,48:1 — abaixo do mínimo WCAG AA de 4,5:1). Corrigido usando texto
escuro nesses dois status.

## Testes

- `estatisticas` da suíte completa: 15/15 testes passando, incluindo 2 novos —
  `FormularioCasa.test.jsx` (botão "Salvar casa" permanece desabilitado até o
  consentimento ser marcado) e `coresGraficos.test.js` (cor do texto do mapa de
  calor segue a razão de contraste WCAG calculada).

## Commits e Pull Request

- Ver `arquivos-alterados/README.md` para a lista de arquivos alterados.
- Pull Request: [#15](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/15)
