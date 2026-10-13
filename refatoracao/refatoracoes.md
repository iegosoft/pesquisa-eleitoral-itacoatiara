# Refatorações realizadas

Todas as refatorações estão na branch `refatoracao/codigo`, **uma por commit**,
para que cada "antes e depois" seja um diff limpo. O link de cada commit no
GitHub mostra em vermelho o que saiu e em verde o que entrou.

Regra seguida em todas: **o comportamento não muda**. Depois de cada commit, os
testes da parte afetada foram rodados; a suíte completa foi rodada nas
mudanças maiores e no final. Nenhum teste de comportamento existente foi
alterado; os testes novos cobrem só os módulos extraídos.

Referência: capítulo 9 do livro *Engenharia de Software Moderna* e o catálogo
de Martin Fowler. Os smells (S1–S8) estão descritos em
[`code-smells.md`](code-smells.md).

## Resumo

| # | Refatoração (catálogo de Fowler) | Smell | Tipo | Nível | Commit |
|---|---|---|---|---|---|
| 1 | Extração de Função + Movimentação de Função | S1 | Planejada | Código | [`79ea956`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/79ea956479a55bfcb50266060e681891afb53bb5) |
| 2 | Movimentação de Função | S2 | Planejada | Código | [`59bab2b`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/59bab2b2a6d7acd87fa87fba54cf9444b800d36a) |
| 3 | Extração de Função | S5 | Planejada | Código | [`88212f3`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/88212f38598c2c7954cd7d520b8ec8ed38b78520) |
| 4 | Extração de Função | S6 | Planejada | Código | [`9c05b60`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/9c05b601af3ee815002b2a4437ab7530acd8e527) |
| 5 | Extração de Classe (componente) | S3 | Planejada | Código | [`8deb193`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/8deb1933634c856382345bf1c1b8ab870f2072ed) |
| 6 | Remoção de dado redundante | — | **Oportunista** | Código | [`c01d081`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/c01d0811f7332ba3f322ea8f7fe860b9319f56de) |
| 7 | Substituir Literal Mágico por Constante | S4 | Planejada | Código | [`0c5b787`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/0c5b7872549ba9b82b3d8b78445cdabe81abd2db) |
| 8 | Extração de Função (hook compartilhado) | S8 | Planejada | **Design** | [`6a9b66a`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/6a9b66a72ba6aa70a2a12906b202065e1837c13e) |
| 9 | Extração de Função (hook de cálculos) | S7 | Planejada | **Design** | [`0ca2543`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/0ca25430b71b0e681f5fab89dd69d832d39f8cb4) |
| A | Extração de Função | — | Par neutro | Código | [`0e2cfa1`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/0e2cfa1db25c1f583c644ad26f6e31a4b2328452) |
| B | Internalização de Função (inverso da A) | — | Par neutro | Código | [`354cbde`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/354cbde6139a0dbe3a6ca82a4493ba05d0c851b9) |

**As quatro técnicas do catálogo** usadas como principais: **Extração de
Função**, **Movimentação de Função**, **Extração de Classe** e **Substituir
Literal Mágico por Constante**. A **Internalização de Função** aparece no par
neutro A/B.

---

## 1. Extração e Movimentação de Função — `formatarPercentual` (S1)

**Problema:** a mesma função de formatar percentual estava escrita em três
componentes. Mudar o formato exigiria lembrar de cada cópia.

**Justificativa da escolha:** as três cópias faziam a mesma coisa com uma única
diferença (o número de casas decimais). Extrair uma função com esse número como
parâmetro e movê-la para um módulo compartilhado elimina a duplicação sem mudar
o texto exibido. A cópia do `ResultadoFoco`, que mostra "50%" em vez de
"50,0%", **não** foi unificada de propósito: juntá-la mudaria o que o usuário vê.

**Antes** (copiado em `GraficoEvolucao.jsx`, `RankingIntencao.jsx` e, com 0 casas, em `PerfilAmostra.jsx`):
```js
function formatarPercentual(valor) {
  return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}
```

**Depois** (`src/utils/formatacao.js`, usado pelos três):
```js
function formatarPercentual(valor, casasDecimais) {
  const numero = valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  });
  return `${numero}%`;
}
// uso: formatarPercentual(item.percentual, 1)
```

**Prova de que nada mudou:** o teste `src/utils/formatacao.test.js` compara a
função nova com as cópias antigas em vários valores, incluindo arredondamentos.

## 2. Movimentação de Função — `iniciais` (S2)

**Problema:** `iniciais(nome)` estava copiada, idêntica, em `AvatarCandidato` e
`Cabecalho`.

**Antes** (em dois arquivos):
```js
function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}
```

**Depois:** a função mora em `src/utils/texto.js`, e os dois componentes fazem
`import { iniciais } from '../utils/texto.js';`.

## 3. Extração de Função — `pluralizar` (S5)

**Problema:** o plural era decidido à mão em 11 lugares, em 8 componentes.

**Antes:**
```jsx
{linha.entrevistas} {linha.entrevistas === 1 ? 'entrevista' : 'entrevistas'}
```

**Depois** (`src/utils/texto.js`):
```js
function pluralizar(quantidade, singular, plural) {
  return quantidade === 1 ? singular : plural;
}
```
```jsx
{linha.entrevistas} {pluralizar(linha.entrevistas, 'entrevista', 'entrevistas')}
```

## 4. Extração de Função — resumo do painel (S6)

**Problema:** `calcularResumo` e `calcularResumoAgregado` repetiam a contagem de
bairros e o cálculo da última coleta.

**Antes** (nas duas funções, com nomes de variável diferentes):
```js
const bairrosCobertos = new Set(respostas.map((resposta) => resposta.bairro)).size;
const datas = respostas.map((resposta) => resposta.dataColeta).filter(Boolean);
const ultimaColeta = datas.length ? new Date(Math.max(...datas)) : null;
```

**Depois:**
```js
function contarBairros(registros) {
  return new Set(registros.map((registro) => registro.bairro)).size;
}

function ultimaColetaFormatada(registros) {
  const datas = registros.map((registro) => registro.dataColeta).filter(Boolean);
  return formatarUltimaColeta(datas.length ? new Date(Math.max(...datas)) : null);
}
```

**Prova de que nada mudou:** o teste do TP2 que compara `calcularResumo` com
`calcularResumoAgregado` continua passando sem alteração.

## 5. Extração de Classe (componente) — `LogoSistema` (S3)

**Problema:** o HTML e o CSS do recorte da logo oficial estavam copiados em
`Sidebar`, `BarraTopo` e `PaginaLogin`.

**Justificativa:** em React, a "classe" que agrupa estrutura e comportamento é
o componente. Extrair um componente com o tamanho como propriedade remove as
três cópias de HTML e as três de CSS (63 linhas a menos).

**Antes** (em três arquivos, mais o `.logoMarca` em três CSS):
```jsx
<span className={styles.logoMarca} aria-hidden="true">
  <img src="/icons/icon-192.png" alt="" />
</span>
```

**Depois:**
```jsx
<LogoSistema tamanho={42} />   // 36 na coleta, 44 no login, como antes
```

## 6. Refatoração oportunista — campo redundante na barra lateral

**Como surgiu:** **não estava no plano** (Issue #37). Enquanto trabalhávamos na
`Sidebar.jsx` para a refatoração 5, percebemos que o campo `icone` de cada item
repetia sempre o valor do campo `valor`. Se alguém renomeasse um e esquecesse o
outro, o ícone sumiria.

**Antes:**
```js
{ valor: 'dashboard', rotulo: 'Dashboard', icone: 'dashboard' },
// ...
<span className={styles.itemIcone}>{ICONES[item.icone]}</span>
```

**Depois:**
```js
{ valor: 'dashboard', rotulo: 'Dashboard' },
// ...
<span className={styles.itemIcone}>{ICONES[item.valor]}</span>
```

## 7. Substituir Literal Mágico por Constante — opções da pesquisa (S4)

**Problema:** faixas etárias, opções de sexo e os valores `'indeciso'` e
`'branco_nulo'` estavam escritos à mão em vários arquivos. Um erro de digitação
num deles quebraria a contagem sem nenhum aviso.

**Antes** (exemplos):
```js
const FAIXAS_VALIDAS = ['16-24', '25-34', '35-44', '45-59', '60+'];   // validarImportacao.js
onClick={() => aoSelecionar('indeciso')}                             // GradeCandidatos.jsx
if (valor === 'branco_nulo') return 'Branco/Nulo';                    // resolverVoto.js
```

**Depois** (`src/dominio/opcoes.js`, fonte única):
```js
const VOTO_INDECISO = 'indeciso';
const VOTO_BRANCO_NULO = 'branco_nulo';
const SEXOS = [ { valor: 'feminino', rotulo: 'Feminino' }, /* ... */ ];
const FAIXAS_ETARIAS = [
  { valor: '16-24', rotulo: '16-24', rotuloExtenso: '16 a 24 anos' },
  // ...
];
```
```js
const FAIXAS_VALIDAS = FAIXAS_ETARIAS.map((faixa) => faixa.valor);
onClick={() => aoSelecionar(VOTO_INDECISO)}
```

**Mantidos de propósito:** as linhas de exemplo da planilha modelo
(`modeloXlsx.js`), que são conteúdo de exemplo, e os textos que a pessoa
**digita** na importação (`resolverVoto.js` aceita "indeciso", "branco",
"nulo"…), que não são o valor gravado.

## 8. Extração de Função em nível de design — `useDadosPesquisa` (S8)

**Problema:** `useDadosPainel` (Dashboard) e `PainelEntrevistas` assinavam do
mesmo jeito os dados em tempo real (residências, entrevistados e candidatos).

**Antes** (nos dois arquivos):
```js
useEffect(() => {
  const cancelarResidencias = observarResidencias(setResidencias);
  const cancelarEntrevistados = observarTodosEntrevistados(setEntrevistados);
  const cancelarCandidatos = observarCandidatos(setCandidatos);
  return () => { /* cancela as três */ };
}, []);
```

**Depois:**
```js
const { residencias, entrevistados, candidatos } = useDadosPesquisa();
```

É uma refatoração de **design**: muda a organização entre os módulos (uma
camada de acesso aos dados em tempo real, reutilizável por qualquer tela), e
não só um trecho dentro de uma função.

## 9. Extração de Função em nível de design — `useIndicadoresDashboard` (S7)

**Problema:** `PainelDashboard` tinha 219 linhas, com cerca de 12 cálculos
misturados à montagem da tela.

**Depois:** os cálculos foram para o hook `useIndicadoresDashboard`, e o
componente caiu para **145 linhas**, ficando só com a tela e as interações:
```js
const { resumo, itensFederal, resultadoFederal, /* ... */ } =
  useIndicadoresDashboard({ filtros, periodoEvolucao, candidatosAbertos });
```

Separa duas responsabilidades: **calcular os indicadores** e **mostrá-los**.
O smell de módulo grande do `agregacoes.js` foi **mitigado** pelas refatorações
4 e 7 (menos repetição), mas o arquivo não foi dividido; fica como próximo passo.

---

## Par de refatorações neutro (A e B)

O enunciado pede um par em que a B desfaz a A, mostrando que refatorar não muda
o sistema.

- **A — Extração de Função** ([`0e2cfa1`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/0e2cfa1db25c1f583c644ad26f6e31a4b2328452)): em `calcularIntencaoVoto`, a conta do percentual, repetida duas vezes, vira uma função.
  ```js
  // antes da A
  percentual: total ? ((contagem[candidato.id] ?? 0) / total) * 100 : 0,
  // depois da A
  function percentualDoTotal(quantidade, total) {
    return total ? (quantidade / total) * 100 : 0;
  }
  percentual: percentualDoTotal(contagem[candidato.id] ?? 0, total),
  ```
- **B — Internalização de Função** ([`354cbde`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/commit/354cbde6139a0dbe3a6ca82a4493ba05d0c851b9)), o inverso exato do catálogo: a expressão volta aos dois lugares e a função some.

**Prova:** o diff entre o código antes da A e depois da B é **vazio**:

```
$ git diff 0ca2543 354cbde
(nenhuma linha)
```

Dá para conferir no GitHub:
[comparação `0ca2543...354cbde`](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/compare/0ca25430b71b0e681f5fab89dd69d832d39f8cb4...354cbde6139a0dbe3a6ca82a4493ba05d0c851b9),
que mostra os dois commits e nenhuma diferença de arquivo entre as pontas.

## Planejadas × oportunistas

- **Planejadas:** as refatorações 1 a 5 e 7 a 9. Todas foram identificadas no
  levantamento de code smells e registradas na
  [Issue #37](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/37)
  **antes** de qualquer mudança no código (o commit do levantamento,
  `docs: inicia o TP5 com os code smells…`, vem antes do primeiro commit de
  refatoração no histórico).
- **Oportunista:** a refatoração 6. Não estava na Issue; surgiu enquanto
  trabalhávamos naquele arquivo por outro motivo. O commit dela traz o rótulo
  `refactor(oportunista)` e explica de onde veio.
