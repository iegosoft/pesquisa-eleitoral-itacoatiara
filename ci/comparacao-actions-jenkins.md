# Cache do CI e comparação: GitHub Actions × Jenkins

Parte do plano de integração contínua do projeto. Responsável: José André.

## 1. Cache das dependências

Cada execução do CI começa numa máquina vazia, então a etapa **Instalar as
dependências** (`npm ci`) baixa da internet as centenas de bibliotecas do
projeto toda vez.

Com `cache: npm` na etapa **Instalar o Node.js** do
[`ci.yml`](../.github/workflows/ci.yml), o GitHub guarda a pasta de downloads
do npm entre uma execução e outra, identificada pelo conteúdo do
`package-lock.json`. Nas execuções seguintes, o `npm ci` instala a partir dessa
cópia. Quando o `package-lock.json` muda (uma biblioteca nova ou atualizada),
o cache antigo deixa de valer e um novo é criado.

### Tempo medido

Medido no histórico do GitHub Actions, em execuções bem-sucedidas do CI:
duração da etapa **Instalar as dependências** e do job inteiro.

| | Execuções medidas | Instalar as dependências (média) | Job inteiro (média) |
|---|---|---|---|
| Antes (sem cache) | 2 | 22s | 1min12s |
| Depois (com cache) | a medir | a medir | a medir |

O tempo do job inteiro varia com o que cada PR muda (a cobertura de testes,
por exemplo, deixa os testes mais lentos). Por isso a comparação que mostra o
efeito do cache é a da etapa de instalação.

## 2. GitHub Actions × Jenkins

| | GitHub Actions | Jenkins |
|---|---|---|
| **Onde roda** | Em máquinas do GitHub, criadas e apagadas a cada execução | Num servidor que a própria equipe instala e mantém |
| **Instalação** | Nenhuma: basta um arquivo em `.github/workflows/` | Instalar Java e o Jenkins, configurar usuários, plugins, backup e acesso pela internet |
| **Configuração do pipeline** | Arquivo YAML dentro do repositório | `Jenkinsfile` (Groovy) no repositório, mais configurações feitas na tela do Jenkins |
| **Integração com o GitHub** | Nativa: o resultado aparece na PR e a proteção da `main` usa o check diretamente | Por plugin e webhook, com token de acesso, para o resultado aparecer na PR |
| **Custo** | Gratuito para repositório público; em privado há uma cota de minutos grátis por mês | O Jenkins é gratuito, mas o servidor e o tempo de manutenção têm custo |
| **Manutenção** | O GitHub atualiza as máquinas | A equipe atualiza o Jenkins e os plugins, inclusive as correções de segurança |
| **Extensões** | Ações prontas do Marketplace (`actions/checkout`, `actions/setup-node`...) | Mais de mil plugins: muito flexível, mas plugins podem conflitar entre si |
| **Quando faz mais sentido** | Projeto já hospedado no GitHub, equipe pequena, sem servidor próprio | Empresa que precisa rodar tudo na própria rede, com máquinas especiais ou vários sistemas de controle de versão |

### O mesmo pipeline no Jenkins

O nosso `ci.yml` ficaria mais ou menos assim num `Jenkinsfile`:

```groovy
pipeline {
  agent { docker { image 'node:22' } }
  stages {
    stage('Instalar') { steps { sh 'npm ci' } }
    stage('Lint')     { steps { sh 'npm run lint' } }
    stage('Testes')   { steps { sh 'npm test' } }
    stage('Build')    { steps { sh 'npm run build' } }
  }
}
```

O arquivo é parecido. A diferença está em tudo o que vem antes dele: um
servidor ligado o tempo todo com Jenkins e Docker, os plugins do GitHub e do
Docker, e um webhook para o GitHub avisar o Jenkins a cada push.

### Conclusão

Para este projeto, o GitHub Actions é a escolha adequada: o código já está no
GitHub, a equipe tem cinco pessoas e nenhum servidor, o resultado aparece na
própria PR e a proteção da `main` usa o check diretamente. O Jenkins exigiria
manter um servidor só para isso, sem trazer nada que o projeto precise hoje.