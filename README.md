# Pesquisa Eleitoral Itacoatiara

Sistema de coleta e análise de intenção de voto para pesquisa eleitoral de rua no município de Itacoatiara-AM, com dados separados para deputado federal e deputado estadual.

O sistema tem dois perfis de uso completamente separados:

- **Pesquisador** (rota `/coleta`): interface simples para coleta em campo, casa a casa, sem números ou resultados agregados visíveis.
- **Admin** (rota `/admin`): dashboard com gráficos, cadastro de candidatos e exportação de dados.

## Stack

- Front-end React + Vite, empacotado como PWA instalável (sem loja de aplicativos).
- Back-end Firebase: Firestore como banco de dados e Firebase Auth para login e controle de papéis.
- Persistência offline do Firestore habilitada, para coleta em áreas com sinal instável.
- Gráficos do painel admin com Recharts.

## Estrutura de pastas

```
src/
  components/   componentes de interface reutilizáveis
  pages/
    Coleta/     telas do perfil pesquisador
    Admin/      telas do perfil admin
  routes/       definição de rotas da aplicação
  services/     camada isolada de acesso a dados (Firestore/Auth) — nenhum
                componente acessa o Firebase diretamente
  styles/       tokens de tema (cores, raios de borda)
```

## Configuração do ambiente

1. Instale as dependências:

   ```
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com as chaves do projeto Firebase (Configurações do projeto → Seus apps, no Firebase Console). O arquivo `.env` não é versionado.

3. Rode o ambiente de desenvolvimento:

   ```
   npm run dev
   ```

4. Para gerar a build de produção:

   ```
   npm run build
   ```

## Fluxo de trabalho (Git Flow)

- `main`: código estável em produção.
- `develop`: integração das features.
- `feature/nome-da-feature`: uma branch por etapa, criada a partir de `develop` e mesclada de volta nela ao terminar.

Commits seguem [Conventional Commits](https://www.conventionalcommits.org/), em português (ex.: `feat: adiciona formulario de coleta por residencia`).
