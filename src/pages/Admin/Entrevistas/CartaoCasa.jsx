import { useState } from 'react';
import { excluirCasa } from '../../../services/entrevistas.js';
import LinhaMorador from './LinhaMorador.jsx';
import styles from './PainelEntrevistas.module.css';

function CartaoCasa({ casa, dataFormatada, candidatos, aoInformar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const descricao = `casa de ${casa.bairro} em ${dataFormatada}`;

  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await excluirCasa(
        casa.id,
        casa.moradores.map((morador) => morador.id),
      );
      aoInformar(`A ${descricao} foi excluída, com ${casa.moradores.length} entrevistado(s).`);
    } catch {
      setExcluindo(false);
      aoInformar(`Não foi possível excluir a ${descricao}. Tente novamente.`, 'erro');
    }
  }

  return (
    <article className={styles.casa} aria-label={descricao}>
      <header className={styles.cabecalhoCasa}>
        <div>
          <h3>{casa.bairro}</h3>
          <p className={styles.detalheCasa}>
            {dataFormatada} · {casa.pesquisador} · {casa.moradores.length}{' '}
            {casa.moradores.length === 1 ? 'entrevistado' : 'entrevistados'}
            {casa.qtdMoradores ? ` de ${casa.qtdMoradores} morador(es)` : ''}
          </p>
        </div>
        {!confirmando && (
          <button type="button" className={styles.botaoPerigo} onClick={() => setConfirmando(true)}>
            Excluir casa
          </button>
        )}
      </header>

      {confirmando && (
        <div className={styles.confirmacao} role="alertdialog" aria-label={`Confirmar exclusão da ${descricao}`}>
          <p>
            Excluir a casa inteira, com os {casa.moradores.length} entrevistado(s)? Isso não pode ser
            desfeito. Use quando a casa foi salva duas vezes.
          </p>
          <div className={styles.acoesConfirmacao}>
            <button type="button" className={styles.botaoPerigoPreenchido} onClick={confirmarExclusao} disabled={excluindo}>
              {excluindo ? 'Excluindo...' : 'Sim, excluir a casa'}
            </button>
            <button type="button" className={styles.botaoSecundario} onClick={() => setConfirmando(false)} disabled={excluindo}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className={styles.rolagemTabela}>
        <table className={styles.tabela}>
          <caption className={styles.somenteLeitor}>Entrevistados da {descricao}</caption>
          <thead>
            <tr>
              <th scope="col">Morador</th>
              <th scope="col">Sexo</th>
              <th scope="col">Faixa etária</th>
              <th scope="col">Voto federal</th>
              <th scope="col">Voto estadual</th>
              <th scope="col">
                <span className={styles.somenteLeitor}>Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {casa.moradores.map((morador, indice) => (
              <LinhaMorador
                key={morador.id}
                casa={casa}
                morador={morador}
                numero={indice + 1}
                ultimoDaCasa={casa.moradores.length === 1}
                candidatos={candidatos}
                aoInformar={aoInformar}
              />
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default CartaoCasa;
