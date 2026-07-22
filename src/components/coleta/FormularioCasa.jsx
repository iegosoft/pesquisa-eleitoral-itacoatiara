import { useState } from 'react';
import SeletorBairro from './SeletorBairro.jsx';
import SeletorQuantidade from './SeletorQuantidade.jsx';
import CartaoMorador from './CartaoMorador.jsx';
import styles from './FormularioCasa.module.css';

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

// Fluxo de uma casa (bairro → quantidade de moradores → sexo/idade/voto de
// cada um), reaproveitado tanto pelo pesquisador em campo (/coleta) quanto
// pelo cadastro manual do admin. Quem grava de verdade é o `aoSalvar`
// passado pelo componente pai — este componente só monta os dados e cuida
// da experiência do formulário (validação, adicionar morador, confirmação).
function FormularioCasa({ bairros, candidatosFederal, candidatosEstadual, aoSalvar }) {
  const [dados, setDados] = useState(estadoInicial);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState('');

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

  async function salvarCasa() {
    setErro('');
    setSalvando(true);
    try {
      await aoSalvar(dados);
      setSalvando(false);
      setSalvo(true);
      setTimeout(() => {
        setSalvo(false);
        setDados(estadoInicial());
      }, 1200);
    } catch {
      setSalvando(false);
      setErro('Não foi possível salvar esta casa. Tente novamente.');
    }
  }

  return (
    <>
      <div className={styles.campo}>
        <span className={styles.rotulo}>Bairro</span>
        <SeletorBairro
          bairros={bairros}
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
            candidatosFederal={candidatosFederal}
            candidatosEstadual={candidatosEstadual}
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

      {erro && <p className={styles.erro}>{erro}</p>}
      {salvo && <p className={styles.confirmacao}>Casa salva!</p>}
    </>
  );
}

export default FormularioCasa;
