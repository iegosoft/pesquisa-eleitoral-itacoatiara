// Seções do Dashboard, na ordem da leitura. A barra lateral usa a mesma lista
// para os atalhos, então os ids precisam bater com os das seções. A descrição
// diz em uma linha que pergunta a seção responde.
const SECOES_DASHBOARD = [
  {
    id: 'resultado',
    rotulo: 'Resultado do foco',
    titulo: 'Resultado do candidato foco',
    descricao: 'Como o nosso candidato está em cada cargo.',
  },
  {
    id: 'coleta',
    rotulo: 'Andamento da coleta',
    titulo: 'Andamento da coleta',
    descricao: 'Quantas pessoas, casas e bairros já foram ouvidos.',
  },
  {
    id: 'intencao',
    rotulo: 'Intenção de voto',
    titulo: 'Intenção de voto',
    descricao: 'Todos os candidatos de cada cargo, do mais votado ao menos votado.',
  },
  {
    id: 'territorio',
    rotulo: 'Território',
    titulo: 'Território',
    descricao: 'Em quais bairros o candidato foco está ganhando e em quais está perdendo.',
  },
  {
    id: 'perfil',
    rotulo: 'Perfil da amostra',
    titulo: 'Perfil da amostra',
    descricao: 'Quem foi entrevistado. Se um grupo sobra ou falta, o resultado pode não representar a cidade.',
  },
  {
    id: 'tendencia',
    rotulo: 'Tendência',
    titulo: 'Tendência',
    descricao: 'Como a intenção de voto no candidato foco mudou dia a dia.',
  },
];

export { SECOES_DASHBOARD };
