# Guia do Usuário — Pesquisa Eleitoral Itacoatiara

> **Sobre as imagens deste guia:** não foi possível gerar capturas de tela reais do sistema em execução neste momento. Em vez disso, cada tela abaixo é representada por um **esquema estrutural fiel** — um diagrama que mostra exatamente as regiões e componentes reais daquela tela (mesma disposição, mesmos rótulos, mesma hierarquia), só que sem cor/imagem de verdade. Se screenshots reais forem enviados depois, eles substituem os esquemas correspondentes.

## 1. Acesso ao sistema

O sistema é acessado por um único link (não há loja de aplicativos). Ao abrir a URL, você cai na tela de **login**.

```mermaid
graph TD
    subgraph TELA["Tela de Login"]
        direction TB
        FUNDO["Fundo com gradiente de marca\n(azul → roxo)"]
        CARTAO["Cartão central branco"]
        TITULO["'Entrar'"]
        CAMPO_EMAIL["Campo: E-mail"]
        CAMPO_SENHA["Campo: Senha"]
        ERRO["Mensagem de erro\n(só aparece se falhar)"]
        BOTAO["Botão 'Entrar'"]

        CARTAO --> TITULO --> CAMPO_EMAIL --> CAMPO_SENHA --> ERRO --> BOTAO
    end
```

Depois de autenticado, o sistema identifica automaticamente seu papel e te leva direto para a tela certa:

- **Pesquisador** → tela de coleta (`/coleta`)
- **Administrador** → painel administrativo (`/admin`)

Não existe uma tela onde os dois papéis se veem — cada um só acessa a sua própria rota.

---

## 2. Guia do Pesquisador

### 2.1 Visão geral da tela

```mermaid
graph TD
    subgraph TELA["Tela de Coleta (/coleta)"]
        direction TB
        BARRA["Barra superior: nome do usuário + botão Sair"]
        BANNER["Banner 'Instalar app' (some após instalado)"]
        AVISO["Aviso de casas que falharam ao sincronizar\n(só aparece se houver falha)"]
        TITULO["'Nova casa'"]
        FORM["Formulário de coleta"]

        BARRA --> BANNER --> AVISO --> TITULO --> FORM
    end
```

### 2.2 Passo a passo — registrar uma casa

```mermaid
flowchart TD
    A["1. Escolher o bairro\n(lista pré-cadastrada)"] --> B["2. Informar quantas pessoas\nmoram na casa"]
    B --> C["3. Para cada morador:\nsexo, faixa etária,\nvoto federal, voto estadual"]
    C --> D{"Tem mais um\nmorador?"}
    D -- "Sim" --> E["Adicionar próximo morador"]
    E --> C
    D -- "Não, terminei" --> F["Salvar casa"]
    F --> G["Confirmação 'Casa salva!'\nformulário limpa pra próxima casa"]
```

**Pontos importantes:**

- O botão **Salvar casa** só fica ativo quando todos os moradores informados têm os quatro campos preenchidos.
- Ao salvar, os dados vão direto para o armazenamento local do celular — funciona **mesmo sem internet**. A sincronização com o servidor acontece sozinha assim que a conexão voltar.
- Se uma casa realmente falhar ao sincronizar (não apenas ficar pendente), um aviso aparece no topo da tela pedindo para avisar o administrador.
- O pesquisador **nunca vê números agregados** — só o formulário de coleta, casa após casa.

### 2.3 Instalando como aplicativo

Na primeira visita pelo celular, um banner sugere instalar o app na tela inicial:

- **Android/Chrome**: instalação direta, um toque.
- **iPhone/Safari**: instrução manual (compartilhar → "Adicionar à Tela de Início"), porque o iOS não permite instalação automática.

Depois de instalado, o ícone abre o app em tela cheia, sem barra de endereço do navegador.

---

## 3. Guia do Administrador

O painel administrativo tem uma **sidebar** fixa à esquerda com três seções, e um **cabeçalho** no topo com o título da seção atual e a identidade de quem está logado.

```mermaid
graph LR
    subgraph SHELL["Estrutura do painel administrativo"]
        direction LR
        subgraph SIDEBAR["Sidebar (fundo escuro)"]
            direction TB
            LOGO["Logo + nome do sistema"]
            NAV1["Dashboard"]
            NAV2["Candidatos"]
            NAV3["Dados"]
            SAIR["Sair"]
            LOGO --> NAV1 --> NAV2 --> NAV3
            NAV3 -.-> SAIR
        end
        subgraph CONTEUDO["Área de conteúdo"]
            direction TB
            CABECALHO["Cabeçalho: breadcrumb, título,\nsubtítulo, avatar do usuário"]
            SECAO["Conteúdo da seção ativa"]
            CABECALHO --> SECAO
        end
    end
```

### 3.1 Seção Dashboard

```mermaid
graph TD
    subgraph DASH["Dashboard"]
        direction TB
        FILTROS["Filtros: bairro, sexo, faixa etária, data"]
        KPIS["KPIs: Entrevistados | Casas visitadas |\nBairros cobertos | Última coleta"]
        LINHA1["Ranking Federal | Ranking Estadual | Evolução do foco"]
        LINHA2["Intenção do foco por bairro"]
        LINHA3["Status do foco por bairro — Federal | Estadual"]

        FILTROS --> KPIS --> LINHA1 --> LINHA2 --> LINHA3
    end
```

- Cada **ranking** mostra os candidatos daquele cargo ordenados por percentual, com o candidato foco marcado por um selo "FOCO".
- **Evolução** tem seletor de período (7, 14 ou 30 dias).
- **Status do foco por bairro** usa três cores: verde (lidera), laranja (empate, diferença de até 5 pontos), vermelho (perde).
- Os **filtros** no topo afetam todo o dashboard ao mesmo tempo, exceto a evolução (que tem seletor de período próprio).

### 3.2 Seção Candidatos

```mermaid
graph TD
    subgraph CAND["Candidatos"]
        direction LR
        subgraph LISTAS["Listas"]
            direction TB
            FED["Deputado Federal\n(lista de candidatos)"]
            EST["Deputado Estadual\n(lista de candidatos)"]
        end
        FORM["Formulário: nome, partido,\ncargo, foto, marcar como foco,\nsalvar / excluir"]
    end
    LISTAS -- "clicar num candidato\npra editar" --> FORM
```

**Passo a passo — cadastrar um candidato:**
1. Preencher nome, partido e cargo (federal ou estadual) no formulário à direita.
2. Opcionalmente, colar a URL de uma foto e/ou marcar como candidato foco.
3. Clicar em "Cadastrar candidato".

**Passo a passo — excluir um candidato:**
1. Clicar no candidato na lista para abrir o formulário de edição.
2. Clicar em "Excluir candidato" → aparece uma confirmação.
3. Confirmar a exclusão.
   - Se o candidato já tiver algum voto registrado, o sistema **recusa a exclusão** e explica o motivo — isso protege os relatórios já gerados.

### 3.3 Seção Dados

```mermaid
graph TD
    subgraph DADOS["Dados"]
        direction TB
        EXPORT["Exportar dados\n(gera planilha Excel com todos\nos dados brutos coletados)"]
        IMPORT["Importar em lote\n(planilha/CSV → valida linha a linha\n→ confirma → grava)"]
        MANUAL["Cadastro manual de uma casa\n(mesmo formulário da coleta,\nusado pelo admin)"]
    end
```

- **Exportar**: um clique gera e baixa a planilha, com cabeçalho colorido e uma aba de instruções.
- **Importar**: primeiro baixa o modelo de planilha, preenche offline (útil pra digitar dados coletados em papel), depois envia o arquivo — o sistema mostra erro linha a linha antes de permitir confirmar a importação.
- **Cadastro manual**: usado quando um pesquisador não conseguiu registrar uma casa pelo aplicativo em campo.

---

## 4. Referência rápida — quem pode fazer o quê

| Ação | Pesquisador | Administrador |
|---|---|---|
| Registrar casa/moradores | ✅ | ✅ (cadastro manual) |
| Ver números agregados / dashboard | ❌ | ✅ |
| Cadastrar / editar candidato | ❌ | ✅ |
| Excluir candidato | ❌ | ✅ (se sem voto registrado) |
| Exportar / importar planilha | ❌ | ✅ |
| Instalar como app | ✅ | ✅ |
