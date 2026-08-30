# Bugs e Classificação — Investigação Inicial

Ferramentas de apoio usadas: **Dependabot** (obrigatório, ativado em Settings → Security → Code
security and analysis) e `npm audit` (usado localmente pra antecipar o que o Dependabot ia acusar,
antes mesmo dele terminar de escanear o repositório).

## Bug 1 — Nome de candidato longo corta o texto e o selo FOCO no gráfico do Dashboard

**Issue:** [#4](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/4)

- **Tipo:** Lógico (defeito visual)
- **Local:** `src/pages/Admin/Dashboard/GraficoIntencaoVoto.jsx`, componente `RotuloCandidato`
- **Descrição:** o rótulo do candidato no gráfico de ranking usa `textAnchor="end"` ancorado num `x`
  fixo, sem nenhum limite de largura, truncamento ou `text-overflow`. Para nomes longos, o texto cresce
  livremente para a esquerda e ultrapassa a área visível do SVG, sendo cortado — e o selo "FOCO"
  (posicionado relativo ao mesmo `x`) é cortado junto. Confirmado com print real (Puppeteer/Chrome
  headless), não é suposição — ver evidência anexada na issue.
- **Como encontramos:** revisão manual de código + verificação visual com um harness isolado do
  componente (renderizado de verdade num navegador headless).

> **Nota de retrabalho:** a primeira versão desta entrada apontava um bug diferente (comparação de
> data no filtro do Dashboard). Ao reler o código que *chama* `aplicarFiltros`
> (`PainelDashboard.jsx`), vimos que a conversão de string pra `Date` já acontece antes da chamada —
> ou seja, aquele filtro funciona corretamente na aplicação real. Isso foi registrado na
> [issue #1](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/1), fechada como
> *invalid* no GitHub, e substituído por este bug (Bug 1 deste documento), que foi verificado
> visualmente antes de virar a issue #4 — **os números não coincidem porque a #1 já existia e não foi
> reaproveitada**, a #4 é uma issue nova.

## Bug 2 — Login trava indefinidamente sem erro se o usuário não tem perfil no Firestore

**Issue:** [#2](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/2)

- **Tipo:** Lógico / Runtime
- **Local:** `src/pages/Login/PaginaLogin.jsx` (linhas 20-24 e 26-36)
- **Descrição:** se o usuário está autenticado no Firebase Auth mas não existe um documento
  correspondente em `usuarios/{uid}` (ou o documento existe sem o campo `role`) — situação real quando
  alguém cria a conta de acesso e esquece de cadastrar o papel — o `useEffect` de redirecionamento
  (que exige `role` truthy) nunca dispara, e `enviando` só é resetado pra `false` dentro do `catch` do
  `aoEnviar`, nunca no caminho de sucesso. O usuário fica preso na tela de login com o botão
  "Entrando..." desabilitado pra sempre, sem nenhuma mensagem de erro.
- **Como encontramos:** revisão manual de código.

## Bug 3 — Dependência vulnerável: `uuid` (via `exceljs`)

**Issue:** [#3](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/3)

- **Tipo:** Dependência vulnerável
- **Local:** `package.json` — dependência direta `exceljs@4.4.0`, que traz `uuid@8.3.2` como
  dependência transitiva.
- **Descrição:** o Dependabot alertou (alerta nº 1) que `uuid < 11.1.1` tem uma vulnerabilidade
  conhecida, **CVE-2026-41907** / GHSA-w5hq-g745-h8pq (CVSS 3.1: 7.5, severidade *medium* no
  Dependabot) — os métodos `v3()`/`v5()`/`v6()` da lib não validam os limites de um buffer de saída
  fornecido externamente, permitindo escrita parcial silenciosa fora do intervalo esperado. A versão
  mais recente publicada do `exceljs` (4.4.0, a mesma instalada no projeto) ainda depende de
  `uuid@^8.3.0` — não existe uma atualização direta do `exceljs` que resolva isso; a correção precisa
  forçar a versão do `uuid` via `overrides` no `package.json`.
- **Alerta gerado pela ferramenta:** [alerta nº 1 no Dependabot](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/security/dependabot/1)
  (print anexado na [issue #3](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/3), antes e depois da correção).
- **Falso positivo?** Não — a versão instalada (`uuid@8.3.2`) está dentro da faixa vulnerável
  (`< 11.1.1`) confirmada tanto pelo Dependabot quanto pelo `npm audit`, e o código do projeto usa o
  `exceljs` ativamente nas telas de exportação/importação de planilha (RF23/RF24), então a dependência
  vulnerável está de fato em uso, não é código morto.

## Outros alertas do Dependabot avaliados e descartados nesta rodada

O Dependabot também sinalizou vulnerabilidades em `brace-expansion`, `fast-uri`, `nanoid`, `postcss` e
`react-router` — todas em dependências de ferramentas de build/lint (`vite`, `oxlint`, etc.) ou
transitivas de nível profundo, sem uso direto pelo código da aplicação em produção. Não foram
transformados em bug nesta entrega para manter o escopo em 3 bugs (mínimo pedido), mas ficam
registrados aqui para uma rodada futura de manutenção.
