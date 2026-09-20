import SeletorPills from '../SeletorPills.jsx';
import GradeCandidatos from './GradeCandidatos.jsx';
import styles from './CartaoMorador.module.css';

const OPCOES_SEXO = [
  { valor: 'feminino', rotulo: 'Feminino' },
  { valor: 'masculino', rotulo: 'Masculino' },
];

const OPCOES_FAIXA_IDADE = [
  { valor: '16-24', rotulo: '16-24' },
  { valor: '25-34', rotulo: '25-34' },
  { valor: '35-44', rotulo: '35-44' },
  { valor: '45-59', rotulo: '45-59' },
  { valor: '60+', rotulo: '60+' },
];

function CartaoMorador({ numero, morador, candidatosFederal, candidatosEstadual, aoAtualizar }) {
  return (
    <section className={styles.cartao}>
      <h2>Morador {numero}</h2>

      <fieldset className={styles.campoFieldset}>
        <legend className={styles.rotulo}>Sexo</legend>
        <SeletorPills
          opcoes={OPCOES_SEXO}
          valorSelecionado={morador.sexo}
          aoSelecionar={(valor) => aoAtualizar('sexo', valor)}
        />
      </fieldset>

      <fieldset className={styles.campoFieldset}>
        <legend className={styles.rotulo}>Faixa de idade</legend>
        <SeletorPills
          opcoes={OPCOES_FAIXA_IDADE}
          valorSelecionado={morador.faixaIdade}
          aoSelecionar={(valor) => aoAtualizar('faixaIdade', valor)}
        />
      </fieldset>

      <fieldset className={styles.campoFieldset}>
        <legend className={styles.rotulo}>Voto para deputado federal</legend>
        <GradeCandidatos
          candidatos={candidatosFederal}
          valorSelecionado={morador.votoFederal}
          aoSelecionar={(valor) => aoAtualizar('votoFederal', valor)}
        />
      </fieldset>

      <fieldset className={styles.campoFieldset}>
        <legend className={styles.rotulo}>Voto para deputado estadual</legend>
        <GradeCandidatos
          candidatos={candidatosEstadual}
          valorSelecionado={morador.votoEstadual}
          aoSelecionar={(valor) => aoAtualizar('votoEstadual', valor)}
        />
      </fieldset>
    </section>
  );
}

export default CartaoMorador;
