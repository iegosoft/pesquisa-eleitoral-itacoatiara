// Dados de exemplo pra construir e validar a interface da etapa 3.
// Na etapa 4 são substituídos pela leitura real do Firestore (candidatos.js
// e uma lista de bairros administrável), sem precisar mexer no visual.

const candidatosFederalMock = [
  { id: 'joao-silva', nome: 'João Silva', partido: 'Partido A', cargo: 'federal', fotoUrl: '', isFoco: true },
  { id: 'maria-paes', nome: 'Maria Paes', partido: 'Partido B', cargo: 'federal', fotoUrl: '', isFoco: false },
];

const candidatosEstadualMock = [
  { id: 'carlos-t', nome: 'Carlos T.', partido: 'Partido C', cargo: 'estadual', fotoUrl: '', isFoco: false },
  { id: 'ana-reis', nome: 'Ana Reis', partido: 'Partido D', cargo: 'estadual', fotoUrl: '', isFoco: true },
];

const bairrosMock = [
  'Centro',
  'Colônia',
  'São Jorge',
  'Tiradentes',
  'São Francisco',
  'Aparecida',
];

export { candidatosFederalMock, candidatosEstadualMock, bairrosMock };
