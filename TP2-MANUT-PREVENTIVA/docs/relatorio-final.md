# Relatório Final — TP2: Manutenção Preventiva

## Resumo

O painel administrativo do sistema calculava seus indicadores de resumo (total de
entrevistados, casas visitadas, bairros cobertos) baixando o registro completo de
cada entrevistado e residência cadastrados, sem filtro nem limite, toda vez que era
aberto — mesmo quando o único objetivo era exibir uma contagem. Essa implementação
não quebrava nada hoje, mas dificultaria o crescimento futuro da pesquisa (mais
bairros, pesquisadores e entrevistas), já que o custo de abrir o painel cresceria
proporcionalmente ao histórico acumulado, não ao uso diário.

A correção substituiu essa contagem, no caso em que nenhum filtro detalhado está
ativo, por uma consulta de agregação nativa do Firestore (`getCountFromServer`), que
obtém o número sem baixar nenhum documento.

## Por que é manutenção preventiva, e não corretiva

Não havia nenhum comportamento incorreto sendo corrigido — o sistema sempre exibiu os
números certos, mesmo antes desta mudança. A intervenção antecipa um problema que
**ainda não aconteceu**: o custo e a lentidão que apareceriam conforme a base de dados
crescesse. É uma melhoria estrutural (Cap. 4 — código flexível a mudanças), aplicada
antes de o problema se manifestar, exatamente a definição de manutenção preventiva.

## Impacto no custo (Firestore) — a justificativa central desta intervenção

Esse é o ponto mais importante da correção: o Firestore cobra por leitura de
documento. A forma antiga de contar baixava **1 documento = 1 leitura cobrada** por
entrevistado. A consulta de agregação usada na correção segue uma regra de cobrança
diferente, documentada publicamente pelo Firestore: **1 leitura cobrada a cada lote de
até 1.000 registros verificados**, não por documento.

| Nº de entrevistados | Leituras cobradas (forma antiga) | Leituras cobradas (forma nova) | Redução |
|---:|---:|---:|---:|
| 18 (hoje)   | 18     | 1  | 94%   |
| 1.000       | 1.000  | 1  | 99,9% |
| 10.000      | 10.000 | 10 | 99,9% |

Isso é **dinheiro real**: o Firestore cobra por leitura acima da cota gratuita diária,
e sem a correção esse custo cresceria junto com a base de dados. Com a correção, o
custo de exibir esse número fica praticamente constante, independente de quantas
entrevistas a pesquisa acumular.

**Ressalva importante, para não superestimar o resultado:** essa redução vale para a
operação de contagem em si. A tela do painel também exibe gráficos (intenção de voto,
mapa de calor) que continuam precisando do detalhe completo de cada entrevistado, por
um motivo diferente e não tratado nesta correção — por isso, abrir o painel hoje ainda
gera uma leitura completa da coleção, só que agora por causa dos gráficos, não mais
por causa do resumo. A prova de que o resumo, isoladamente, não depende mais do
download completo está no teste automatizado (`estatisticas.test.js`), que verifica
que `contarTotalEntrevistados` chama `getCountFromServer` e nunca chama `getDocs`. Um
teste manual isolando a busca de entrevistados confirmou visualmente essa mesma
separação: com a busca completa desligada, o resumo continuou exibindo os números
corretos, e o volume de dados transferidos caiu (de 5,2 kB para 3,4 kB de recursos na
mesma sessão).

## Linha do tempo e evidências

| Etapa | Referência |
|---|---|
| Diagnóstico | [TP2-MANUT-PREVENTIVA/docs/diagnostico-manutencao-preventiva.md](diagnostico-manutencao-preventiva.md) |
| Issue | [#10](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/10) |
| Branch | [`preventiva/contagem-agregada-painel`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/tree/preventiva/contagem-agregada-painel) |
| Commits | [`ce8b2bb`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/ce8b2bb) (diagnóstico + evidências antes), [`9a6bf2b`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/9a6bf2b) (implementação), [`1d1f6e7`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/1d1f6e7) (evidências depois) |
| Pull Request | [#11](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/11) |
| Vídeo (antes) | [TP2-MANUT-PREVENTIVA/evidencias/antes/tp2-video1-antes.mp4](../evidencias/antes/tp2-video1-antes.mp4) |
| Vídeo (depois) | [TP2-MANUT-PREVENTIVA/evidencias/depois/tp2-video2-depois.mp4](../evidencias/depois/tp2-video2-depois.mp4) |
| Prints (antes) | `TP2-MANUT-PREVENTIVA/evidencias/antes/` |
| Prints (depois) | `TP2-MANUT-PREVENTIVA/evidencias/depois/` |

## Arquivos alterados

- `src/services/estatisticas.js` — nova função `contarTotalEntrevistados()`.
- `src/pages/Admin/Dashboard/agregacoes.js` — nova função `calcularResumoAgregado()`.
- `src/pages/Admin/Dashboard/useDadosPainel.js` — expõe `residencias` e
  `totalEntrevistadosAgregado`.
- `src/pages/Admin/Dashboard/PainelDashboard.jsx` — usa o caminho agregado quando não
  há filtro ativo; com filtro, calcula como antes.
- `src/services/estatisticas.test.js`, `src/pages/Admin/Dashboard/agregacoes.test.js`
  (novos) — testes automatizados da melhoria.

## Preservação funcional

- 12/12 testes automatizados passando (`npx vitest run`), incluindo os 2 novos.
- `npx oxlint` sem alertas nos arquivos alterados.
- Confirmação manual: o painel exibe os mesmos números antes e depois da correção
  (18 entrevistados, 15 casas visitadas, 10 bairros cobertos), com e sem filtro
  ativo.

## Nota sobre organização dos arquivos

O enunciado oficial referencia o caminho `/docs/...` para os documentos desta etapa.
Por decisão do grupo, e para manter a mesma convenção adotada no TP1, esses documentos
foram organizados em `TP2-MANUT-PREVENTIVA/docs/` e as evidências em `TP2-MANUT-PREVENTIVA/evidencias/`, dentro de uma
pasta própria para cada Trabalho Prático no repositório. O conteúdo e a rastreabilidade
exigidos pelo enunciado foram mantidos integralmente; apenas o caminho do diretório
foi adaptado.

## Conclusão

A intervenção não corrigiu nenhum defeito — o sistema já funcionava corretamente antes
dela. O que foi feito foi remover um acoplamento entre "exibir uma contagem simples" e
"baixar o histórico completo de dados", que se tornaria um problema real de custo e
desempenho conforme a pesquisa crescesse. A melhoria foi validada por teste
automatizado, preservou o comportamento exibido ao usuário, e sua justificativa
financeira está fundamentada na própria regra de cobrança do Firestore — não em
estimativa.
