# Redesign — melhorias de interface (antes e depois)

Cada melhoria abaixo corrige um ou mais problemas encontrados na
[avaliação heurística](avaliacao-heuristica.md) e indica quais heurísticas de
Nielsen ela atende. As evidências de "antes" foram gravadas no sistema
publicado (Vercel), e as de "depois" no ambiente local (`npm run dev`) da branch
de cada melhoria, antes do merge.

## Técnicas de UI/UX aplicadas

Resumo das técnicas usadas no redesign e onde cada uma aparece:

| Técnica | Onde foi aplicada |
|---|---|
| **Avaliação heurística** (10 heurísticas de Nielsen, com escala de severidade) | Ponto de partida de todas as melhorias: cada mudança responde a um problema P1–P11 |
| **Hierarquia visual / pirâmide invertida** (o mais importante primeiro) | O Dashboard abre com o "Resultado do candidato foco" e segue do resumo para o detalhe: resultado → coleta → intenção → território → perfil → tendência |
| **Storytelling com dados** | Cada seção tem um título e uma linha dizendo que pergunta ela responde; frases prontas como "27,3 pontos à frente de Josias Melo." |
| **Divulgação progressiva** (detalhe só quando pedido) | Desempenho do candidato bairro a bairro ao clicar, "Ver como tabela" na tendência, quantidade de votos ao passar o mouse |
| **Destaque pré-atentivo** (o olho acha antes de ler) | Só o candidato foco tem cor; os concorrentes ficam em cinza |
| **Cor semântica com significado único** | Ciano/violeta = cargo; verde/âmbar/vermelho = resultado do foco; cinza = contexto. A cor nunca indica posição no ranking |
| **Codificação redundante** (não depender só da cor) | Status sempre com cor + ícone + texto (▲ Lidera, = Empate, ▼ Perde); amostra pequena com borda tracejada e selo |
| **Design system com tokens** (consistência, H4) | Todas as cores, raios e sombras vêm de variáveis de tema; uma única família tipográfica, com hierarquia por tamanho e peso; algarismos de largura fixa para alinhar números |
| **Acessibilidade medida** | Contraste WCAG AA calculado para cada texto, paletas validadas para daltonismo, nos dois temas; respeito a "reduzir movimento" |
| **Prevenção e recuperação de erros** | Validação das datas no filtro, limite de moradores, "Para salvar esta casa, falta:", mensagens que dizem como corrigir |
| **Visibilidade do status do sistema** | URLs por seção, seção atual destacada na barra lateral, base de entrevistados em cada percentual, avisos anunciados ao leitor de tela |
| **Integridade dos dados na visualização** | Nenhum 0% falso em dias sem coleta (linha tracejada onde não houve medição), base amostral visível, aviso de amostra pequena |
| **Navegação por âncoras com destaque da seção visível** (*scroll-spy*) | Atalhos de seção na barra lateral, fixa durante a rolagem |
| **Microinterações sutis** | Hover discreto nas linhas e cartões, barras e anéis que crescem na entrada, números que contam até o valor |
| **Áreas de clique ampliadas** (Lei de Fitts) | A linha inteira do candidato e o cartão inteiro do bairro são clicáveis |
| **Personalização** | Tema claro ou escuro, seguindo a preferência do sistema operacional no primeiro acesso |

## R1 — Rotas reais no painel administrativo

**Problema tratado:** P1 · **Heurísticas:** H1 (visibilidade do status do
sistema), H3 (controle e liberdade do usuário), H4 (consistência e padrões) ·
**Issue:** [#18](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/18)

| | Antes | Depois |
|---|---|---|
| URL da seção | sempre `/admin` | `/admin/dashboard`, `/admin/candidatos`, `/admin/dados` |
| Recarregar a página em "Candidatos" | volta para o Dashboard | continua em Candidatos |
| Botão Voltar do navegador | sai do painel | volta para a seção anterior |
| Itens da barra lateral | botões (`<button>`) | links reais (`<a>`), com `aria-current="page"` na seção ativa |
| Evidência | [`antes/tp4-redesign-antes-navegacao-f5.mp4`](evidencias/R1-rotas-admin/antes/tp4-redesign-antes-navegacao-f5.mp4) | [`depois/tp4-redesign-depois-navegacao-f5.mp4`](evidencias/R1-rotas-admin/depois/tp4-redesign-depois-navegacao-f5.mp4) |

**O que mudou no código:** a rota `/admin` passou a ser `/admin/:secao?`
(`src/routes/AppRoutes.jsx`). A seção ativa agora vem da URL, e não mais de um
`useState` (`src/pages/Admin/PaginaAdmin.jsx`). `/admin` ou uma seção
inexistente redirecionam para `/admin/dashboard`. Na barra lateral
(`src/components/Sidebar.jsx`), os itens viraram `NavLink`.

**Testes:** `src/pages/Admin/PaginaAdmin.test.jsx` (3 novos), que cobrem a
abertura da seção pela URL e os dois redirecionamentos.

## R2 e R3 — Controle dos moradores e aviso do que falta na coleta

**Problemas tratados:** P2 e P3 · **Heurísticas:** H1 (visibilidade do status
do sistema), H3 (controle e liberdade do usuário), H5 (prevenção de erros),
H9 (ajudar a reconhecer e corrigir erros) ·
**Issue:** [#20](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/20)

As duas melhorias estão no mesmo componente (`FormularioCasa.jsx`) e foram
entregues juntas.

| | Antes | Depois |
|---|---|---|
| Morador adicionado por engano | não pode ser removido; a única saída é recarregar e perder a casa inteira | botão **Remover** em cada morador quando há mais de um |
| Quantidade de moradores × entrevistados | a casa marcada com 1 morador aceitava um morador 2 | "+ Adicionar próximo morador" desabilita ao atingir a quantidade, com o aviso "Todos os N morador(es) da casa já foram adicionados"; se a quantidade for reduzida depois, o salvamento é bloqueado com explicação |
| "Salvar casa" desabilitado | sem nenhuma explicação | caixa "Para salvar esta casa, falta:", listando os campos pendentes de cada morador, o excesso de entrevistados e o consentimento |
| Leitor de tela | não era avisado de nada | a caixa de pendências usa `role="status"` e `aria-live="polite"`; o botão de remover tem nome acessível "Remover morador N" |
| Evidência | [`antes/tp4-redesign-antes-coleta-sem-remover.mp4`](evidencias/R2-R3-formulario-coleta/antes/tp4-redesign-antes-coleta-sem-remover.mp4), [`antes/tp4-redesign-antes-coleta-sem-remover.png`](evidencias/R2-R3-formulario-coleta/antes/tp4-redesign-antes-coleta-sem-remover.png) | [`depois/tp4-redesign-depois-coleta-moradores.mp4`](evidencias/R2-R3-formulario-coleta/depois/tp4-redesign-depois-coleta-moradores.mp4), [`depois/tp4-redesign-depois-coleta-pendencias.png`](evidencias/R2-R3-formulario-coleta/depois/tp4-redesign-depois-coleta-pendencias.png), [`depois/tp4-redesign-depois-coleta-remover.png`](evidencias/R2-R3-formulario-coleta/depois/tp4-redesign-depois-coleta-remover.png) |

**Decisão de domínio:** a quantidade de pessoas que **moram** na casa não precisa
ser igual à quantidade de **entrevistados**, porque crianças e moradores
ausentes não respondem. Por isso o sistema impede apenas o caso impossível
(mais entrevistados do que moradores) e não obriga a entrevistar todos.

**O que mudou no código:** `src/components/coleta/FormularioCasa.jsx`
(`removerMorador`, `listarPendencias` e o limite de moradores),
`src/components/coleta/CartaoMorador.jsx` (botão Remover) e os módulos CSS dos
dois componentes.

**Testes:** `src/components/coleta/FormularioCasa.test.jsx`, com 4 novos testes
(lista de pendências, limite de moradores, remoção e bloqueio por excesso).
Suíte completa: 27/27.

## R4 — Validação do intervalo de datas nos filtros do Dashboard

**Problema tratado:** P4 · **Heurísticas:** H5 (prevenção de erros), H9
(ajudar a reconhecer, diagnosticar e corrigir erros), H3 (controle e liberdade
do usuário, com o botão "Limpar filtros") ·
**Issue:** [#22](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/22)

| | Antes | Depois |
|---|---|---|
| Escolher datas pelo calendário | aceitava qualquer combinação | o calendário de cada campo bloqueia as datas que inverteriam o intervalo (no print, com "De" = 30/09, o "Até" não deixa escolher dias anteriores) |
| Intervalo invertido digitado | todos os cards caíam para "0" e "Última coleta" para "—", sem nenhum aviso | mensagem "A data inicial (30/09/2026) é depois da data final (01/09/2026). Corrija o intervalo…", campos com borda vermelha, e o painel continua mostrando os dados (19 entrevistados, 16 casas), ignorando só o filtro de data |
| Voltar ao estado inicial | trocar cada filtro manualmente | botão **Limpar filtros**, visível quando há algum filtro ativo |
| Leitor de tela | sem aviso | a mensagem usa `role="alert"`; os campos recebem `aria-invalid` e `aria-describedby` apontando para a mensagem |
| Evidência | [`antes/tp4-redesign-antes-filtro-data-invertida.png`](evidencias/R4-filtro-datas/antes/tp4-redesign-antes-filtro-data-invertida.png) | [`depois/tp4-redesign-depois-filtro-data-invertida.png`](evidencias/R4-filtro-datas/depois/tp4-redesign-depois-filtro-data-invertida.png), [`depois/tp4-redesign-depois-filtro-calendario.png`](evidencias/R4-filtro-datas/depois/tp4-redesign-depois-filtro-calendario.png) |

**O que mudou no código:** `intervaloDeDatasInvertido` em
`src/pages/Admin/Dashboard/agregacoes.js`; `Filtros.jsx` (atributos `min`/`max`,
mensagem de erro e botão "Limpar filtros"); `PainelDashboard.jsx`, que ignora o
filtro de data quando o intervalo está invertido.

**Testes:** `src/pages/Admin/Dashboard/Filtros.test.jsx`, com 4 novos testes.
Suíte completa: 31/31.

## R5 — Reorganização do Dashboard e nova identidade visual

**Problemas tratados:** P5, P6, P8, P10 e P11 · **Heurísticas:** H1
(visibilidade do status do sistema), H2 (correspondência com o mundo real), H4
(consistência e padrões), H8 (estética e design minimalista), H10 (ajuda e
documentação) ·
**Issue:** [#26](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/26)

Esta é a maior melhoria do redesign. Ela partiu de duas fontes: os problemas
P5, P6, P8, P10 e P11 da avaliação heurística, e uma direção visual pedida pelo
grupo (tema escuro, cartões de vidro, números em destaque, gráficos com
degradê, cores fortes, foto dos candidatos, gráficos circulares). A direção
visual foi aplicada **depois** da avaliação e ajustada aos problemas
encontrados, para que o redesign não fosse só cosmético.

### Dashboard: o que mudou e por quê

| | Antes | Depois | Heurística |
|---|---|---|---|
| Resposta principal ("o nosso candidato está ganhando?") | escondida no meio dos gráficos | primeiro bloco: **Resultado do candidato foco**, com a foto dentro de um anel que preenche até o percentual, o status (▲ Lidera / = Empate / ▼ Perde), a posição ("1º de 3") e a frase pronta ("27,3 pontos à frente de Josias Melo.") | H1 |
| Ordem dos blocos | 9 blocos com o mesmo peso, sem ordem de leitura | seções na ordem da história: Resultado → Andamento da coleta → Intenção de voto → Território → Perfil da amostra → Tendência, cada uma com título e uma linha dizendo que pergunta responde | H8 |
| Intenção de voto | barras com todos os candidatos na mesma cor | ranking com foto, nome, partido, barra e percentual grande; **só o foco tem cor** (verde se lidera, âmbar se empata, vermelho se perde), concorrentes em cinza; ao passar o mouse aparece a quantidade de votos | H1, H8 |
| Base amostral (P5) | percentuais sem dizer quantas entrevistas os sustentam | "Base: N entrevistados" em cada cartão; no Território, o número de entrevistas de cada bairro e o selo **Amostra pequena** (menos de 5 entrevistas, com borda tracejada) | H2 |
| Gráfico por bairro + 2 mapas (P6) | três blocos mostrando o mesmo dado | um único bloco **Território**, com o resumo "Lidera em 6 · Empata em 0 · Perde em 5" e um cartão por bairro | H8 |
| Critério Lidera/Empate/Perde (P8) | não explicado | explicado no topo do bloco Território | H10 |
| Tooltip (P10) | "percentualEstadual : 66.7%" (nome interno do código) | "Federal" / "Estadual" / "Intenção de voto", com vírgula decimal e o número de entrevistas do dia | H2 |
| Evolução (P11) | desenhava 0% nos dias sem coleta, como se o candidato tivesse caído | os dias sem coleta ficam sem valor; linha contínua liga dias seguidos com coleta e uma linha **tracejada** atravessa os dias sem medição; se o período não tem coleta nenhuma, aparece um aviso com a data da última coleta | H1, H2 |
| Perfil da amostra | não existia | duas roscas (sexo e faixa etária), com o total no centro, os valores na legenda e a linha "Maior grupo: …" | H1 |
| Navegação dentro do Dashboard | rolar a página inteira | a barra lateral fica fixa e mostra atalhos para cada seção, destacando a que está na tela | H6, H7 |

### Identidade visual do sistema

- **Tema escuro em todas as telas** (login, painel e coleta), com fundo em
  degradê azul-noite, textura de grão e cartões de vidro. A coleta chegou a ter
  uma versão clara própria, pensada para o uso sob o sol, mas ela quebrava a
  consistência com o login e o painel (H4). A coleta passou a ser escura, e a
  opção de tema claro ficou para a funcionalidade de alternar tema, na Etapa 2.
- **Logo oficial** do sistema (`public/icons/icon-512.png`) na barra lateral, no
  login e na barra superior da coleta.
- **Uma única família tipográfica** (Manrope) no sistema inteiro; a hierarquia
  vem do tamanho e do peso. A Manrope tem algarismos de largura fixa (recurso
  `tnum`, conferido no arquivo da fonte), o que alinha colunas de percentuais.
- **Regra de cor única:** ciano e violeta identificam o cargo (federal e
  estadual); verde, âmbar e vermelho dizem apenas o resultado do candidato foco,
  sempre acompanhados de ícone e texto; cinza é contexto. A cor nunca indica a
  posição no ranking, para não ter dois significados.

### Verificação das cores (medida, não estimada)

- As cores das séries e das roscas passaram no validador de paleta usado no
  projeto (separação para daltonismo, faixa de luminosidade e contraste com o
  fundo). A primeira dupla testada para federal/estadual (azul e violeta claros)
  **reprovou** na separação para deuteranopia e foi trocada por ciano `#0aa2c0` e
  violeta `#a855f7`.
- Todos os textos foram medidos pela fórmula de contraste do WCAG contra a
  superfície real do cartão. Um caso ficou abaixo do mínimo (o nome do
  candidato estadual em violeta, 4,30:1) e foi corrigido: o nome passou a usar a
  cor de texto, e a cor da série ficou só na barra.

| Exemplos de contraste (tema escuro) | Razão |
|---|---|
| Texto principal sobre o cartão | 14,43:1 |
| Texto secundário sobre o cartão | 6,63:1 |
| Selo "Lidera" / "Empate" / "Perde" | 9,49 / 9,31 / 7,84:1 |
| Branco sobre botão principal | 5,17:1 |

### Evidências

| Tela | Antes | Depois |
|---|---|---|
| Dashboard (vídeo, do topo ao fim) | [`antes/…-dashboard-completo.mp4`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-completo.mp4) | [`depois/…-dashboard-completo.mp4`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-dashboard-completo.mp4) |
| Topo do Dashboard | [`antes/…-dashboard-topo.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-topo.png) | [`depois/…-dashboard-topo.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-dashboard-topo.png) |
| Intenção de voto | [`antes/…-dashboard-graficos.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-graficos.png) | [`depois/…-dashboard-intencao.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-dashboard-intencao.png) |
| Por bairro | [`antes/…-dashboard-por-bairro.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-por-bairro.png), [`antes/…-dashboard-mapas.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-mapas.png) | [`depois/…-dashboard-territorio.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-dashboard-territorio.png) |
| Tooltip e evolução | [`antes/…-dashboard-tooltip.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-tooltip.png), [`antes/…-dashboard-graficos.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dashboard-graficos.png) | [`depois/…-dashboard-tendencia.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-dashboard-tendencia.png) |
| Perfil da amostra | (não existia) | [`depois/…-dashboard-perfil.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-dashboard-perfil.png) |
| Candidatos | [`antes/…-candidatos.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-candidatos.png) | [`depois/…-candidatos.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-candidatos.png) |
| Dados | [`antes/…-dados.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-dados.png) | [`depois/…-dados.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-dados.png) |
| Login | [`antes/…-login.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-login.png) | [`depois/…-login.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-login.png) |
| Coleta | [`antes/…-coleta-parte1.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-coleta-parte1.png), [`antes/…-coleta-parte2.png`](evidencias/R5-dashboard-e-identidade/antes/tp4-redesign-antes-coleta-parte2.png) | [`depois/…-coleta.png`](evidencias/R5-dashboard-e-identidade/depois/tp4-redesign-depois-coleta.png) |

No print da tendência, o tooltip ainda aparece com ponto decimal ("100.0%");
isso foi corrigido logo depois da captura, e o tooltip passou a usar vírgula,
como o resto do painel.

### O que mudou no código

- **Componentes novos do Dashboard:** `ResultadoFoco.jsx`, `RankingIntencao.jsx`,
  `DesempenhoPorBairro.jsx`, `PerfilAmostra.jsx`, `SeloStatus.jsx` e
  `secoesDashboard.js` (a lista de seções, usada também pelos atalhos da barra
  lateral).
- **Removidos:** `GraficoIntencaoVoto.jsx`, `GraficoPorBairro.jsx`,
  `MapaCalor.jsx` e `truncarRotulo.js`, substituídos pelos componentes acima.
- **Cálculos novos** em `agregacoes.js`: `calcularResultadoFoco`,
  `calcularDesempenhoPorBairro` e `calcularPerfil`; `calcularEvolucao` passou a
  devolver vazio (`null`) nos dias sem coleta.
- **Tema:** tokens do tema escuro em `src/styles/theme.css`, aplicados com
  `data-tema="escuro"` nas três telas; componentes usam só tokens de cor.
- **Barra lateral** (`Sidebar.jsx`) fixa, com a logo oficial e os atalhos de
  seção; **barra superior da coleta** (`BarraTopo.jsx`) com o mesmo visual.

**Testes:** 43/43 passando, com novos testes para o resultado do foco, o
desempenho por bairro, o perfil da amostra, o ranking e a evolução sem dias
falsos em 0%.

## R6 — Encerrar a sessão de conta sem perfil na tela de login

**Problema tratado:** P7 · **Heurísticas:** H3 (controle e liberdade do
usuário), H9 (ajudar a reconhecer, diagnosticar e corrigir erros) ·
**Issue:** [#24](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/24)

| | Antes | Depois |
|---|---|---|
| Sessão da conta sem perfil | continuava ativa; a cada abertura do app, o mesmo erro voltava sozinho | é encerrada automaticamente (`sair()`) assim que a falta de perfil é detectada |
| Mensagem | "Sua conta não tem um perfil cadastrado. Contate o administrador." | "Sua conta não tem um perfil cadastrado no sistema. Peça ao administrador para liberar o acesso ou entre com outra conta.", que diz o que fazer em seguida |
| Evidência | [`antes/tp4-redesign-antes-login-codigo-sem-role.png`](evidencias/R6-login-sem-perfil/antes/tp4-redesign-antes-login-codigo-sem-role.png) | [`depois/tp4-redesign-depois-login-codigo-sem-role.png`](evidencias/R6-login-sem-perfil/depois/tp4-redesign-depois-login-codigo-sem-role.png), [`depois/tp4-redesign-depois-login-testes.png`](evidencias/R6-login-sem-perfil/depois/tp4-redesign-depois-login-testes.png) |

A evidência desta melhoria é o código mais os testes automatizados, porque
reproduzir na interface exigiria criar uma conta no Firebase Auth sem perfil no
Firestore só para a demonstração.

**Correção da avaliação:** ao implementar, verificamos que a conta sem perfil
não ficava presa, como dizia a primeira versão do P7: o formulário continuava
habilitado e era possível digitar outra conta. A descrição do P7 em
[`avaliacao-heuristica.md`](avaliacao-heuristica.md) foi ajustada para o problema
real, a sessão mantida.

**Testes:** `src/pages/Login/PaginaLogin.test.jsx`, com 2 novos testes (a
sessão é encerrada para a conta sem perfil, e não é encerrada para quem tem
perfil). Suíte completa: 33/33.
