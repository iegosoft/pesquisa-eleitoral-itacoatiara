import styles from './SeletorBairro.module.css';

function SeletorBairro({ id, bairros, valor, aoSelecionar }) {
  return (
    <select
      id={id}
      className={styles.select}
      value={valor}
      onChange={(evento) => aoSelecionar(evento.target.value)}
    >
      <option value="" disabled>
        Selecione o bairro
      </option>
      {bairros.map((bairro) => (
        <option key={bairro} value={bairro}>
          {bairro}
        </option>
      ))}
    </select>
  );
}

export default SeletorBairro;
