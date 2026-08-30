# Bugs e Classificação — Investigação Inicial

Ferramentas de apoio usadas: **Dependabot** (obrigatório, ativado em Settings → Security → Code
security and analysis) e `npm audit` (usado localmente pra antecipar o que o Dependabot ia acusar,
antes mesmo dele terminar de escanear o repositório).

## Bug 1 — Filtro de data do Dashboard não filtra nada

- **Tipo:** Lógico
- **Local:** `src/pages/Admin/Dashboard/agregacoes.js`, função `aplicarFiltros` (linhas 6-7)
- **Descrição:** os campos "De" e "Até" do dashboard (`<input type="date">`) produzem uma string no
  formato `AAAA-MM-DD`, mas `aplicarFiltros` compara essa string diretamente com
  `resposta.dataColeta`, que é um objeto `Date`. Em JavaScript, `Date < string` converte a string com
  `ToNumber`, que retorna `NaN` para esse formato — a comparação nunca é verdadeira. Resultado: o
  filtro de intervalo de datas nunca exclui nenhum registro, mas a interface não avisa nada, dando a
  falsa impressão de que funcionou. Viola o requisito RF22 (`docs/requisitos.md`).
- **Como encontramos:** revisão manual de código.

## Bug 2 — Login trava indefinidamente sem erro se o usuário não tem perfil no Firestore

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
  (print anexado na issue correspondente, antes e depois da correção).
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
