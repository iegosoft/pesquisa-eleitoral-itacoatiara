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

## Deploy (Firebase Hosting)

1. Instale o Firebase CLI, se ainda não tiver: `npm install -g firebase-tools`.
2. Faça login: `firebase login` (abre o navegador pra autenticar com a conta Google do projeto).
3. Gere a build de produção: `npm run build` (cria a pasta `dist/`).
4. Publique:
   - Só o site: `firebase deploy --only hosting`
   - Site + regras do Firestore: `firebase deploy --only hosting,firestore:rules`
5. O terminal mostra a URL pública (algo como `https://pesquisa-eleitoral-itacoatiara.web.app`). É esse link que se compartilha com a equipe — em `/coleta` pros pesquisadores, `/admin` pra administração.

O arquivo `firebase.json` já está configurado (pasta `dist` como público, redirecionamento de todas as rotas pro `index.html`, sem cache no service worker e no manifest pra garantir que atualizações cheguem nos aparelhos dos pesquisadores).

## Instalação como app (PWA)

Ao abrir `/coleta` num celular pela primeira vez, aparece um banner orientando a instalar o app na tela inicial (instalação direta no Android/Chrome, instrução manual no iOS/Safari, já que o iOS não oferece instalação automática). Depois de instalado, o ícone abre em tela cheia, sem barra de endereço. Não há publicação em loja de aplicativos — a distribuição é só o link.

## Fluxo de trabalho (Git Flow)

- `main`: código estável em produção.
- `develop`: integração das features.
- `feature/nome-da-feature`: uma branch por etapa, criada a partir de `develop` e mesclada de volta nela ao terminar.

Commits seguem [Conventional Commits](https://www.conventionalcommits.org/), em português (ex.: `feat: adiciona formulario de coleta por residencia`).
