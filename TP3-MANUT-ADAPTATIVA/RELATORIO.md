# Relatório Final — TP3: Manutenção Adaptativa

## Resumo

Aplicadas três estratégias de manutenção adaptativa sobre o sistema Pesquisa
Eleitoral Itacoatiara, respondendo a três tipos de mudança externa que não
dependem de nenhum defeito do sistema: mudança de versão de uma dependência,
mudança de exigência regulatória, e integração com uma API externa. Nenhuma
das três corrige um comportamento incorreto — todas antecipam ou respondem a
uma mudança que vem de fora do controle da equipe. Diagnóstico completo em
`plano-estrategia.md`.

## Estratégia 1 — Mudança de dependência (`date-fns`)

**O que mudou.** O sistema usava a versão 1 do `date-fns` (2017), com sintaxe
já obsoleta (tokens de formatação em maiúsculo, locale genérico `pt`). Ao
atualizar para a versão mais recente (4.4.0), o código antigo passou a lançar
um `RangeError` real — reproduzido tanto pela suíte de testes quanto ao vivo
no navegador. Corrigido para a sintaxe atual (locale `ptBR`, tokens em
minúsculo).

**Rastreabilidade:** [Issue #12](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/12) ·
branch `adaptativa/dependencia-date-fns` ·
[PR #13](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/13) ·
evidências e detalhes em [`evidencia1.md`](evidencia1.md).

## Estratégia 2 — Mudança de regulamentação (consentimento + acessibilidade)

**O que mudou.** Duas funcionalidades adaptadas a uma exigência regulatória
plausível para um sistema que coleta dado pessoal de terceiros:

- **Consentimento do entrevistado**: a casa só pode ser salva depois que um
  campo de consentimento obrigatório é marcado no formulário de coleta.
- **Acessibilidade**: campos do formulário passam a ter ligação semântica real
  com seus rótulos (`<label htmlFor>` / `<fieldset><legend>`, em vez de
  `<span>` solto), e o texto do mapa de calor do painel passa a ter contraste
  suficiente (WCAG AA) nos status "empate" e "sem dados", que antes falhavam
  em 2,15:1 e 1,48:1 — medidos pela fórmula oficial de contraste relativo.

**Rastreabilidade:** [Issue #14](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/14) ·
branch `adaptativa/regulamentacao-consentimento-acessibilidade` ·
[PR #15](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/15) ·
evidências e detalhes em [`evidencia2.md`](evidencia2.md).

## Estratégia 3 — Integração com API externa (ViaCEP)

**O que mudou.** O sistema não consumia nenhuma API externa (confirmado por
busca no código). Adicionado um campo de CEP opcional no formulário de coleta,
que busca o endereço no ViaCEP e tenta preencher o bairro automaticamente —
só quando o bairro retornado já está na lista cadastrada no sistema; caso
contrário, avisa o pesquisador e mantém a seleção manual, sem nunca preencher
errado. A integração foi testada no Postman, com CEPs reais de
Itacoatiara-AM, antes de ser incorporada ao sistema.

**Rastreabilidade:** [Issue #16](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/16) ·
branch `adaptativa/api-viacep` ·
[PR #17](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/17) ·
evidências e detalhes em [`evidencia3.md`](evidencia3.md).

## Preservação funcional

Em nenhuma das três estratégias o comportamento existente foi removido ou
quebrado para quem já usava o sistema:

- Estratégia 1: o valor exibido ("última coleta") continua o mesmo, só a
  implementação interna mudou.
- Estratégia 2: o fluxo de coleta continua o mesmo, só passou a exigir uma
  marcação a mais (consentimento) antes de salvar.
- Estratégia 3: o campo de CEP é opcional — quem não usar continua
  escolhendo o bairro manualmente, exatamente como antes.

Suíte completa de testes automatizados: **20/20 passando** após as três
estratégias, incluindo 12 novos testes escritos especificamente para elas
(4 na Estratégia 1, 3 na Estratégia 2, 5 na Estratégia 3).

## Reflexão crítica

As três estratégias têm naturezas bem diferentes, e isso foi proposital:

- A **dependência** exigiu investigação real antes de encontrar uma
  incompatibilidade genuína — as primeiras tentativas (versões mais próximas
  da instalada) não quebravam nada, e só a diferença entre a v1 e a v4 gerou
  um erro reproduzível. Preferimos gastar mais tempo procurando uma quebra
  real a apresentar uma incompatibilidade forçada ou artificial.
- A **regulamentação** foi a estratégia mais fácil de justificar: o sistema
  lida com dado pessoal de terceiros, então consentimento e acessibilidade
  não são burocracia — são risco real de exposição legal e de exclusão de
  usuários com deficiência.
- A **API externa** expôs uma decisão de design interessante: nem sempre a
  automação deve substituir a decisão humana. Quando o bairro devolvido pela
  API não corresponde a nenhum da lista já usada pela pesquisa, o sistema
  prefere avisar e pedir confirmação a preencher algo potencialmente errado.

Em comum, as três reforçam a ideia central de manutenção adaptativa: nenhuma
delas corrigiu um problema que já existia — todas prepararam o sistema para
continuar funcionando (ou funcionar melhor) diante de mudanças que vêm de
fora do controle da equipe: uma biblioteca que evolui, uma lei que muda, um
serviço externo que passa a fazer parte do fluxo de trabalho.

## Nota sobre organização dos arquivos

O enunciado oficial referencia os caminhos `manutenção-adaptativa/` e
`RELATORIO.md` na raiz do repositório. Por decisão do grupo, e para manter a
mesma convenção adotada no TP1 e no TP2, esses documentos foram organizados
em `TP3-MANUT-ADAPTATIVA/`. O conteúdo exigido pelo enunciado foi mantido
integralmente; apenas o caminho do diretório foi adaptado.
