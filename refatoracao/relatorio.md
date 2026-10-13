# Relatório — TP5: Refatoração

## Resumo

Refatoramos o sistema Pesquisa Eleitoral Itacoatiara em dois níveis, sem mudar o
comportamento observável:

- **Código:** sete refatorações planejadas e uma oportunista, usando quatro
  técnicas do catálogo de Fowler: **Extração de Função**, **Movimentação de
  Função**, **Extração de Classe** e **Substituir Literal Mágico por
  Constante**.
- **Design:** duas extrações que reorganizam responsabilidades entre módulos:
  um hook único para os dados em tempo real e um hook só para os cálculos do
  Dashboard.
- **Par neutro A/B:** uma Extração de Função seguida da Internalização de
  Função, que a desfaz; o diff entre as pontas é vazio.

Detalhes, com o código antes e depois de cada uma, em
[`refatoracoes.md`](refatoracoes.md). Os code smells que motivaram cada uma
estão em [`code-smells.md`](code-smells.md).

| Refatoração | Smell resolvido | Trecho no repositório |
|---|---|---|
| Extração e Movimentação de Função | S1 — percentual formatado em 3 cópias | [`src/utils/formatacao.js`](../src/utils/formatacao.js) |
| Movimentação de Função | S2 — `iniciais` em 2 cópias | [`src/utils/texto.js`](../src/utils/texto.js) |
| Extração de Função | S5 — plural feito à mão em 11 lugares | [`src/utils/texto.js`](../src/utils/texto.js) |
| Extração de Função | S6 — resumo com lógica repetida | [`agregacoes.js`](../src/pages/Admin/Dashboard/agregacoes.js) |
| Extração de Classe (componente) | S3 — logo copiada em 3 lugares | [`LogoSistema.jsx`](../src/components/LogoSistema.jsx) |
| Substituir Literal Mágico por Constante | S4 — opções da pesquisa espalhadas | [`src/dominio/opcoes.js`](../src/dominio/opcoes.js) |
| Extração de Função (design) | S8 — assinatura de dados duplicada | [`useDadosPesquisa.js`](../src/hooks/useDadosPesquisa.js) |
| Extração de Função (design) | S7 — `PainelDashboard` longo | [`useIndicadoresDashboard.js`](../src/pages/Admin/Dashboard/useIndicadoresDashboard.js) |
| Remoção de dado redundante (oportunista) | campo `icone` repetindo `valor` | [`Sidebar.jsx`](../src/components/Sidebar.jsx) |

## Justificativas principais

- **Duplicação primeiro.** A maioria dos smells encontrados era código
  duplicado (S1, S2, S3, S5, S6, S8). Duplicação é o smell de maior risco num
  sistema que ainda muda: uma correção feita numa cópia e esquecida em outra
  vira defeito. Por isso as técnicas escolhidas foram as que eliminam cópias
  (extrair, mover, extrair componente).
- **Literais mágicos** (S4) porque os valores `'indeciso'`, `'branco_nulo'` e as
  faixas etárias são gravados no banco: um erro de digitação em um dos lugares
  faria respostas sumirem da contagem sem nenhum aviso.
- **Nível de design** (S7 e S8) porque os dois problemas não estavam dentro de
  uma função, e sim na divisão de responsabilidades entre os módulos.
- **Só o que preserva o comportamento.** Quando unificar duas cópias mudaria o
  que o usuário vê, não unificamos: o "50%" do quadro de resultado continua
  diferente do "50,0%" do ranking, e os textos aceitos na importação de
  planilha continuam literais, porque são entrada digitada, não valor gravado.

## Como comprovamos que o comportamento não mudou

- **Testes automatizados:** a suíte tinha 62 testes antes; depois, 68 (62
  originais, sem nenhuma alteração, mais 6 novos para os módulos extraídos).
  Todos passando antes e depois.
- **Testes que comparam com o código antigo:** o teste de `formatarPercentual`
  reproduz as cópias antigas e confere que a função nova dá o mesmo resultado.
- **Mesmo roteiro no sistema, antes e depois:** vídeos em
  [`evidencias/`](evidencias/), usados também na demonstração em sala.
- **Um commit por refatoração**, cada um com o diff de antes e depois no GitHub.

## Planejadas e oportunistas

As refatorações planejadas foram registradas na
[Issue #37](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/37)
antes de qualquer código. A oportunista surgiu enquanto mexíamos na barra
lateral para extrair a logo, e foi registrada como tal no commit.

## Aprendizados e dificuldades

- **Refatorar não é "melhorar o visual do código".** O critério que mais pesou
  foi o comportamento: em mais de um caso, a forma "mais limpa" mudaria um
  texto na tela e, portanto, deixaria de ser refatoração.
- **Testes são o que torna a refatoração segura.** Sem a suíte existente (vinda
  dos TPs anteriores), cada mudança exigiria conferir todas as telas à mão.
- **Commits pequenos facilitam a evidência.** Cada técnica num commit próprio
  deixou o antes e depois claro e permitiu provar o par A/B com um diff vazio.
- **Dificuldade:** a suíte de testes leva vários minutos nesta máquina e, numa
  execução com a máquina sobrecarregada, um teste estourou o tempo limite. Por
  isso as evidências foram capturadas com a máquina livre, e a confirmação da
  suíte completa foi feita nas mudanças maiores e no final.
- **Ficou para depois:** dividir o `agregacoes.js` em módulos menores. O smell
  foi mitigado, mas não resolvido por completo.
