import { FAIXAS_ETARIAS, SEXOS } from '../../dominio/opcoes.js';
import SeletorPills from '../SeletorPills.jsx';
import GradeCandidatos from './GradeCandidatos.jsx';
import styles from './CartaoMorador.module.css';

function CartaoMorador({ numero, morador, candidatosFederal, candidatosEstadual, aoAtualizar, aoRemover }) {
  return (
    <section className={styles.cartao}>
      <div className={styles.cabecalho}>
        <h2>Morador {numero}</h2>
        {aoRemover && (
          <button
            type="button"
            className={styles.botaoRemover}
            onClick={aoRemover}
            aria-label={`Remover morador ${numero}`}
          >
            Remover
          </button>
        )}
      </div>

      <fieldset className={styles.campoFieldset}>
        <legend className={styles.rotulo}>Sexo</legend>
        <SeletorPills
          opcoes={SEXOS}
          valorSelecionado={morador.sexo}
          aoSelecionar={(valor) => aoAtualizar('sexo', valor)}
        />
      </fieldset>

      <fieldset className={styles.campoFieldset}>
        <legend className={styles.rotulo}>Faixa de idade</legend>
        <SeletorPills
          opcoes={FAIXAS_ETARIAS}
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
