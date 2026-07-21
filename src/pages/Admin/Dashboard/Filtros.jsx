import styles from './Filtros.module.css';

const OPCOES_FAIXA_IDADE = ['16-24', '25-34', '35-44', '45-59', '60+'];

function Filtros({ filtros, aoAlterar, bairrosDisponiveis }) {
  function atualizar(campo, valor) {
    aoAlterar({ ...filtros, [campo]: valor });
  }

  return (
    <div className={styles.filtros}>
      <label className={styles.campo}>
        Bairro
        <select
          className={styles.campoTexto}
          value={filtros.bairro}
          onChange={(evento) => atualizar('bairro', evento.target.value)}
        >
          <option value="todos">Todos</option>
          {bairrosDisponiveis.map((bairro) => (
            <option key={bairro} value={bairro}>
              {bairro}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        Sexo
        <select
          className={styles.campoTexto}
          value={filtros.sexo}
          onChange={(evento) => atualizar('sexo', evento.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
        </select>
      </label>

      <label className={styles.campo}>
        Faixa etária
        <select
          className={styles.campoTexto}
          value={filtros.faixaIdade}
          onChange={(evento) => atualizar('faixaIdade', evento.target.value)}
        >
          <option value="todas">Todas</option>
          {OPCOES_FAIXA_IDADE.map((faixa) => (
            <option key={faixa} value={faixa}>
              {faixa}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        De
        <input
          type="date"
          className={styles.campoTexto}
          value={filtros.dataInicio}
          onChange={(evento) => atualizar('dataInicio', evento.target.value)}
        />
      </label>

      <label className={styles.campo}>
        Até
        <input
          type="date"
          className={styles.campoTexto}
          value={filtros.dataFim}
          onChange={(evento) => atualizar('dataFim', evento.target.value)}
        />
      </label>
    </div>
  );
}

export default Filtros;
