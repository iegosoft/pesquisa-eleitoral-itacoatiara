# Diagnóstico de Manutenção Preventiva

## Problema identificado

O painel administrativo (Dashboard) calcula seus indicadores de resumo — total de
entrevistados, casas visitadas, bairros cobertos — **baixando o registro completo de
cada entrevistado e de cada residência cadastrados no sistema**, mesmo quando o único
objetivo é exibir uma contagem. Não há filtro nem limite na consulta: toda vez que o
painel é aberto, o sistema lê o histórico inteiro.

## Localização no código (estado atual)

Commit de referência do estado "antes": `9f6946ae48a7d5505aca2d7bf10ce64436f5554c` (branch `main`).

**`src/services/estatisticas.js`, linhas 33-37:**

```js
function observarTodosEntrevistados(callback) {
  return onSnapshot(collectionGroup(db, 'entrevistados'), (snapshot) => {
    callback(snapshot.docs.map(paraEntrevistado));
  });
}
```

**`src/pages/Admin/Dashboard/PainelDashboard.jsx`, linha 51:**

```js
const resumo = useMemo(() => calcularResumo(respostasFiltradas), [respostasFiltradas]);
```

O segundo trecho mostra o ponto de acoplamento: o resumo exibido na tela sempre
depende de `respostasFiltradas`, que só existe depois que a lista completa (vinda da
função acima) foi baixada.

## Comportamento observado (evidência)

Com o sistema publicado em produção, contendo hoje 18 entrevistados e 15 residências
cadastradas, abrir o painel administrativo gera 12 a 15 requisições ao Firestore e
cerca de 3,6 KB transferidos — apenas para exibir os três números de resumo. A carga
de dados cresce proporcionalmente ao histórico acumulado, não ao uso do sistema no
dia.

- Vídeo (antes): [TP2/evidencias/antes/tp2-video1-antes.mp4](../evidencias/antes/tp2-video1-antes.mp4)
- Print do código (estatisticas.js): [TP2/evidencias/antes/tp2-print-arquivo-estatisticas-antes.png](../evidencias/antes/tp2-print-arquivo-estatisticas-antes.png)
- Print do código (PainelDashboard.jsx): [TP2/evidencias/antes/tp2-print-arquivo-PainelDashboard-antes.png](../evidencias/antes/tp2-print-arquivo-PainelDashboard-antes.png)
- Print da quantidade de requisições/dados transferidos: [TP2/evidencias/antes/tp2-print-quantidade-requisicoes-antes.png](../evidencias/antes/tp2-print-quantidade-requisicoes-antes.png)

## Impacto no custo (Firestore) — números reais, não estimativa

O Firestore cobra por leitura de documento. A forma antiga de contar
(`observarTodosEntrevistados` / `buscarTodosEntrevistados`) baixa **1 documento = 1
leitura cobrada** para cada entrevistado. A consulta de agregação usada na correção
(`getCountFromServer`) segue uma regra de cobrança diferente e documentada
publicamente pelo próprio Firestore: **1 leitura cobrada a cada lote de até 1.000
registros verificados**, não por documento.

Isso significa que a contagem, especificamente, passa a custar até 1.000 vezes menos
conforme a base cresce:

| Nº de entrevistados | Leituras cobradas (forma antiga) | Leituras cobradas (forma nova) | Redução |
|---:|---:|---:|---:|
| 18 (hoje)   | 18     | 1  | 94%   |
| 1.000       | 1.000  | 1  | 99,9% |
| 10.000      | 10.000 | 10 | 99,9% |

Isso é dinheiro de verdade: o Firestore cobra por leitura acima da cota gratuita
diária, então quanto mais a pesquisa crescer, mais essa diferença pesa na conta —
sem a correção, o custo de mostrar esse único número cresce junto com a base; com a
correção, ele fica praticamente constante.

**Ressalva importante, para não superestimar o resultado:** essa redução vale para a
operação de contagem em si. Hoje, a tela do painel também exibe gráficos (intenção de
voto, mapa de calor) que continuam precisando do detalhe completo de cada
entrevistado, por um motivo diferente e não tratado nesta correção. Por isso, abrir o
painel *hoje* ainda gera uma leitura completa da coleção — só que agora por causa dos
gráficos, não mais por causa do resumo. A economia comprovada acima já é real e está
embutida no código (função `contarTotalEntrevistados`, testada em
`estatisticas.test.js`), e passa a valer integralmente na conta do Firestore em
qualquer uso futuro que precise só da contagem, sem precisar do detalhe completo —
por exemplo, se os gráficos também vierem a ser otimizados depois (melhoria
relacionada, fora do escopo desta intervenção).

## Mudança futura dificultada

A mudança futura que essa implementação dificulta é **o crescimento da pesquisa** —
mais bairros, mais pesquisadores, mais entrevistas ao longo do tempo. Hoje, com uma
base pequena, o custo é imperceptível. Se o número de entrevistas crescer para
milhares, a mesma lógica vai baixar centenas de vezes mais dado a cada abertura do
painel, tornando o carregamento mais lento e o custo de leitura no Firestore mais alto
— um problema que só aparece depois que a base já cresceu, quando corrigir custa mais
caro do que corrigiria hoje.

## Dificuldade estimada

Baixa/média. A correção não altera o formato dos dados no banco nem o que é exibido
ao usuário — apenas troca, no caso sem filtros ativos, a forma de obter a contagem
(usando a função de agregação nativa do Firestore, `getCountFromServer`, em vez de
baixar todos os documentos). Arquivos afetados: `src/services/estatisticas.js`,
`src/pages/Admin/Dashboard/useDadosPainel.js` e
`src/pages/Admin/Dashboard/PainelDashboard.jsx`.

## Conceito teórico relacionado

Manutenção preventiva / código flexível a mudanças (Cap. 4): a implementação atual
acopla a exibição de um indicador simples ao custo de uma leitura completa da coleção,
reduzindo a capacidade do sistema de escalar sem exigir uma reescrita futura sob
pressão. A correção aplica separação de responsabilidades (contagem agregada vs. dados
detalhados para filtros), reduzindo o impacto de uma mudança de escala nos demais
componentes.
