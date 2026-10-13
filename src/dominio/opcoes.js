// Fonte única das opções de resposta da pesquisa. Os valores são os que ficam
// gravados no banco; mudar um deles aqui muda em todo o sistema.

const VOTO_INDECISO = 'indeciso';
const VOTO_BRANCO_NULO = 'branco_nulo';

const VOTOS_NEUTROS = [
  { valor: VOTO_INDECISO, rotulo: 'Indeciso' },
  { valor: VOTO_BRANCO_NULO, rotulo: 'Branco/Nulo' },
];

const SEXOS = [
  { valor: 'feminino', rotulo: 'Feminino' },
  { valor: 'masculino', rotulo: 'Masculino' },
];

// `rotulo` é a forma curta (botões e filtros); `rotuloExtenso`, a do perfil
// da amostra.
const FAIXAS_ETARIAS = [
  { valor: '16-24', rotulo: '16-24', rotuloExtenso: '16 a 24 anos' },
  { valor: '25-34', rotulo: '25-34', rotuloExtenso: '25 a 34 anos' },
  { valor: '35-44', rotulo: '35-44', rotuloExtenso: '35 a 44 anos' },
  { valor: '45-59', rotulo: '45-59', rotuloExtenso: '45 a 59 anos' },
  { valor: '60+', rotulo: '60+', rotuloExtenso: '60 anos ou mais' },
];

export { VOTO_INDECISO, VOTO_BRANCO_NULO, VOTOS_NEUTROS, SEXOS, FAIXAS_ETARIAS };
