import { useEffect, useState } from 'react';
import { observarResidencias, observarTodosEntrevistados } from '../../../services/estatisticas.js';
import { observarCandidatos } from '../../../services/candidatos.js';
import { listarPesquisadores } from '../../../services/usuarios.js';
import { formatarDataBr } from '../Dados/utilData.js';
import { agruparEntrevistas } from './agruparEntrevistas.js';
import CartaoCasa from './CartaoCasa.jsx';
import styles from './PainelEntrevistas.module.css';

function filtrosIniciais() {
  return { bairro: 'todos', pesquisador: 'todos' };
}

function PainelEntrevistas() {
  const [residencias, setResidencias] = useState([]);
  const [entrevistados, setEntrevistados] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [pesquisadores, setPesquisadores] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'sucesso' });

  useEffect(() => {
    const cancelarResidencias = observarResidencias(setResidencias);
    const cancelarEntrevistados = observarTodosEntrevistados(setEntrevistados);
    const cancelarCandidatos = observarCandidatos(setCandidatos);
    listarPesquisadores().then(setPesquisadores);
    return () => {
      cancelarResidencias();
      cancelarEntrevistados();
      cancelarCandidatos();
    };
  }, []);

  const nomePorId = Object.fromEntries(pesquisadores.map((p) => [p.uid, p.nome]));
  const casas = agruparEntrevistas({
    residencias,
    entrevistados,
    nomeDoPesquisador: (id) => nomePorId[id] ?? 'Pesquisador não identificado',
    filtros,
  });
  const totalMoradores = casas.reduce((soma, casa) => soma + casa.moradores.length, 0);
  const bairros = [...new Set(residencias.map((casa) => casa.bairro))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  return (
    <div className={styles.painel}>
      <div className={styles.barra}>
        <label className={styles.campo}>
          Bairro
          <select
            className={styles.campoTexto}
            value={filtros.bairro}
            onChange={(evento) => setFiltros({ ...filtros, bairro: evento.target.value })}
          >
            <option value="todos">Todos</option>
            {bairros.map((bairro) => (
              <option key={bairro} value={bairro}>
                {bairro}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.campo}>
          Pesquisador
          <select
            className={styles.campoTexto}
            value={filtros.pesquisador}
            onChange={(evento) => setFiltros({ ...filtros, pesquisador: evento.target.value })}
          >
            <option value="todos">Todos</option>
            {pesquisadores.map((pesquisador) => (
              <option key={pesquisador.uid} value={pesquisador.uid}>
                {pesquisador.nome}
              </option>
            ))}
          </select>
        </label>
        <p className={styles.resumo}>
          {casas.length} {casas.length === 1 ? 'casa' : 'casas'} · {totalMoradores}{' '}
          {totalMoradores === 1 ? 'entrevistado' : 'entrevistados'}
        </p>
      </div>

      <p
        className={mensagem.tipo === 'erro' ? styles.mensagemErro : styles.mensagem}
        role="status"
        aria-live="polite"
      >
        {mensagem.texto}
      </p>

      {casas.length === 0 ? (
        <p className={styles.vazio}>Nenhuma entrevista encontrada com esses filtros.</p>
      ) : (
        <ul className={styles.lista}>
          {casas.map((casa) => (
            <li key={casa.id}>
              <CartaoCasa
                casa={casa}
                dataFormatada={formatarDataBr(casa.dataColeta)}
                candidatos={candidatos}
                aoInformar={(texto, tipo = 'sucesso') => setMensagem({ texto, tipo })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PainelEntrevistas;
