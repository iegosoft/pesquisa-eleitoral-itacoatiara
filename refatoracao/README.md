# TP5 — Refatoração

Trabalho prático 5 da disciplina Manutenção e Integração de Software (UFAM),
aplicado ao sistema Pesquisa Eleitoral Itacoatiara. Refatorar é mudar a
estrutura interna do código **sem mudar o comportamento** que o usuário vê.

| Documento | Conteúdo |
|---|---|
| [`relatorio.md`](relatorio.md) | Relatório final: resumo, justificativas, links para o código, aprendizados |
| [`code-smells.md`](code-smells.md) | Code smells encontrados antes de refatorar, com o porquê de cada um |
| [`refatoracoes.md`](refatoracoes.md) | Cada refatoração, com o trecho antes e depois, o par neutro A/B e a separação entre planejadas e oportunistas |
| [`evidencias/`](evidencias/) | Testes e vídeo do sistema antes e depois, mostrando que o comportamento não mudou |

## Como verificar que o comportamento não mudou

1. A suíte de testes automatizados (62 testes) passa antes e depois, sem
   alteração nos testes de comportamento: `npm test`.
2. O vídeo do sistema antes e depois segue o mesmo roteiro (Dashboard, cliques
   em candidato e bairro, Entrevistas, login e coleta).
