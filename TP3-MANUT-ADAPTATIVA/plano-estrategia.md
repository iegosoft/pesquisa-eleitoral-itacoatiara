# Plano de Estratégia Adaptativa

## Objetivo

Aplicar manutenção adaptativa sobre o sistema Pesquisa Eleitoral Itacoatiara, ajustando-o
a três tipos de mudança externa que não dependem de nenhum defeito do sistema: mudança
de versão de uma dependência, mudança de exigência regulatória/legal, e mudança/migração
de integração com uma API externa. Nenhuma das três estratégias corrige um comportamento
incorreto — todas respondem a uma mudança que vem de fora do controle da equipe.

## Diagnóstico prévio (o que já existe hoje)

- **Dependências**: `react`, `react-dom`, `react-router-dom`, `firebase`, `exceljs`,
  `papaparse`, `recharts`, mais o ferramental de build (`vite`, `vitest`, `oxlint`). Uma
  checagem contra o registro do npm (setembro/2026) mostrou que todas já estão na
  versão major mais recente disponível — não há incompatibilidade real pendente para
  demonstrar em nenhuma delas hoje.
- **API externa**: nenhuma chamada a API de terceiros existe no código (`fetch`, `axios`
  e `XMLHttpRequest` não aparecem em nenhum lugar de `src/`). O único serviço externo é o
  Firebase, que é a própria infraestrutura de backend do sistema, não uma integração de
  terceiros no sentido do enunciado.
- **Regulamentação**: o sistema coleta dado pessoal de terceiros (sexo, faixa etária,
  intenção de voto, bairro) sem nenhum mecanismo de consentimento do entrevistado, e os
  formulários administrativos não têm cuidado formal de acessibilidade (labels
  associados aos campos, contraste mínimo).

## Estratégia 1 — Mudança de dependência: `date-fns`

**Decisão**: como nenhuma dependência existente tem uma atualização major pendente com
incompatibilidade real, aplicamos a alternativa prevista no próprio enunciado: introduzir
uma biblioteca auxiliar de formatação de datas. O sistema já formata datas manualmente
(`toLocaleDateString`) em vários pontos (última coleta, evolução do candidato foco); a
introdução de `date-fns` centraliza essa formatação.

- Instalar `date-fns` na versão 2.x, usá-la para formatar pelo menos um ponto real do
  sistema, e registrar em vídeo o funcionamento nessa versão.
- Atualizar para a versão 4.x (mais recente). A mudança de v2 para v3 alterou a estrutura
  de importação dos módulos de locale (`date-fns/locale/pt-BR`), o que gera um erro de
  importação real e documentado — não simulado.
- Corrigir a importação para o formato exigido pela versão nova, com vídeo do erro antes
  e do funcionamento depois.
- Evidência: `evidencia1.md`.

## Estratégia 2 — Mudança de regulamentação (duas funcionalidades)

**Funcionalidade A — Consentimento do entrevistado.** O sistema coleta dado pessoal de
terceiros (sexo, faixa etária, intenção de voto) durante a coleta em campo, sem nenhum
registro de consentimento. Adicionamos uma marcação de consentimento no formulário de
coleta (`/coleta`), obrigatória antes de salvar a resposta, simulando adequação a uma
exigência de proteção de dados pessoais (LGPD).

**Funcionalidade B — Acessibilidade nos formulários administrativos.** Os formulários do
painel administrativo (cadastro de candidato, filtros do dashboard) são auditados quanto
a labels associados aos campos e contraste mínimo de texto, e corrigidos onde necessário,
simulando adequação a uma exigência de acessibilidade digital.

- Evidência: `evidencia2.md`.

## Estratégia 3 — Migração/simulação de API externa: ViaCEP

**Decisão**: como o sistema não consome nenhuma API externa hoje, aplicamos a alternativa
prevista no enunciado: simular integração com uma API pública simples. Escolhemos o
ViaCEP (`https://viacep.com.br`) por ser tematicamente compatível — o sistema já cadastra
residências por bairro, e a busca de CEP preenche automaticamente parte desse endereço.

- Testar a requisição no Postman antes de qualquer código (`GET
  https://viacep.com.br/ws/{cep}/json/`), com print ou exportação JSON da resposta.
- Implementar a busca de CEP no formulário de cadastro de residência, com tratamento de
  erro para CEP inválido ou não encontrado.
- Evidência: `evidencia3.md`.

## Rastreabilidade e boas práticas (consistentes com TP1 e TP2)

- Cada estratégia é implementada em uma branch própria, nunca diretamente na `main`.
- Cada estratégia tem uma Issue no GitHub descrevendo a mudança externa simulada e o que
  será ajustado.
- Testes automatizados cobrindo o comportamento novo, sem quebrar a suíte existente.
- Pull Request por estratégia, linkando a Issue correspondente, revisado antes do merge.
- Vídeos e prints de antes/depois versionados em `TP3-MANUT-ADAPTATIVA/midias/`.

## Visão de longo prazo

As três estratégias preparam o sistema para classes de mudança que são certas de
acontecer, mais cedo ou mais tarde, independente de qualquer bug:

- Dependências continuarão sendo atualizadas ao longo da vida do projeto; centralizar a
  formatação de datas numa biblioteca testada reduz o custo de absorver essas mudanças no
  futuro, em vez de ter lógica de data espalhada e formatada manualmente em cada tela.
- Exigências regulatórias sobre dado pessoal tendem a aumentar, não diminuir, para um
  sistema que coleta opinião política de eleitores identificáveis por bairro; ter um
  ponto único de consentimento facilita adaptar a política de privacidade no futuro sem
  reescrever o fluxo de coleta inteiro.
- Se o sistema um dia precisar trocar de provedor de CEP, ou adicionar outras integrações
  externas (ex.: validação de CPF, geolocalização), a estrutura de serviço isolado criada
  para o ViaCEP já estabelece o padrão a seguir, em vez de cada integração futura
  reinventar sua própria forma de lidar com API externa.
