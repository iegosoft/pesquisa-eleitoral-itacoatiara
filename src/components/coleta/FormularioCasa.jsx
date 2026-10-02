import { useState } from 'react';
import SeletorBairro from './SeletorBairro.jsx';
import SeletorQuantidade from './SeletorQuantidade.jsx';
import CartaoMorador from './CartaoMorador.jsx';
import { buscarEnderecoPorCep } from '../../services/viacep.js';
import styles from './FormularioCasa.module.css';

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function criarMoradorVazio() {
  return { sexo: null, faixaIdade: null, votoFederal: null, votoEstadual: null };
}

const CAMPOS_MORADOR = [
  { chave: 'sexo', rotulo: 'sexo' },
  { chave: 'faixaIdade', rotulo: 'faixa de idade' },
  { chave: 'votoFederal', rotulo: 'voto federal' },
  { chave: 'votoEstadual', rotulo: 'voto estadual' },
];

function camposFaltando(morador) {
  return CAMPOS_MORADOR.filter(({ chave }) => !morador[chave]).map(({ rotulo }) => rotulo);
}

function moradorCompleto(morador) {
  return camposFaltando(morador).length === 0;
}

function listarPendencias(dados) {
  const pendencias = dados.moradores
    .map((morador, indice) => ({ numero: indice + 1, faltando: camposFaltando(morador) }))
    .filter(({ faltando }) => faltando.length > 0)
    .map(({ numero, faltando }) => `Morador ${numero}: ${faltando.join(', ')}`);

  if (dados.moradores.length > dados.quantidadeMoradores) {
    pendencias.push(
      `A casa tem ${dados.quantidadeMoradores} morador(es), mas há ${dados.moradores.length} entrevistados: remova um morador ou corrija a quantidade`,
    );
  }
  if (!dados.consentimento) {
    pendencias.push('Marcar o consentimento do morador');
  }
  return pendencias;
}

function estadoInicial() {
  return {
    bairro: '',
    quantidadeMoradores: null,
    moradores: [criarMoradorVazio()],
    consentimento: false,
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
  const [cep, setCep] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [mensagemCep, setMensagemCep] = useState('');

  const todosOsMoradoresCompletos = dados.moradores.every(moradorCompleto);
  const limiteDeMoradoresAtingido =
    dados.quantidadeMoradores != null && dados.moradores.length >= dados.quantidadeMoradores;
  const podeAdicionarMorador =
    dados.quantidadeMoradores != null && todosOsMoradoresCompletos && !limiteDeMoradoresAtingido;
  const pendencias = dados.quantidadeMoradores != null ? listarPendencias(dados) : [];
  const podeSalvar = Boolean(dados.bairro) && dados.quantidadeMoradores != null && pendencias.length === 0;

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

  function removerMorador(indice) {
    setDados((atual) => ({ ...atual, moradores: atual.moradores.filter((_, i) => i !== indice) }));
  }

  async function buscarCep() {
    setMensagemCep('');
    setBuscandoCep(true);
    try {
      const endereco = await buscarEnderecoPorCep(cep);
      const bairroEncontrado = bairros.find((b) => normalizar(b) === normalizar(endereco.bairro));
      if (bairroEncontrado) {
        setDados((atual) => ({ ...atual, bairro: bairroEncontrado }));
        setMensagemCep(`Endereço encontrado: ${endereco.logradouro}, ${endereco.bairro}.`);
      } else {
        setMensagemCep(
          `O CEP aponta pro bairro "${endereco.bairro}", que ainda não está na lista. Selecione o bairro manualmente.`,
        );
      }
    } catch (erroCep) {
      setMensagemCep(erroCep.message);
    } finally {
      setBuscandoCep(false);
    }
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
        <label className={styles.rotulo} htmlFor="campo-cep">
          CEP (opcional — preenche o bairro automaticamente)
        </label>
        <div className={styles.linhaCep}>
          <input
            id="campo-cep"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            className={styles.campoCep}
            value={cep}
            onChange={(evento) => setCep(evento.target.value)}
          />
          <button
            type="button"
            className={styles.botaoSecundario}
            disabled={buscandoCep || cep.trim() === ''}
            onClick={buscarCep}
          >
            {buscandoCep ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {mensagemCep && <p className={styles.mensagemCep}>{mensagemCep}</p>}
      </div>

      <div className={styles.campo}>
        <label className={styles.rotulo} htmlFor="campo-bairro">
          Bairro
        </label>
        <SeletorBairro
          id="campo-bairro"
          bairros={bairros}
          valor={dados.bairro}
          aoSelecionar={(bairro) => setDados((atual) => ({ ...atual, bairro }))}
        />
      </div>

      {dados.bairro && (
        <fieldset className={styles.campoFieldset}>
          <legend className={styles.rotulo}>Quantas pessoas moram aqui?</legend>
          <SeletorQuantidade
            valor={dados.quantidadeMoradores}
            aoSelecionar={(quantidadeMoradores) =>
              setDados((atual) => ({ ...atual, quantidadeMoradores }))
            }
          />
        </fieldset>
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
            aoRemover={dados.moradores.length > 1 ? () => removerMorador(indice) : undefined}
          />
        ))}

      {dados.quantidadeMoradores != null && (
        <div className={styles.consentimento}>
          <input
            type="checkbox"
            id="campo-consentimento"
            checked={dados.consentimento}
            onChange={(evento) =>
              setDados((atual) => ({ ...atual, consentimento: evento.target.checked }))
            }
          />
          <label htmlFor="campo-consentimento">
            O morador foi informado e consentiu em participar da pesquisa, com os dados
            usados de forma anônima e apenas para fins estatísticos.
          </label>
        </div>
      )}

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
          {limiteDeMoradoresAtingido && (
            <p className={styles.dica}>
              Todos os {dados.quantidadeMoradores} morador(es) da casa já foram adicionados.
            </p>
          )}
          {!salvo && pendencias.length > 0 && (
            <div className={styles.pendencias} role="status" aria-live="polite">
              <p>Para salvar esta casa, falta:</p>
              <ul>
                {pendencias.map((pendencia) => (
                  <li key={pendencia}>{pendencia}</li>
                ))}
              </ul>
            </div>
          )}
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
