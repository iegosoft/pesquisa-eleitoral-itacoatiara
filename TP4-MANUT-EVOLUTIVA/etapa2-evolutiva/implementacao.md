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

## F1 — Alternar tema claro/escuro

**Issue:** [#30](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/30)

| | Antes | Depois |
|---|---|---|
| Escolha de tema | não existia: o sistema era só escuro desde o redesign | botão na barra lateral do painel ("Tema claro" / "Tema escuro"), na barra superior da coleta e no login (ícone de sol/lua, com o nome da ação para o leitor de tela) |
| Alcance | — | a troca vale para todas as telas, inclusive a barra lateral e a barra superior da coleta |
| Memória da escolha | — | a escolha fica salva no aparelho; no primeiro acesso, o sistema segue o modo claro/escuro do celular ou do computador |
| Ao abrir a página | — | um script no `index.html` aplica o tema antes de o app carregar, para não aparecer o tema errado por um instante |

**Por que se justifica:** o pesquisador trabalha na rua, e sob sol forte uma tela
escura reflete e fica difícil de ler. No redesign, a coleta passou a ser escura
para manter a consistência do sistema (H4), com a combinação de oferecer o claro
como escolha. Atende também quem lê melhor em fundo claro e o uso do painel
projetado. Heurísticas H3 (controle e liberdade) e H7 (flexibilidade e
eficiência).

### Cores do tema claro (medidas, não estimadas)

- **Achado:** as cores originais de federal e estadual no tema claro (azul
  `#2563eb` e roxo `#7c3aed`) **reprovaram** no validador de paleta: para quem
  tem deuteranopia, a diferença entre elas é ΔE 0,4, ou seja, ficam praticamente
  iguais. Até para visão normal ficam abaixo do mínimo (ΔE 12,4, mínimo 15).
  Foram trocadas por ciano `#0891b2` e violeta `#9333ea`, que passaram em todas as
  checagens e combinam com as do tema escuro.
- Dois tons de texto ficaram abaixo de 4,5:1 e foram escurecidos: o texto
  secundário sobre os campos (4,34 → 5,37:1) e o texto azul das opções
  selecionadas (4,24 → 5,49:1).
- No tema claro, o item ativo da barra lateral (fundo azul) passou a ter texto e
  ícone brancos (5,17:1); com o texto escuro do tema, ficaria ilegível.

| Exemplos de contraste (tema claro) | Razão |
|---|---|
| Texto principal sobre o cartão | 17,85:1 |
| Texto secundário sobre o cartão / sobre os campos | 5,88 / 5,37:1 |
| Selos Lidera / Empate / Perde | 6,49 / 6,37 / 6,80:1 |
| Atalho ativo da barra lateral | 6,70:1 |

### Evidências

| | Antes | Depois |
|---|---|---|
| Painel | [`antes/…-tema-painel.png`](evidencias/F1-alternar-tema/antes/tp4-evolutiva-antes-tema-painel.png): sem opção de tema | [`depois/…-tema-painel.mp4`](evidencias/F1-alternar-tema/depois/tp4-evolutiva-depois-tema-painel.mp4) (vídeo alternando os temas), [`depois/…-tema-claro-painel.png`](evidencias/F1-alternar-tema/depois/tp4-evolutiva-depois-tema-claro-painel.png), [`depois/…-tema-escuro-painel.png`](evidencias/F1-alternar-tema/depois/tp4-evolutiva-depois-tema-escuro-painel.png) |
| Coleta | [`antes/…-tema-coleta.png`](evidencias/F1-alternar-tema/antes/tp4-evolutiva-antes-tema-coleta.png): sem opção de tema | [`depois/…-tema-claro-coleta.png`](evidencias/F1-alternar-tema/depois/tp4-evolutiva-depois-tema-claro-coleta.png), [`depois/…-tema-escuro-coleta.png`](evidencias/F1-alternar-tema/depois/tp4-evolutiva-depois-tema-escuro-coleta.png) |

### O que mudou no código

- `src/contexts/TemaContext.jsx` e `useTema.js`: guardam o tema, aplicam no
  `<html>` e salvam a escolha.
- `src/components/BotaoTema.jsx`: o botão, em versão com texto (barra lateral) e
  só com ícone (coleta e login).
- `src/styles/theme.css`: valores do tema claro revisados e medidos.
- `index.html`: aplica o tema antes de o app carregar.

### Testes

4 testes novos em `src/contexts/TemaContext.test.jsx` (tema inicial, troca e
gravação da escolha, respeito à escolha salva, nome acessível do botão só com
ícone). Suíte completa: 50/50.
