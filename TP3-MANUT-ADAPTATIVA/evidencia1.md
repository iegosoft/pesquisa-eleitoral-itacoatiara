# Evidência 1 — Mudança de dependência (`date-fns`)

Ver `plano-estrategia.md` para o contexto completo. Issue: [#12](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/issues/12).

## Antes (`date-fns` v1.30.1)

O sistema usava a versão 1 do `date-fns`, com a sintaxe da época: tokens de formatação
em maiúsculo (`DD/MM/YYYY`) e o locale genérico `pt` (o português do Brasil, `pt-BR`,
ainda não existia como locale separado nessa versão).

- Vídeo: [`evidencias/dependencia/antes/tp3-dependencia-antes-video.mp4`](../evidencias/dependencia/antes/tp3-dependencia-antes-video.mp4)
- Print do código: [`evidencias/dependencia/antes/tp3-dependencia-antes-codigo.png`](../evidencias/dependencia/antes/tp3-dependencia-antes-codigo.png)
- Print do `package.json`: [`evidencias/dependencia/antes/tp3-dependencia-antes-versao-instalada.png`](../evidencias/dependencia/antes/tp3-dependencia-antes-versao-instalada.png)

## O erro de incompatibilidade

Ao atualizar para a versão mais recente (4.4.0) sem alterar o código, a formatação
passou a lançar um `RangeError` real — a versão nova protege contra o uso dos tokens
antigos, em vez de produzir uma data errada silenciosamente:

```
RangeError: Use `dd` instead of `DD` (in `DD/MM/YYYY`) for formatting days of the month...
```

Reproduzido tanto na suíte de testes automatizada quanto ao vivo no navegador (painel
administrativo, cartão "Última coleta").

- Vídeo: [`evidencias/dependencia/erro/tp3-dependencia-erro-video.mp4`](../evidencias/dependencia/erro/tp3-dependencia-erro-video.mp4)
- Print do console: [`evidencias/dependencia/erro/tp3-dependencia-erro-console.png`](../evidencias/dependencia/erro/tp3-dependencia-erro-console.png)

## Depois (`date-fns` v4.4.0)

Código ajustado para a sintaxe atual: locale `ptBR` (agora específico para o Brasil,
importado do índice `date-fns/locale`) e tokens de formatação em minúsculo
(`dd/MM/yyyy`).

- Vídeo: [`evidencias/dependencia/depois/tp3-dependencia-depois-video.mp4`](../evidencias/dependencia/depois/tp3-dependencia-depois-video.mp4)
- Suíte completa: 12/12 testes passando após a correção.

## Commits e Pull Request

- Ver `arquivos-alterados/README.md` para a lista de arquivos alterados.
- Pull Request: [#13](https://github.com/iegosoft/pesquisa-eleitoral-itacoatiara/pull/13)
