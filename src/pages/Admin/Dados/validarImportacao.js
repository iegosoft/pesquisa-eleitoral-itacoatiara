import { parseDataBr } from './utilData.js';
import { idDoVoto } from './resolverVoto.js';

const FAIXAS_VALIDAS = ['16-24', '25-34', '35-44', '45-59', '60+'];
const SEXOS_VALIDOS = ['feminino', 'masculino'];

// Valida linha a linha e agrupa por casa_id+bairro em residências prontas
// pra gravar. Se houver qualquer erro, a importação inteira fica bloqueada
// até o admin corrigir o arquivo — evita gravar dados pela metade.
function validarLinhas(linhasCsv, { candidatosFederal, candidatosEstadual, pesquisadores }) {
  const erros = [];
  const grupos = new Map();

  linhasCsv.forEach((linha, indice) => {
    const numeroLinha = indice + 2; // +1 pelo cabeçalho, +1 pra contar a partir de 1
    const casaId = (linha.casa_id ?? '').trim();
    const bairro = (linha.bairro ?? '').trim();
    const dataTexto = (linha.data_coleta ?? '').trim();
    const nomePesquisador = (linha.pesquisador ?? '').trim();
    const qtdTexto = (linha.qtd_moradores ?? '').trim();
    const sexo = (linha.sexo ?? '').trim().toLowerCase();
    const faixaIdade = (linha.faixa_idade ?? '').trim();
    const votoFederalTexto = (linha.voto_federal ?? '').trim();
    const votoEstadualTexto = (linha.voto_estadual ?? '').trim();

    const mensagens = [];
    if (!casaId) mensagens.push('casa_id vazio');
    if (!bairro) mensagens.push('bairro vazio');

    const data = parseDataBr(dataTexto);
    if (!data) mensagens.push(`data_coleta inválida ("${dataTexto}"), use DD/MM/AAAA`);

    const pesquisador = pesquisadores.find(
      (p) => (p.nome ?? '').trim().toLowerCase() === nomePesquisador.toLowerCase(),
    );
    if (!pesquisador) mensagens.push(`pesquisador "${nomePesquisador}" não encontrado`);

    const qtdMoradores = Number(qtdTexto);
    if (!qtdTexto || !Number.isInteger(qtdMoradores) || qtdMoradores <= 0) {
      mensagens.push(`qtd_moradores inválida ("${qtdTexto}")`);
    }

    if (!SEXOS_VALIDOS.includes(sexo)) mensagens.push(`sexo inválido ("${linha.sexo ?? ''}")`);
    if (!FAIXAS_VALIDAS.includes(faixaIdade)) mensagens.push(`faixa_idade inválida ("${faixaIdade}")`);

    const votoFederal = idDoVoto(votoFederalTexto, candidatosFederal);
    if (!votoFederal) mensagens.push(`voto_federal "${votoFederalTexto}" não corresponde a nenhum candidato`);

    const votoEstadual = idDoVoto(votoEstadualTexto, candidatosEstadual);
    if (!votoEstadual) mensagens.push(`voto_estadual "${votoEstadualTexto}" não corresponde a nenhum candidato`);

    if (mensagens.length > 0) {
      erros.push({ linha: numeroLinha, mensagens });
      return;
    }

    const chaveGrupo = `${casaId}::${bairro}`;
    if (!grupos.has(chaveGrupo)) {
      grupos.set(chaveGrupo, {
        bairro,
        dataColeta: data,
        pesquisadorId: pesquisador.uid,
        qtdMoradores,
        entrevistados: [],
      });
    }
    grupos.get(chaveGrupo).entrevistados.push({ sexo, faixaIdade, votoFederal, votoEstadual });
  });

  return { erros, casas: [...grupos.values()] };
}

export { validarLinhas };
