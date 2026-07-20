import SeletorPills from '../../components/SeletorPills.jsx';
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

      <div className={styles.campo}>
        <span className={styles.rotulo}>Sexo</span>
        <SeletorPills
          opcoes={OPCOES_SEXO}
          valorSelecionado={morador.sexo}
          aoSelecionar={(valor) => aoAtualizar('sexo', valor)}
        />
      </div>

      <div className={styles.campo}>
        <span className={styles.rotulo}>Faixa de idade</span>
        <SeletorPills
          opcoes={OPCOES_FAIXA_IDADE}
          valorSelecionado={morador.faixaIdade}
          aoSelecionar={(valor) => aoAtualizar('faixaIdade', valor)}
        />
      </div>

      <div className={styles.campo}>
        <span className={styles.rotulo}>Voto para deputado federal</span>
        <GradeCandidatos
          candidatos={candidatosFederal}
          valorSelecionado={morador.votoFederal}
          aoSelecionar={(valor) => aoAtualizar('votoFederal', valor)}
        />
      </div>

      <div className={styles.campo}>
        <span className={styles.rotulo}>Voto para deputado estadual</span>
        <GradeCandidatos
          candidatos={candidatosEstadual}
          valorSelecionado={morador.votoEstadual}
          aoSelecionar={(valor) => aoAtualizar('votoEstadual', valor)}
        />
      </div>
    </section>
  );
}

export default CartaoMorador;
