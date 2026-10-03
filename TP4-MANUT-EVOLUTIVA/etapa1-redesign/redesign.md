# Redesign — melhorias de interface (antes e depois)

Cada melhoria abaixo corrige um ou mais problemas encontrados na
[avaliação heurística](avaliacao-heuristica.md) e indica quais heurísticas de
Nielsen ela atende. As evidências de "antes" foram gravadas no sistema
publicado (Vercel), e as de "depois" no ambiente local (`npm run dev`) da branch
de cada melhoria, antes do merge.

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
