# Changelog

Todas as mudanças relevantes do sistema Pesquisa Eleitoral Itacoatiara, agrupadas
por entrega da disciplina Manutenção e Integração de Software. Formato baseado em
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Cada item aponta
para o Pull Request que fez a mudança.

## [TP4 — Manutenção evolutiva] — 2026-10-04

Documentação completa em [`TP4-MANUT-EVOLUTIVA/`](TP4-MANUT-EVOLUTIVA/).

### Adicionado

- Seção **Entrevistas** no painel administrativo: lista de casas e moradores
  com filtros por bairro e pesquisador; corrigir as respostas de um morador e
  excluir um morador ou a casa inteira, sempre com confirmação
  ([#33](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/33)).
- **Dashboard interativo**: clicar num bairro filtra o painel inteiro; clicar
  num candidato abre o desempenho dele bairro a bairro
  ([#35](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/35)).
- **Alternar tema claro/escuro** em todas as telas, com a escolha salva no
  aparelho e seguindo a preferência do sistema no primeiro acesso
  ([#31](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/31)).
- **Acessibilidade**: link "Pular para o conteúdo", foco e título da aba ao
  trocar de seção, contorno de foco no envio de arquivo e tabela alternativa
  ao gráfico de tendência
  ([#29](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/29)).
- No Dashboard: quadro **Resultado do candidato foco** (foto em anel,
  status, posição e diferença em pontos), seção **Perfil da amostra** (roscas
  de sexo e faixa etária) e atalhos de seção na barra lateral
  ([#27](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/27)).
- Na coleta: botão para remover um morador e aviso "Para salvar esta casa,
  falta:" com os campos pendentes
  ([#21](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/21)).
- Botão "Limpar filtros" no Dashboard
  ([#23](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/23)).

### Alterado

- Redesign do Dashboard: seções na ordem da leitura, ranking de intenção com
  foto e partido, bloco **Território** (unindo o gráfico por bairro e os dois
  mapas de calor), base amostral em todos os percentuais e explicação do
  critério Lidera/Empate/Perde
  ([#27](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/27)).
- Nova identidade visual: tema escuro com textura, uma única fonte (Manrope),
  logo oficial e cores de série validadas para daltonismo e para contraste
  WCAG AA ([#27](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/27),
  [#31](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/31)).
- Cada seção do painel administrativo passa a ter endereço próprio
  (`/admin/dashboard`, `/admin/candidatos`, `/admin/dados`,
  `/admin/entrevistas`)
  ([#19](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/19)).

### Corrigido

- Recarregar a página ou usar o botão Voltar no painel não troca mais de seção
  sozinho ([#19](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/19)).
- A coleta não aceita mais entrevistados acima da quantidade de moradores da
  casa ([#21](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/21)).
- Intervalo de datas invertido nos filtros não zera mais o painel; uma
  mensagem explica o erro
  ([#23](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/23)).
- A sessão de uma conta sem perfil cadastrado é encerrada, em vez de o erro
  voltar a cada abertura do app
  ([#25](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/25)).
- O gráfico de evolução não desenha mais 0% em dias sem coleta, e os tooltips
  não mostram mais nomes internos do código
  ([#27](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/27)).

### Removido

- Gráfico "Intenção do candidato foco por bairro" e os dois mapas de calor,
  substituídos pelo bloco Território
  ([#27](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/27)).

## [TP3 — Manutenção adaptativa] — 2026-09-20

Documentação em [`TP3-MANUT-ADAPTATIVA/`](TP3-MANUT-ADAPTATIVA/).

### Adicionado

- Busca de endereço por CEP (ViaCEP) no formulário de coleta, preenchendo o
  bairro quando ele já está cadastrado
  ([#17](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/17)).
- Consentimento obrigatório do entrevistado antes de salvar a casa (LGPD)
  ([#15](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/15)).

### Alterado

- `date-fns` atualizado da versão 1 para a 4, com a sintaxe nova
  ([#13](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/13)).
- Rótulos dos campos da coleta ligados semanticamente aos campos e contraste
  do mapa de calor corrigido (WCAG AA)
  ([#15](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/15)).

## [TP2 — Manutenção preventiva] — 2026-09-07

Documentação em [`TP2-MANUT-PREVENTIVA/`](TP2-MANUT-PREVENTIVA/).

### Alterado

- O resumo do painel usa a contagem agregada do Firestore em vez de baixar
  todos os entrevistados
  ([#11](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/11)).

## [TP1 — Manutenção corretiva] — 2026-08-30

Documentação em [`TP1-MANUT-CORRETIVA/`](TP1-MANUT-CORRETIVA/).

### Corrigido

- Login travado em "Entrando..." para conta sem papel cadastrado
  ([#5](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/5)).
- Nome longo de candidato cortando o texto e o selo FOCO no gráfico
  ([#6](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/6)).
- Dependência `uuid` vulnerável, com teste de regressão
  ([#7](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/7),
  [#8](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/8)).
