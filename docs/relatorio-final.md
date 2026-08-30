# Relatório Final — Manutenção Corretiva

## Sobre o sistema

O **Pesquisa Eleitoral Itacoatiara** é uma aplicação web (PWA) para coleta e análise de intenção de
voto em pesquisas eleitorais de rua no município de Itacoatiara-AM, cobrindo as eleições de deputado
federal e deputado estadual em paralelo. Tem dois perfis de uso isolados por papel: **Pesquisador**
(`/coleta`, coleta casa a casa, sem números agregados) e **Administrador** (`/admin`, dashboard
analítico, cadastro de candidatos, importação/exportação de dados). Detalhes completos em
[`docs/apresentacao-sistema.md`](apresentacao-sistema.md) e [`docs/descricao-sistema.md`](descricao-sistema.md).

## Ferramentas de apoio usadas

- **Dependabot** (obrigatório) — ativado em Settings → Security → Code security and analysis. Alertou
  a vulnerabilidade do `uuid` que virou o Bug 3.
- **`npm audit`** — usado localmente para confirmar o alerta do Dependabot antes de virar issue.

## Os 3 bugs

| # | Bug | Tipo | Severidade | Issue | Encontrado via |
|---|---|---|---|---|---|
| 1 | Nome de candidato longo corta o texto e o selo FOCO no gráfico do Dashboard | Lógico (defeito visual) | Alta | [#4](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/4) | Revisão manual de código + verificação visual com harness isolado do componente |
| 2 | Login trava em "Entrando..." sem erro se o usuário não tem perfil no Firestore | Lógico / Runtime | Alta | [#2](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/2) | Revisão manual de código |
| 3 | Dependência vulnerável: `uuid` (via `exceljs`) — CVE-2026-41907 | Dependência vulnerável | Média | [#3](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/3) | **Dependabot** (alerta nº 1) + `npm audit` |

Classificação e justificativas completas, incluindo os alertas do Dependabot avaliados e descartados
como não aplicáveis, em [`docs/bugs-e-classificacao.md`](bugs-e-classificacao.md).

## Correções

| Bug | Branch | PR de correção | Commit | Teste automatizado |
|---|---|---|---|---|
| #4 — nome cortado | `fix/nome-candidato-cortado-grafico` | [PR #6](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/6) | `4b113eb` | `truncarRotulo.test.js` (4 casos) |
| #2 — login travado | `fix/login-trava-sem-role` | [PR #5](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/5) | `7fc9ff1` | `PaginaLogin.test.jsx` (3 casos) |
| #3 — dependência uuid | `fix/dependencia-uuid-vulneravel` + `test/regressao-uuid-vulneravel` | [PR #7](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/7) e [PR #8](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/8) | `83408ac` + `f967237` | `dependencias.test.js` |

Todos os PRs foram revisados e aprovados por **José André (Choze)**, que não é o autor de nenhum
deles, antes do merge — conforme a regra de "ninguém aprova o próprio PR".

## Evidências de validação

- **Issue #2**: vídeo/prints do "antes" (botão travado em "Entrando...", sem erro) anexados como
  comentário. Teste `PaginaLogin.test.jsx` falha no código original e passa com a correção (verificado
  localmente antes de abrir o PR).
- **Issue #4**: print do "antes" (nome e selo FOCO cortados) anexado como comentário. Confirmado
  visualmente, com harness isolado do componente real, que a correção resolve o corte.
- **Issue #3**: print do alerta do Dependabot (nº 1) anexado como comentário, antes da correção. Bug
  sem manifestação visual em tela — evidência complementar é o `npm audit` limpo e o `dependencias.test.js`
  confirmando que o `uuid` resolvido fica fora da faixa vulnerável.

## Responsáveis

| Pessoa | Responsabilidade |
|---|---|
| Choze (`joseandrevianajunior`) | `docs/apresentacao-sistema.md`, `.github/ISSUE_TEMPLATE/bug_report.md`, revisor e aprovador dos 4 PRs de correção |
| Luiz (`ghostsuki`) | `docs/bugs-e-classificacao.md` |
| Luan (`luanzito21`) | Ativação do Dependabot, dono da triagem da issue #3 |
| Karina Lopes (`Karina-lopes`) | Dona da triagem da issue #2 |
| Iêgo (`iegosoft`) | Coordenação geral, evidências, aplicação das 3 correções (ver nota de retrabalho abaixo), este relatório |

## Retrabalho

- **Issue #1** foi aberta originalmente para um suposto bug no filtro de data do Dashboard. Ao reler o
  código que chama `aplicarFiltros`, a equipe percebeu que a conversão de string para `Date` já
  acontece antes da chamada — ou seja, era um falso positivo. A issue #1 foi fechada como `invalid`,
  com o motivo registrado, e substituída pela issue #4 (bug visual real, confirmado com print).
- **As 3 correções (issues #2, #3, #4) foram aplicadas e commitadas por Iêgo, não pelos donos originais
  das issues (Karina, Luan e Choze, respectivamente).** O motivo foi o prazo de entrega: os donos não
  tinham acesso a um ambiente pra aplicar a correção a tempo. Cada commit e cada PR deixa isso
  explícito na mensagem, citando o dono original da issue — nenhuma autoria foi atribuída incorretamente.
  A revisão de código, essa sim, foi feita por uma pessoa diferente do autor (Choze) em todos os PRs,
  preservando a regra de "ninguém aprova o próprio PR".
- **O PR #7 corrigiu a dependência vulnerável mas não incluiu teste automatizado.** Isso foi percebido
  numa segunda revisão contra o enunciado oficial do trabalho (que não abre exceção de teste para bugs
  de dependência) e corrigido no PR #8, complementar ao #7.
