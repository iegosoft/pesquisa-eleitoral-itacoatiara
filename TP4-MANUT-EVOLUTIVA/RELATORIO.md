# Relatório Final — TP4: Manutenção Evolutiva

## Resumo

O TP4 evoluiu o sistema Pesquisa Eleitoral Itacoatiara em duas etapas:

1. **Redesign** guiado por uma avaliação heurística: o sistema original foi
   avaliado pelas 10 heurísticas de Nielsen, foram encontrados 11 problemas
   (P1–P11) e 6 melhorias de interface (R1–R6) corrigiram 10 deles.
2. **Manutenção evolutiva e acessibilidade:** três funcionalidades novas (alternar
   tema, Dashboard interativo e gerenciar entrevistas) e uma melhoria de
   acessibilidade (uso completo por teclado e por leitor de tela).

Cada mudança passou pelo mesmo fluxo: evidência de **antes**, Issue, branch,
implementação com testes automatizados, evidência de **depois**, documentação e
Pull Request revisado e integrado. Índice completo em [`README.md`](README.md).

## Etapa 1 — Redesign

Documentos: [`avaliacao-heuristica.md`](etapa1-redesign/avaliacao-heuristica.md)
(avaliação) e [`redesign.md`](etapa1-redesign/redesign.md) (melhorias, com antes e
depois).

| Melhoria | Problemas | Heurísticas | Pull Request |
|---|---|---|---|
| R1 — Rotas reais no painel administrativo | P1 | H1, H3, H4 | [#19](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/19) |
| R2/R3 — Controle dos moradores e aviso do que falta na coleta | P2, P3 | H1, H3, H5, H9 | [#21](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/21) |
| R4 — Validação do intervalo de datas | P4 | H3, H5, H9 | [#23](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/23) |
| R5 — Reorganização do Dashboard e nova identidade visual | P5, P6, P8, P10, P11 | H1, H2, H4, H6, H7, H8, H10 | [#27](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/27) |
| R6 — Encerrar a sessão de conta sem perfil | P7 | H3, H9 | [#25](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/25) |

O P9 (um termo técnico no texto de instrução da importação, severidade 1) foi
registrado e não tratado, por ser cosmético.

A direção visual do redesign (tema escuro, cartões de vidro, números em
destaque, fotos dos candidatos, gráficos circulares) partiu do grupo, mas só foi
aplicada **depois** da avaliação heurística e ajustada aos problemas
encontrados, para o redesign não ser apenas cosmético. Ao longo do caminho, a
própria avaliação heurística serviu de critério para revisar decisões
visuais: a coleta chegou a ter um tema claro próprio, que foi revertido por
quebrar a consistência com o resto do sistema (H4).

### Técnicas de UI/UX utilizadas

Em síntese (detalhes e onde cada uma aparece em
[`redesign.md`](etapa1-redesign/redesign.md#técnicas-de-uiux-aplicadas)):

- **Avaliação heurística de Nielsen** como ponto de partida de cada mudança.
- **Hierarquia visual e storytelling com dados:** a resposta principal primeiro
  e as seções na ordem da leitura, cada uma dizendo que pergunta responde.
- **Divulgação progressiva:** detalhes (bairro a bairro, tabela, votos) só
  quando o usuário pede.
- **Cor com significado único e destaque pré-atentivo:** só o candidato foco tem
  cor; status sempre com cor, ícone e texto.
- **Design system com tokens** e uma única fonte, para consistência.
- **Acessibilidade medida:** contraste WCAG AA e paletas validadas para
  daltonismo, nos dois temas.
- **Prevenção de erros, visibilidade do status e integridade dos dados** (base
  amostral, sem 0% falso, aviso de amostra pequena).
- **Microinterações sutis, áreas de clique ampliadas e personalização** (tema
  claro/escuro).

## Etapa 2 — Manutenção evolutiva e acessibilidade

Documentos: [`planejamento.md`](etapa2-evolutiva/planejamento.md) (diagnóstico,
justificativas) e [`implementacao.md`](etapa2-evolutiva/implementacao.md)
(resultado de cada item, com antes e depois).

| Item | O que entrega | Pull Request |
|---|---|---|
| F1 — Alternar tema claro/escuro | Tema escolhido pelo usuário em todas as telas, salvo no aparelho | [#31](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/31) |
| F3 — Dashboard interativo | Clique no bairro filtra o painel; clique no candidato mostra o desempenho dele bairro a bairro | [#35](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/35) |
| F4 — Gerenciar entrevistas | Conferir, corrigir e excluir entrevistas salvas, com confirmação | [#33](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/33) |
| A1 — Teclado e leitor de tela | Pular para o conteúdo, foco ao trocar de seção, foco visível no envio de arquivo, tabela alternativa ao gráfico | [#29](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/29) |

A acessibilidade foi justificada item a item (problema, quem é afetado e por quê,
critério WCAG 2.1 e correção) e verificada por testes automatizados que conferem
o que não aparece na tela: foco, nomes acessíveis e regiões anunciadas.

## Verificação

- **Testes automatizados:** a suíte passou de 20 testes, ao fim do TP3, para
  **62 testes**, todos passando. Cada melhoria e funcionalidade trouxe testes
  próprios.
- **Cores medidas, não estimadas:** todas as cores de gráfico passaram por um
  validador de paleta (separação para daltonismo, luminosidade e contraste), e
  todos os textos foram medidos pela fórmula de contraste do WCAG, nos dois
  temas. Três problemas só apareceram por causa dessa medição e foram
  corrigidos: a primeira dupla de cores escolhida para federal/estadual no tema
  escuro; o nome do candidato estadual como texto (4,30:1); e as cores originais
  do sistema para federal/estadual no tema claro, que eram praticamente iguais
  para quem tem deuteranopia (ΔE 0,4).
- **Lint e build** sem erros em todas as entregas.

## Desvios em relação ao enunciado

- **Local da documentação.** O enunciado sugere `docs/redesign/`. Para manter o
  padrão dos TPs anteriores (TP1 a TP3), toda a documentação do TP4 está em
  `TP4-MANUT-EVOLUTIVA/`, separada por etapa (`etapa1-redesign/` e
  `etapa2-evolutiva/`). As evidências ficam numa pasta por melhoria, cada uma com
  `antes/` e `depois/`.
- **Escopo da Etapa 2.** O planejamento previa uma quarta funcionalidade (F2 —
  metas e acompanhamento da coleta), que ficou como trabalho futuro por decisão
  do grupo. A etapa entrega três funcionalidades, acima do mínimo de duas. Da
  acessibilidade, a sinalização de seleção para leitor de tela nos botões da
  coleta também ficou fora, por decisão do grupo; os outros quatro pontos foram
  implementados.
- **Evidências por código e testes.** Em dois casos, a evidência de "depois" é o
  código mais os testes automatizados, e não a interface: a R6 (reproduzir uma
  conta sem perfil exigiria criar uma conta só para isso) e a tabela alternativa
  da A1 (o que importa ali é a estrutura lida pelo leitor de tela, que não
  aparece na tela).
- **Ambiente das evidências.** As evidências de "antes" foram gravadas no
  sistema publicado, e as de "depois" no ambiente local de cada branch, antes do
  merge. Como o ambiente local usa o mesmo banco de dados do sistema publicado,
  a correção e a exclusão de entrevistas (F4) foram demonstradas numa casa de
  teste criada só para isso.

## Correções de rumo durante o trabalho

Ficaram registradas, nos documentos, as vezes em que uma afirmação inicial
estava errada e foi corrigida depois de verificada:

- O componente `BarraTopo` foi apontado como código morto na primeira leitura,
  mas é usado na tela de coleta; o problema foi retirado da avaliação.
- O P7 dizia que uma conta sem perfil ficava "presa" no login; ao implementar,
  verificou-se que o formulário continuava utilizável, e o problema real era a
  sessão mantida. A descrição foi corrigida.
- A primeira versão do gráfico de evolução ligava com uma reta contínua dias
  separados por semanas sem coleta, sugerindo uma tendência que não foi medida —
  o mesmo tipo de erro que a R5 queria corrigir. Passou a usar linha contínua
  só entre dias seguidos e tracejado sobre os dias sem coleta.
- Os percentuais iguais entre federal e estadual no painel foram investigados
  até a planilha exportada: não era defeito, e sim coincidência nos dados de
  teste.

## Reflexão crítica

A avaliação heurística foi o que deu direção ao trabalho. Sem ela, o redesign
teria sido só a aplicação de um estilo visual. Com ela, cada mudança visual
precisou responder a um problema concreto, e algumas escolhas estéticas foram
revistas por contrariar uma heurística, como a coleta clara (H4) e o verde e
vermelho por posição no ranking (que dariam dois significados à mesma cor).

O ponto mais trabalhoso foi a cor. Escolher cores "bonitas" é rápido; garantir
que elas sejam distinguíveis para quem tem daltonismo e legíveis nos dois temas
exigiu medir cada uma, e a medição reprovou escolhas que pareciam boas a olho,
inclusive as cores originais do próprio sistema.

Na Etapa 2, as funcionalidades escolhidas atacaram o que mais faltava ao
administrador: o painel deixou de ser só leitura (F3), passou a permitir corrigir
os dados que alimentam os resultados (F4) e a se adaptar a quem usa (F1). A
acessibilidade (A1) e o cuidado com teclado e leitor de tela nas
funcionalidades novas mostram que acessibilidade funciona melhor como critério
de todo o desenvolvimento do que como um item isolado.

Como trabalho futuro ficam o F2 (metas de coleta por bairro e acompanhamento
dos pesquisadores) e a sinalização de seleção para leitor de tela na coleta.
