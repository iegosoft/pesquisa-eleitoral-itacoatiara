# Planejamento — Manutenção Evolutiva e Acessibilidade

Planejamento da Etapa 2 do TP4. Parte do sistema no estado em que ficou ao fim
da Etapa 1 (redesign concluído, PR #27). Cada item tem uma pasta de evidências
própria em [`evidencias/`](evidencias/), com `antes/` e `depois/`.

## Diagnóstico: o que o administrador consegue fazer hoje

Levantamento feito no código antes de escolher as funcionalidades:

| Ação | Hoje |
|---|---|
| Ver os resultados da pesquisa (Dashboard) | sim, mas só leitura: clicar num bairro ou num candidato não aprofunda nada |
| Cadastrar, editar e excluir candidatos | sim |
| Importar e exportar planilha; cadastrar uma casa manualmente | sim |
| Ver, corrigir ou excluir uma entrevista já salva | **não**: uma entrevista salva com erro (ou duplicada) fica no banco para sempre |
| Definir metas de coleta e acompanhar a equipe de campo | **não**: não há como saber quem coletou quanto, nem quanto falta em cada bairro |
| Escolher entre tema claro e escuro | **não**: o sistema é só escuro desde o redesign |

## Funcionalidades novas

### F1 — Alternar tema claro/escuro

- **O que é:** botão (sol/lua) na barra lateral do painel e na barra superior da
  coleta, que troca o sistema inteiro entre os temas. A escolha fica salva no
  aparelho e, no primeiro acesso, segue a preferência do sistema operacional.
- **Justificativa:** o pesquisador trabalha na rua, e sob sol forte uma tela
  escura reflete e fica difícil de ler. No redesign, a coleta passou a ser escura
  para manter a consistência com o resto do sistema (heurística H4), com a
  combinação de oferecer o tema claro como escolha do usuário. Também atende
  quem lê melhor em fundo claro (baixa visão, sensibilidade à luz) e o uso do
  painel projetado em reuniões. Heurísticas H3 (controle e liberdade) e H7
  (flexibilidade e eficiência).
- **Como:** uma versão clara de todas as variáveis de cor do tema (o redesign já
  concentrou as cores em variáveis), com contraste medido pelo WCAG AA, como foi
  feito no tema escuro.

### F2 — Metas e acompanhamento da coleta (fora do escopo desta entrega)

> **Situação:** planejada, mas não implementada nesta entrega, por decisão do
> grupo. A etapa já cumpre o mínimo do enunciado com três funcionalidades novas
> (F1, F3 e F4). O F2 fica registrado aqui como trabalho futuro, com a
> justificativa e a forma de fazer já levantadas.

- **O que é:** o administrador define uma meta de entrevistas por bairro e passa
  a ver o progresso de cada bairro (por exemplo, 12 de 30) e a produção de cada
  pesquisador (quantas entrevistas, em quais bairros, última coleta).
- **Justificativa:** o objetivo do sistema é uma pesquisa representativa da
  cidade. Hoje o painel mostra o resultado, mas não ajuda a **planejar** a coleta:
  não diz em quais bairros falta ouvir gente, nem como está o trabalho de cada
  pesquisador. Com as metas, o admin sabe para onde mandar a equipe. Isso
  complementa o aviso de "amostra pequena" criado no redesign.
- **Como:** as metas ficam em `configuracoes/metas` no Firestore. As regras de
  segurança atuais já permitem que só o admin grave em `configuracoes`, então não
  é preciso alterá-las.

### F3 — Dashboard interativo

- **O que é:** clicar num bairro (no bloco Território) filtra o painel inteiro por
  aquele bairro; clicar num candidato (no ranking de intenção) abre o desempenho
  dele bairro a bairro.
- **Justificativa:** hoje, para ver um bairro, o admin precisa descer até o
  filtro e escolher na lista; o painel não responde ao que ele está vendo. Com o
  clique direto, a exploração dos dados fica mais rápida e natural (heurísticas
  H7, flexibilidade e eficiência, e H6, reconhecimento em vez de memorização).
- **Como:** reaproveita os filtros existentes; todo elemento clicável também
  funciona pelo teclado.

### F4 — Gerenciar entrevistas

- **O que é:** uma tela com a lista de todas as entrevistas, com busca e filtro
  por bairro, pesquisador e data. O admin pode corrigir um dado (sexo, faixa
  etária, voto) ou excluir uma entrevista, sempre com confirmação.
- **Justificativa:** a qualidade do resultado depende da qualidade dos dados.
  Hoje, uma resposta registrada errada em campo, ou uma casa salva duas vezes,
  distorce os percentuais e não pode ser corrigida pelo sistema (heurística H3,
  controle e liberdade, e H9, recuperação de erros).
- **Como:** as regras de segurança já permitem que só o admin edite e exclua
  residências e entrevistados. A contagem total de entrevistados (TP2) é
  calculada pelo servidor, então se atualiza sozinha após uma exclusão.

## Acessibilidade

### A1 — Uso completo por teclado e por leitor de tela

Levantamento feito no código atual (depois do redesign). Quatro limitações reais,
todas ligadas a quem usa só o teclado ou um leitor de tela:

| # | Problema | Quem é afetado e por quê | Critério WCAG 2.1 | Correção |
|---|---|---|---|---|
| 1 | Não há link "Pular para o conteúdo"; quem navega com Tab passa pela barra lateral inteira em toda tela | Pessoa com deficiência motora que usa só teclado ou acionador; leitor de tela | 2.4.1 Ignorar blocos | Link de pular, visível ao receber foco |
| 2 | Ao trocar de seção do painel, o foco do teclado fica para trás e o leitor de tela não anuncia a página nova | Pessoa cega; quem usa só teclado | 2.4.3 Ordem do foco | Mover o foco para o título da página nova e atualizar o título da aba |
| 3 | O botão "Escolher arquivo" (Dados) não mostra o contorno de foco, porque o campo real é invisível | Quem usa só teclado não sabe onde está | 2.4.7 Foco visível | Contorno de foco no botão quando o campo recebe foco |
| 4 | O gráfico de Tendência é só desenho (SVG), sem alternativa em texto | Pessoa cega não acessa a evolução do candidato | 1.1.1 Conteúdo não textual | Tabela com os mesmos dados, acessível ao leitor de tela, e opção "ver como tabela" |

No redesign, o ranking de intenção e as roscas do perfil já passaram a ser texto
real (lidos pelo leitor de tela); por isso não entram nesta lista.

## Ordem de execução e rastreabilidade

1. Evidências de **antes** de todos os itens (antes de qualquer código).
2. Um item por vez, cada um com Issue, branch, testes automatizados, evidências
   de **depois**, documentação e Pull Request: A1, F1, F4, F3. O F2 ficou fora
   do escopo desta entrega (ver acima).
3. README e CHANGELOG do projeto atualizados no final, como pede o enunciado.

O resultado de cada item está em [`implementacao.md`](implementacao.md).
