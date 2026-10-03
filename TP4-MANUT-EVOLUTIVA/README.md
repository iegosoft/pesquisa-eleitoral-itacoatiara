# TP4 — Manutenção Evolutiva

Trabalho prático 4 da disciplina Manutenção e Integração de Software (UFAM),
aplicado ao sistema Pesquisa Eleitoral Itacoatiara. Cada etapa do enunciado tem
uma pasta própria, com os documentos e as evidências dela.

## Etapa 1 — Redesign ([`etapa1-redesign/`](etapa1-redesign/))

| Documento | Conteúdo |
|---|---|
| [`avaliacao-heuristica.md`](etapa1-redesign/avaliacao-heuristica.md) | Avaliação do sistema original pelas 10 heurísticas de Nielsen: pontos fortes, problemas (P1–P11) com severidade e as melhorias planejadas |
| [`redesign.md`](etapa1-redesign/redesign.md) | Cada melhoria implementada (R1–R6), com a heurística que atende e a comparação antes/depois |

As evidências ficam em `etapa1-redesign/evidencias/`, uma pasta por melhoria,
cada uma com `antes/` e `depois/`:

| Melhoria | Problemas | Pasta de evidências | Issue | Pull Request |
|---|---|---|---|---|
| R1 — Rotas reais no painel administrativo | P1 | [`R1-rotas-admin/`](etapa1-redesign/evidencias/R1-rotas-admin/) | [#18](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/18) | [#19](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/19) |
| R2 e R3 — Controle dos moradores e aviso do que falta na coleta | P2, P3 | [`R2-R3-formulario-coleta/`](etapa1-redesign/evidencias/R2-R3-formulario-coleta/) | [#20](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/20) | [#21](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/21) |
| R4 — Validação do intervalo de datas | P4 | [`R4-filtro-datas/`](etapa1-redesign/evidencias/R4-filtro-datas/) | [#22](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/22) | [#23](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/23) |
| R5 — Reorganização do Dashboard e nova identidade visual | P5, P6, P8, P10, P11 | [`R5-dashboard-e-identidade/`](etapa1-redesign/evidencias/R5-dashboard-e-identidade/) | [#26](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/26) | — |
| R6 — Encerrar a sessão de conta sem perfil | P7 | [`R6-login-sem-perfil/`](etapa1-redesign/evidencias/R6-login-sem-perfil/) | [#24](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/24) | [#25](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/25) |

Os arquivos de evidência seguem o padrão
`tp4-redesign-<antes|depois>-<tela-ou-situação>.<png|mp4>`.

## Etapa 2 — Manutenção evolutiva e acessibilidade

Em andamento.
