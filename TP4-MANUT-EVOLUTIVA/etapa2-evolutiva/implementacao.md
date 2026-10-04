# Implementação — Manutenção Evolutiva e Acessibilidade

Resultado de cada item planejado em [`planejamento.md`](planejamento.md), com a
comparação antes/depois. As evidências de "antes" foram gravadas antes de
qualquer código da etapa; as de "depois", no ambiente local (`npm run dev`) da
branch de cada item, antes do merge.

## A1 — Uso completo do painel por teclado e por leitor de tela

**Issue:** [#28](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/28)

Quem é atendido: pessoas que não usam mouse (deficiência motora, uso só de
teclado ou acionador) e pessoas cegas ou com baixa visão que usam leitor de tela.

| # | Antes | Depois | Critério WCAG 2.1 |
|---|---|---|---|
| 1 | Para chegar ao conteúdo, o Tab passava obrigatoriamente pelos 10 itens da barra lateral, em toda tela | O primeiro Tab mostra o link **"Pular para o conteúdo"**; com Enter, o foco vai direto para o conteúdo principal | 2.4.1 Ignorar blocos |
| 2 | Ao trocar de seção, o foco ficava na barra lateral, o leitor de tela não anunciava a página nova e a aba do navegador tinha sempre o mesmo título | O foco vai para o título da página nova (que o leitor de tela anuncia) e a aba passa a dizer a seção, por exemplo "Dados · Pesquisa Eleitoral" | 2.4.3 Ordem do foco; 2.4.2 Página com título |
| 3 | "Escolher arquivo" (tela Dados) recebia o foco sem nenhum contorno visível | O botão ganha contorno quando recebe o foco pelo teclado | 2.4.7 Foco visível |
| 4 | O gráfico de Tendência era só desenho; o leitor de tela não tinha acesso às datas e percentuais | O gráfico tem uma descrição para o leitor de tela, e o botão **"Ver como tabela"** mostra uma tabela com os mesmos números (dia, entrevistas, federal, estadual) | 1.1.1 Conteúdo não textual |

### Evidências

| | Antes | Depois |
|---|---|---|
| Navegação por teclado (itens 1, 2 e 3) | [`antes/tp4-acessibilidade-antes-teclado-painel.mp4`](evidencias/A1-teclado-e-leitor-de-tela/antes/tp4-acessibilidade-antes-teclado-painel.mp4) | [`depois/tp4-acessibilidade-depois-teclado-painel.mp4`](evidencias/A1-teclado-e-leitor-de-tela/depois/tp4-acessibilidade-depois-teclado-painel.mp4) |
| Gráfico de Tendência (item 4) | [`antes/…-tendencia-codigo-parte1.png`](evidencias/A1-teclado-e-leitor-de-tela/antes/tp4-acessibilidade-antes-tendencia-codigo-parte1.png), [`antes/…-tendencia-codigo-parte2.png`](evidencias/A1-teclado-e-leitor-de-tela/antes/tp4-acessibilidade-antes-tendencia-codigo-parte2.png): só elementos de desenho, nenhuma alternativa em texto | [`depois/…-tendencia-tabela.png`](evidencias/A1-teclado-e-leitor-de-tela/depois/tp4-acessibilidade-depois-tendencia-tabela.png): tabela aberta abaixo do gráfico |

**Observação sobre a gravação:** no Chrome, quem parte da barra de endereço
passa primeiro, com o Tab, pelos ícones do próprio navegador. Por isso o vídeo
do "depois" começa recarregando a página (F5) e então apertando Tab: assim o
primeiro Tab já cai no link "Pular para o conteúdo".

### O que mudou no código

- `src/pages/Admin/PaginaAdmin.jsx`: link "Pular para o conteúdo"; ao trocar de
  seção, foco no título da página e título da aba atualizado.
- `src/components/Cabecalho.jsx`: o título da página (`h1`) pode receber foco.
- `src/pages/Admin/Dados/PainelDados.module.css`: contorno de foco no botão
  "Escolher arquivo".
- `src/pages/Admin/Dashboard/GraficoEvolucao.jsx`: descrição do gráfico para o
  leitor de tela e a tabela `TabelaEvolucao`.

### Testes

3 testes novos, que também servem de evidência técnica para o que não aparece
na tela:

- `PaginaAdmin.test.jsx`: o link "Pular para o conteúdo" existe e leva o foco ao
  conteúdo principal; ao trocar de seção, o foco vai para o título "Dados" e a aba
  passa a se chamar "Dados · Pesquisa Eleitoral".
- `DesempenhoPorBairro.test.jsx`: a tabela da Tendência existe com o nome certo,
  tem uma linha por dia com coleta, com os valores formatados, e o gráfico tem a
  descrição para o leitor de tela.

Suíte completa: 46/46.
