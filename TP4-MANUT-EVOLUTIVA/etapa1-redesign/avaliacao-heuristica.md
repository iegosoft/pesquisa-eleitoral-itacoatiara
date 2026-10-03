# Avaliação Heurística — Pesquisa Eleitoral Itacoatiara

Avaliação do sistema no estado em que se encontrava ao final do TP3 (commit
`29f8dab`), usando as 10 heurísticas de usabilidade de Jakob Nielsen. Todas as
telas foram percorridas no sistema publicado
(`pesquisa-eleitoral-itacoatiara.vercel.app`) e cada problema foi conferido
também no código-fonte, para indicar a causa exata.

## Telas avaliadas

| Tela | Perfil | Evidência |
|---|---|---|
| Login | todos | [`login.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-login.png) |
| Dashboard | administrador | [`dashboard-topo.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-topo.png), [`dashboard-completo.mp4`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-completo.mp4) |
| Candidatos | administrador | [`candidatos.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-candidatos.png) |
| Dados | administrador | [`dados.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dados.png) |
| Coleta | pesquisador | [`coleta-parte1.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-coleta-parte1.png), [`coleta-parte2.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-coleta-parte2.png) |

## Escala de severidade

Escala de severidade de Nielsen: **0** não é problema · **1** cosmético ·
**2** pequeno · **3** grave (prioridade alta) · **4** catástrofe.

## Avaliação por heurística

### H1 — Visibilidade do status do sistema

**Pontos fortes:** toda ação demorada troca o texto do botão enquanto roda
("Entrando...", "Salvando...", "Gerando planilha...", "Buscando...") e a coleta
confirma o salvamento com "Casa salva!".

**Problemas:**
- **P1** — A seção do painel administrativo não aparece na URL, que fica sempre
  em `/admin` (visível na barra de endereço de todos os prints do Admin).
- **P3** — O botão "Salvar casa" fica desabilitado sem dizer o que falta. No
  print [`coleta-sem-remover.png`](evidencias/R2-R3-formulario-coleta/antes/tp4-redesign-antes-coleta-sem-remover.png),
  o consentimento está marcado e o botão continua desabilitado (falta preencher
  o morador 2), mas nada na tela diz isso.

### H2 — Correspondência entre o sistema e o mundo real

**Pontos fortes:** o vocabulário é o do domínio de quem usa: bairro, morador,
deputado federal/estadual, "Indeciso", "Branco/Nulo". Os candidatos aparecem
com foto ou iniciais, como na "colinha" de papel do pesquisador.

**Problemas:**
- **P5** — O dashboard mostra percentuais sem a base de entrevistados por trás
  deles (gráfico por bairro, mapa de calor e tooltips só exibem `%`). Em
  pesquisa eleitoral, um percentual sem o tamanho da amostra induz a uma leitura
  errada: um bairro com 1 entrevista aparece com "100%", com o mesmo peso visual
  de um bairro com 50 (`GraficoPorBairro.jsx`, `MapaCalor.jsx:69-72`).
  Nos prints, Centro, Da Paz, Iracy e Jauary 2 aparecem com "100%" sem nenhuma
  indicação de quantas entrevistas sustentam esse número
  ([`dashboard-por-bairro.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-por-bairro.png),
  [`dashboard-mapas.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-mapas.png)).
- **P9** — O card "Inserção em lote" (Dados) cita o identificador técnico
  `"casa_id"` no texto de instrução.
- **P10** — O tooltip do gráfico por bairro mostra os nomes internos dos campos
  do código ("percentualEstadual : 66.7%", "percentualFederal : 66.7%"), e não
  "Estadual" / "Federal"
  ([`dashboard-tooltip.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-tooltip.png)).
- **P11** — O gráfico "Evolução do candidato foco" desenha uma linha em **0%**
  nos dias sem nenhuma coleta (`calcularEvolucao` devolve 0 quando o dia não tem
  entrevista). Nos últimos 7 dias não houve coleta (a última foi em
  08/09/2026), e o gráfico dá a entender que o candidato caiu para 0% de
  intenção ([`dashboard-graficos.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-graficos.png)).

### H3 — Controle e liberdade do usuário

**Problemas:**
- **P1** — Como a troca de seção do Admin é só um estado interno
  (`PaginaAdmin.jsx:28`, `useState`), recarregar a página em "Candidatos" ou
  "Dados" volta para o Dashboard, e o botão Voltar do navegador sai do painel
  em vez de voltar à seção anterior
  ([`navegacao-f5.mp4`](evidencias/R1-rotas-admin/antes/tp4-redesign-antes-navegacao-f5.mp4)).
- **P2** — Na coleta, um morador adicionado por engano não pode ser removido:
  existe `adicionarMorador()` mas nenhuma ação de remover
  (`FormularioCasa.jsx:64-66`). A única saída é recarregar a página e perder a
  casa inteira
  ([`coleta-sem-remover.mp4`](evidencias/R2-R3-formulario-coleta/antes/tp4-redesign-antes-coleta-sem-remover.mp4)).
- **P7** — Quando uma conta sem perfil cadastrado entra, a tela de login mostra
  "Contate o administrador", mas a sessão dessa conta continua ativa
  (`PaginaLogin.jsx:20-31`,
  [`login-codigo-sem-role.png`](evidencias/R6-login-sem-perfil/antes/tp4-redesign-antes-login-codigo-sem-role.png)).
  Toda vez que o app é reaberto, o mesmo erro volta sozinho, e nada indica que
  é possível entrar com outra conta.

### H4 — Consistência e padrões

**Pontos fortes:** os botões, campos e cartões vêm de um único design system
(`md3.module.css`) e se repetem iguais em todas as telas. O item ativo da barra
lateral e o breadcrumb ("Painel administrativo / Candidatos") sempre concordam.

**Problemas:**
- **P1** — O painel quebra uma convenção da web: cada seção deveria ter um
  endereço próprio, que funcione com recarregar, voltar e favoritos.

### H5 — Prevenção de erros

**Pontos fortes:** os botões ficam desabilitados até o formulário estar
completo (coleta, cadastro de candidato), o "Buscar" do CEP só habilita com algo
digitado e o "Salvar casa" exige o consentimento.

**Problemas:**
- **P2** — O seletor "Quantas pessoas moram aqui?" não limita os cartões de
  morador: no vídeo, a casa foi marcada com **1** morador e o sistema deixou
  adicionar o **morador 2**, sem nenhum aviso
  ([`coleta-parte1.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-coleta-parte1.png)).
- **P4** — Os filtros de data aceitam um intervalo invertido ("De" 30/09/2026,
  "Até" 01/09/2026) sem nenhum aviso
  ([`filtro-data-invertida.png`](evidencias/R4-filtro-datas/antes/tp4-redesign-antes-filtro-data-invertida.png)).

### H6 — Reconhecimento em vez de memorização

**Pontos fortes:** a barra lateral está sempre visível, com ícone e texto, e o
breadcrumb mostra onde o usuário está. Na coleta, sexo, faixa etária e voto
são escolhidos tocando em botões visíveis (com foto do candidato), não digitados
nem buscados em listas. O badge "Foco" identifica o candidato foco na lista.

Nenhum problema relevante encontrado.

### H7 — Flexibilidade e eficiência de uso

**Pontos fortes:** o CEP (TP3) preenche o bairro automaticamente, e a coleta
inteira é feita com toques, sem digitação. Depois de salvar, o formulário se
limpa sozinho para a próxima casa. O administrador tem três caminhos para inserir
dados (coleta, planilha em lote e cadastro manual).

Nenhum problema relevante encontrado.

### H8 — Estética e design minimalista

**Pontos fortes:** as telas de Login, Candidatos e Dados são limpas, com
hierarquia clara e um bloco por tarefa.

**Problemas:**
- **P6** — O Dashboard empilha 9 blocos com o mesmo peso visual (filtros,
  4 cards, 2 gráficos de intenção, evolução, gráfico por bairro, 2 mapas de
  calor), sem indicar o que olhar primeiro. Dois deles são redundantes: o
  gráfico "Intenção do candidato foco por bairro" e os mapas "Status do foco
  por bairro" mostram o mesmo dado (percentual do foco em cada bairro), em
  duas visualizações diferentes
  ([`dashboard-completo.mp4`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-completo.mp4)).

### H9 — Ajudar a reconhecer, diagnosticar e corrigir erros

**Pontos fortes:** as mensagens de erro são específicas e em português simples
("E-mail ou senha incorretos. Confira e tente novamente.", "O CEP aponta pro
bairro X, que ainda não está na lista. Selecione o bairro manualmente.").

**Problemas:**
- **P4** — Com o intervalo de datas invertido, todos os cards caem para "0" e
  "Última coleta" vira "—". Isso parece "não houve nenhuma coleta", não "o
  filtro está errado", e o usuário não tem pista de como corrigir.
- **P3** — Com o "Salvar casa" desabilitado, o pesquisador precisa descobrir
  sozinho qual dos campos (de qual morador) ainda falta.

### H10 — Ajuda e documentação

**Pontos fortes:** os cartões da tela Dados explicam para que serve cada
opção, o campo CEP diz que é opcional e o que faz, e a opção de candidato foco
explica o efeito ("destacado nos gráficos").

**Problemas:**
- **P8** — O mapa de calor mostra "Lidera / Empate / Perde" sem explicar o
  critério (o percentual do foco é comparado com o maior percentual do bairro,
  `MapaCalor.jsx:11-26`).

## Resumo dos problemas e prioridade

| ID | Problema | Heurísticas | Severidade | Tratamento |
|---|---|---|---|---|
| P1 | Seções do Admin sem URL própria (recarregar/voltar quebram) | H1, H3, H4 | 3 | R1 |
| P2 | Morador extra não pode ser removido e não respeita a quantidade | H3, H5 | 3 | R2 |
| P3 | "Salvar casa" desabilitado sem dizer o que falta | H1, H9 | 3 | R3 |
| P5 | Percentuais sem base amostral no Dashboard | H2 | 3 | R5 |
| P11 | Evolução mostra 0% em dias sem coleta | H1, H2 | 3 | R5 |
| P10 | Tooltip com nomes internos do código | H2 | 2 | R5 |
| P4 | Intervalo de datas invertido aceito sem aviso | H5, H9 | 2 | R4 |
| P6 | Dashboard sem hierarquia, com blocos redundantes | H8 | 2 | R5 |
| P7 | Sessão de conta sem perfil continua ativa, e o erro volta a cada abertura | H3, H9 | 2 | R6 |
| P8 | Critério do mapa de calor não explicado | H10 | 1 | R5 |
| P9 | Termo técnico `casa_id` no texto de instrução | H2 | 1 | não tratado |

## Melhorias planejadas

- **R1 — Rotas reais no painel administrativo** (`/admin/dashboard`,
  `/admin/candidatos`, `/admin/dados`), com recarregar e voltar funcionando.
- **R2 — Controle dos moradores na coleta:** botão de remover morador e
  indicação "Morador X de N", ligada à quantidade escolhida.
- **R3 — Feedback do que falta para salvar a casa**, exibido junto do botão.
- **R4 — Validação do intervalo de datas** no filtro, com mensagem explicando o
  erro.
- **R5 — Redesign do Dashboard:** reordenar os blocos para contar a história na
  sequência certa (resumo → intenção de voto → território → evolução), unir as
  visualizações redundantes do foco por bairro, mostrar a base de entrevistados
  junto dos percentuais, explicar o critério do mapa, tirar os nomes internos
  dos tooltips, não desenhar 0% em dias sem coleta e renovar a identidade
  visual do painel administrativo (tema escuro em todas as seções do Admin; a
  coleta continua clara, porque é usada no celular, na rua).
- **R6 — Encerrar a sessão da conta sem perfil** e orientar a entrar com outra
  conta.

O problema P9 (severidade 1, cosmético) foi registrado, mas ficou fora do
escopo das melhorias.

As evidências de "depois" de cada melhoria estão em
[`redesign.md`](redesign.md).
