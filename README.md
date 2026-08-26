# Pesquisa Eleitoral Itacoatiara

Sistema de coleta e análise de intenção de voto para pesquisa eleitoral de rua no município de Itacoatiara-AM, com dados separados para deputado federal e deputado estadual.

O sistema tem dois perfis de uso completamente separados:

- **Pesquisador** (rota `/coleta`): interface simples para coleta em campo, casa a casa, sem números ou resultados agregados visíveis.
- **Admin** (rota `/admin`): plataforma de BI eleitoral com sidebar própria, dividida em três seções — **Dashboard** (KPIs, ranking de intenção de voto por eleição, evolução do candidato foco, status do foco por bairro), **Candidatos** (cadastro, edição e exclusão — bloqueada se o candidato já tiver voto registrado, pra não corromper os relatórios) e **Dados** (importação/exportação em Excel, cadastro manual de uma casa).

## Stack

- Front-end React + Vite, empacotado como PWA instalável (sem loja de aplicativos).
- Back-end Firebase: Firestore como banco de dados e Firebase Auth para login e controle de papéis.
- Persistência offline do Firestore habilitada, para coleta em áreas com sinal instável.
- Gráficos do painel admin com Recharts.
- CSS Modules com um pequeno design system próprio (`src/styles/theme.css`): tokens de cor com papel fixo (azul institucional predominante, verde petróleo secundário, roxo só pra diferenciar a eleição estadual, verde/laranja/vermelho reservados a positivo/atenção/erro), tipografia Roboto + Manrope (Google Fonts), cantos arredondados (16px) e sombras leves — nada de cor decidida por componente, tudo referencia os tokens.

## Estrutura de pastas

```
src/
  components/    componentes de interface reutilizáveis (Sidebar, Cabecalho,
                 BarraTopo, AvatarCandidato, SeletorPills, BannerInstalacao)
    coleta/      componentes específicos da tela de coleta
  contexts/      AuthContext/useAuth — sessão e papel do usuário logado
  hooks/         hooks compartilhados (ex.: prompt de instalação do PWA)
  pages/
    Coleta/      tela do perfil pesquisador
    Login/       tela de login
    Admin/       shell do perfil admin (sidebar + cabeçalho + seções)
      Dashboard/ KPIs, gráficos, agregações e paleta de cores dos gráficos
      Dados/     importação/exportação de planilha, cadastro manual
  routes/        definição de rotas da aplicação
  services/      camada isolada de acesso a dados (Firestore/Auth) — nenhum
                 componente acessa o Firebase diretamente
  styles/        tokens de tema (cores, raios de borda, sombras, fontes)
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

## Deploy (Vercel)

Alternativa de hospedagem usada por enquanto. O backend continua sendo o Firebase (Firestore e Auth acessados direto do client), então a Vercel serve só o build estático.

1. Importe o repositório em [vercel.com](https://vercel.com) (framework detectado automaticamente como Vite).
2. Cadastre as variáveis de ambiente do projeto (Settings → Environment Variables), com os mesmos nomes do `.env.example`: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
3. O arquivo `vercel.json` já está configurado (redirecionamento de todas as rotas pro `index.html`, sem cache no service worker e no manifest — mesmo motivo do `firebase.json`).
4. Depois do primeiro deploy, adicione o domínio gerado pela Vercel (ex.: `seu-projeto.vercel.app`, ou o domínio customizado) em **Firebase Console → Authentication → Settings → Authorized domains** — sem isso o login falha com erro de domínio não autorizado.

**Nota:** o gatilho automático de deploy no push pro GitHub não tem disparado nesse projeto (motivo não identificado — a integração aparece conectada normalmente em Settings → Git). Enquanto isso não for resolvido, publique manualmente por um **Deploy Hook** (Settings → Git → Deploy Hooks → criar um apontando pra branch `main`) e dispare com `curl -X POST <url-do-hook>` depois de cada push relevante em `main`.

## Instalação como app (PWA)

Ao abrir `/coleta` num celular pela primeira vez, aparece um banner orientando a instalar o app na tela inicial (instalação direta no Android/Chrome, instrução manual no iOS/Safari, já que o iOS não oferece instalação automática). Depois de instalado, o ícone abre em tela cheia, sem barra de endereço. Não há publicação em loja de aplicativos — a distribuição é só o link.

## Fluxo de trabalho (Git Flow)

- `main`: código estável em produção.
- `develop`: integração das features.
- `feature/nome-da-feature`: uma branch por etapa, criada a partir de `develop` e mesclada de volta nela ao terminar.

Commits seguem [Conventional Commits](https://www.conventionalcommits.org/), em português (ex.: `feat: adiciona formulario de coleta por residencia`).
