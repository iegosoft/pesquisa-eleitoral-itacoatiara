# Mapa de Arquivos Alterados — TP3

Lista, por estratégia, todos os arquivos do sistema (`src/`, arquivos de configuração
etc.) criados ou modificados durante a manutenção adaptativa. Serve como referência
rápida para conferência, sem precisar navegar pelo diff completo de cada Pull Request.

Preenchido progressivamente, conforme cada estratégia é implementada.

## Estratégia 1 — Mudança de dependência (`date-fns`)

- `package.json` — adiciona `date-fns` (instalado em v1.30.1, atualizado para v4.4.0).
- `package-lock.json` — atualizado automaticamente pelo npm.
- `src/pages/Admin/Dashboard/agregacoes.js` — `formatarUltimaColeta` passa a usar
  `isToday`/`isYesterday`/`format` do `date-fns` no lugar da comparação manual de
  datas; import de locale ajustado de `date-fns/locale/pt` (v1) para
  `{ ptBR } from 'date-fns/locale'` (v4), e tokens de `format` de `DD/MM/YYYY` (v1)
  para `dd/MM/yyyy` (v4).

## Estratégia 2 — Mudança de regulamentação

_A preencher durante a execução._

## Estratégia 3 — Migração/simulação de API externa (ViaCEP)

_A preencher durante a execução._
