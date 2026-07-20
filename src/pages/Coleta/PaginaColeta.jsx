import { useState } from 'react';
import BarraTopo from '../../components/BarraTopo.jsx';
import SeletorBairro from './SeletorBairro.jsx';
import SeletorQuantidade from './SeletorQuantidade.jsx';
import CartaoMorador from './CartaoMorador.jsx';
import { bairrosMock } from './dadosMock.js';
import styles from './PaginaColeta.module.css';

function criarMoradorVazio() {
  return { sexo: null, faixaIdade: null, votoFederal: null, votoEstadual: null };
}

function moradorCompleto(morador) {
  return Boolean(morador.sexo && morador.faixaIdade && morador.votoFederal && morador.votoEstadual);
}

function estadoInicial() {
  return {
    bairro: '',
    quantidadeMoradores: null,
    moradores: [criarMoradorVazio()],
  };
}

function PaginaColeta() {
  const [dados, setDados] = useState(estadoInicial);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const todosOsMoradoresCompletos = dados.moradores.every(moradorCompleto);
  const podeAdicionarMorador = dados.quantidadeMoradores != null && todosOsMoradoresCompletos;
  const podeSalvar =
    Boolean(dados.bairro) && dados.quantidadeMoradores != null && todosOsMoradoresCompletos;

  function atualizarMorador(indice, campo, valor) {
    setDados((atual) => ({
      ...atual,
      moradores: atual.moradores.map((morador, i) =>
        i === indice ? { ...morador, [campo]: valor } : morador,
      ),
    }));
  }

  function adicionarMorador() {
    setDados((atual) => ({ ...atual, moradores: [...atual.moradores, criarMoradorVazio()] }));
  }

  function salvarCasa() {
    setSalvando(true);
    // TODO(etapa 4): trocar pela gravação real via services/residencias.js
    setTimeout(() => {
      setSalvando(false);
      setSalvo(true);
      setTimeout(() => {
        setSalvo(false);
        setDados(estadoInicial());
      }, 1200);
    }, 600);
  }

  return (
    <>
      <BarraTopo />
      <main className={styles.pagina}>
        <div className={styles.cartaoPrincipal}>
          <h1>Nova casa</h1>

          <div className={styles.campo}>
            <span className={styles.rotulo}>Bairro</span>
            <SeletorBairro
              bairros={bairrosMock}
              valor={dados.bairro}
              aoSelecionar={(bairro) => setDados((atual) => ({ ...atual, bairro }))}
            />
          </div>

          {dados.bairro && (
            <div className={styles.campo}>
              <span className={styles.rotulo}>Quantas pessoas moram aqui?</span>
              <SeletorQuantidade
                valor={dados.quantidadeMoradores}
                aoSelecionar={(quantidadeMoradores) =>
                  setDados((atual) => ({ ...atual, quantidadeMoradores }))
                }
              />
            </div>
          )}

          {dados.quantidadeMoradores != null &&
            dados.moradores.map((morador, indice) => (
              <CartaoMorador
                key={indice}
                numero={indice + 1}
                morador={morador}
                aoAtualizar={(campo, valor) => atualizarMorador(indice, campo, valor)}
              />
            ))}

          {dados.quantidadeMoradores != null && (
            <div className={styles.acoes}>
              <button
                type="button"
                className={styles.botaoSecundario}
                disabled={!podeAdicionarMorador}
                onClick={adicionarMorador}
              >
                + Adicionar próximo morador
              </button>
              <button
                type="button"
                className={styles.botaoPrimario}
                disabled={!podeSalvar || salvando}
                onClick={salvarCasa}
              >
                {salvando ? 'Salvando...' : 'Salvar casa'}
              </button>
            </div>
          )}

          {salvo && <p className={styles.confirmacao}>Casa salva!</p>}
        </div>
      </main>
    </>
  );
}

export default PaginaColeta;
