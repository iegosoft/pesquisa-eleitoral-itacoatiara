# Integração contínua (CI)

Como funciona a integração contínua do projeto Pesquisa Eleitoral Itacoatiara:
o que roda, quando roda, como ler o resultado e o que fazer quando falha.

## O que é

A cada Pull Request e a cada push na `main`, o GitHub liga uma máquina nova e
vazia, baixa o projeto, instala tudo e roda as verificações. Se alguma falha,
a PR fica marcada com um X vermelho e não pode ser mesclada. Assim, código que
quebra o lint, os testes ou o build não chega à `main`, sem depender de alguém
lembrar de rodar tudo à mão.

## O que roda

| Nome no GitHub | Arquivo | Quando roda | O que faz | Bloqueia a PR? |
|---|---|---|---|---|
| **CI** | [`ci.yml`](../.github/workflows/ci.yml) | Toda PR e todo push na `main` | Lint, testes com cobertura e build | Sim |
| **Segurança** | [`seguranca.yml`](../.github/workflows/seguranca.yml) | Toda PR, todo push na `main` e toda segunda-feira | `npm audit` das bibliotecas | Não: só avisa |
| **Dependabot** | [`dependabot.yml`](../.github/dependabot.yml) | Toda segunda-feira (bibliotecas) e todo mês (ações) | Abre PRs de atualização, que passam pelo CI | — |

### Etapas do CI

1. **Baixar o código** da PR.
2. **Instalar o Node.js** 22, com cache das bibliotecas já baixadas em
   execuções anteriores.
3. **Instalar as dependências** (`npm ci`), exatamente as versões do
   `package-lock.json`.
4. **Lint** (`npm run lint`): o oxlint procura erros e más práticas no código.
5. **Testes e cobertura** (`npm run test:coverage`): roda todos os testes do
   Vitest e mede quanto do código eles executam.
6. **Guardar relatório de cobertura**: a página HTML da cobertura fica para
   download na execução.
7. **Build** (`npm run build`): confere se o site compila para produção.

Se uma etapa falha, as seguintes não rodam.

### Proteção da `main`

Configurada em *Settings › Branches* do repositório (não é um arquivo):

- só mescla PR com o check **Lint, testes e build** aprovado;
- vale para todos, inclusive administradores;
- não aceita `push --force` nem apagar a `main`.

A auditoria de segurança não está entre os checks obrigatórios: ela mostra o
relatório completo, mas só fica vermelha com vulnerabilidade crítica em
biblioteca de produção.

## Como ler o resultado

- Na página da PR, no fim: **All checks have passed** (verde) ou **Some checks
  were not successful** (vermelho).
- Clique em **Details** ao lado do check para ver cada etapa e o log.
- A tabela de cobertura está no log da etapa **Testes e cobertura**. A versão
  completa está em **Artifacts**, no fim da página da execução
  (`relatorio-cobertura`): baixe e abra o `index.html`.
- O relatório do `npm audit` está no resumo (**Summary**) da execução da
  Segurança.

## Quando o CI falha

1. Abra o **Details** e veja qual etapa falhou e a mensagem de erro.
2. Rode o mesmo comando no seu computador:

   ```
   npm run lint
   npm test
   npm run build
   ```

3. Corrija, faça o commit e envie para a mesma branch: o CI roda de novo
   sozinho.

No computador, os testes usam as chaves do seu `.env`. No CI, como o `.env`
não vai para o repositório, a etapa de testes usa chaves fictícias do Firebase:
os testes não acessam o banco.

## Rodando no computador

| Comando | O que faz |
|---|---|
| `npm run lint` | Lint |
| `npm test` | Testes |
| `npm run test:coverage` | Testes com cobertura (página em `coverage/index.html`) |
| `npm run build` | Build de produção |
| `npm audit` | Vulnerabilidades conhecidas nas bibliotecas |

## Quem fez cada parte

| Parte | Responsável | Pull Request |
|---|---|---|
| Pipeline base e proteção da `main` | Iêgo Sérgio | [#40](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/40) |
| Dependabot e auditoria de segurança | Luan Serrão | [#44](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/44) |
| Cobertura de testes e demonstração da PR barrada | Karina Lopes | [#53](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/53) |
| Cache e comparação Actions × Jenkins | José André | [#42](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/42) |
| Esta documentação, selos e CHANGELOG | Luiz Augusto | esta PR |

## Veja também

- [Cache do CI e comparação: GitHub Actions × Jenkins](comparacao-actions-jenkins.md)