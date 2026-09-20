# Evidência 2 — Mudança de regulamentação (consentimento + acessibilidade)

Ver `plano-estrategia.md` para o contexto completo. Issue:
[#14](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/14).

## Funcionalidade A — Consentimento do entrevistado

Antes: o formulário de coleta salvava a casa sem nenhum registro de consentimento
do morador. Depois: um campo obrigatório de consentimento, gravado como
`consentimento: true` no documento da residência.

- Vídeo (antes): [`midias/regulamentacao/antes/tp3-regulamentacao-antes-video.mp4`](../midias/regulamentacao/antes/tp3-regulamentacao-antes-video.mp4)
- Vídeo (depois): [`midias/regulamentacao/depois/tp3-regulamentacao-depois-video.mp4`](../midias/regulamentacao/depois/tp3-regulamentacao-depois-video.mp4)
- Print do código (antes): [`midias/regulamentacao/antes/tp3-regulamentacao-antes-codigo.png`](../midias/regulamentacao/antes/tp3-regulamentacao-antes-codigo.png)
- Prints do código (depois): [`midias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-consentimento.png`](../midias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-consentimento.png)

## Funcionalidade B — Acessibilidade

Antes: o rótulo do campo "Bairro" era um `<span>` solto, sem ligação semântica
real com o campo — confirmado pelo DevTools, sem nome acessível (`Name: ""`).
Depois: um `<label htmlFor>` ligado corretamente ao `<select>` (e, nos campos de
seleção por botão como sexo/faixa etária/voto, um `<fieldset>` com `<legend>`).

- Print do DevTools (antes): [`midias/regulamentacao/antes/tp3-regulamentacao-antes-devtools-span.png`](../midias/regulamentacao/antes/tp3-regulamentacao-antes-devtools-span.png)
- Print do DevTools (depois): [`midias/regulamentacao/depois/tp3-regulamentacao-depois-devtools-label.png`](../midias/regulamentacao/depois/tp3-regulamentacao-depois-devtools-label.png)
- Print do código (depois): [`midias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-label.png`](../midias/regulamentacao/depois/tp3-regulamentacao-depois-codigo-label.png)

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
