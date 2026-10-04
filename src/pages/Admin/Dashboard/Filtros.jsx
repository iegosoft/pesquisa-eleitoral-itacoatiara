import { intervaloDeDatasInvertido } from './agregacoes.js';
import styles from './Filtros.module.css';

const OPCOES_FAIXA_IDADE = ['16-24', '25-34', '35-44', '45-59', '60+'];

function formatarDataIso(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function Filtros({ filtros, aoAlterar, aoLimpar, temFiltroAtivo, bairrosDisponiveis, aviso = '' }) {
  const datasInvertidas = intervaloDeDatasInvertido(filtros);

  function atualizar(campo, valor) {
    aoAlterar({ ...filtros, [campo]: valor });
  }

  return (
    <div className={styles.filtros} role="search" aria-labelledby="titulo-filtros">
      <h2 id="titulo-filtros" className={styles.titulo} tabIndex={-1}>
        Filtrar resultados
      </h2>
      <p className={aviso ? styles.aviso : styles.avisoVazio} role="status" aria-live="polite">
        {aviso}
      </p>
      <div className={styles.campos}>
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
            max={filtros.dataFim || undefined}
            aria-invalid={datasInvertidas}
            aria-describedby={datasInvertidas ? 'erro-intervalo-datas' : undefined}
            onChange={(evento) => atualizar('dataInicio', evento.target.value)}
          />
        </label>

        <label className={styles.campo}>
          Até
          <input
            type="date"
            className={styles.campoTexto}
            value={filtros.dataFim}
            min={filtros.dataInicio || undefined}
            aria-invalid={datasInvertidas}
            aria-describedby={datasInvertidas ? 'erro-intervalo-datas' : undefined}
            onChange={(evento) => atualizar('dataFim', evento.target.value)}
          />
        </label>

        {temFiltroAtivo && (
          <button type="button" className={styles.botaoLimpar} onClick={aoLimpar}>
            Limpar filtros
          </button>
        )}
      </div>

      {datasInvertidas && (
        <p id="erro-intervalo-datas" className={styles.erro} role="alert">
          A data inicial ({formatarDataIso(filtros.dataInicio)}) é depois da data final (
          {formatarDataIso(filtros.dataFim)}). Corrija o intervalo; enquanto isso, o painel mostra os
          dados sem filtro de data.
        </p>
      )}
    </div>
  );
}

export default Filtros;
