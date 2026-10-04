import { useState } from 'react';
import { atualizarEntrevistado, excluirEntrevistado } from '../../../services/entrevistas.js';
import { nomeDoVoto } from '../Dados/resolverVoto.js';
import styles from './PainelEntrevistas.module.css';

const OPCOES_SEXO = [
  { valor: 'feminino', rotulo: 'Feminino' },
  { valor: 'masculino', rotulo: 'Masculino' },
];
const OPCOES_FAIXA = ['16-24', '25-34', '35-44', '45-59', '60+'];
const VOTOS_NEUTROS = [
  { valor: 'indeciso', rotulo: 'Indeciso' },
  { valor: 'branco_nulo', rotulo: 'Branco/Nulo' },
];

function opcoesDeVoto(candidatos, cargo) {
  return [
    ...candidatos.filter((candidato) => candidato.cargo === cargo).map((c) => ({ valor: c.id, rotulo: c.nome })),
    ...VOTOS_NEUTROS,
  ];
}

function rotuloSexo(valor) {
  return OPCOES_SEXO.find((opcao) => opcao.valor === valor)?.rotulo ?? valor;
}

function CampoSelecao({ rotulo, valor, opcoes, aoMudar }) {
  return (
    <select className={styles.campoTabela} aria-label={rotulo} value={valor ?? ''} onChange={(e) => aoMudar(e.target.value)}>
      {opcoes.map((opcao) => (
        <option key={opcao.valor} value={opcao.valor}>
          {opcao.rotulo}
        </option>
      ))}
    </select>
  );
}

function LinhaMorador({ casa, morador, numero, ultimoDaCasa, candidatos, aoInformar }) {
  const [modo, setModo] = useState('ver');
  const [rascunho, setRascunho] = useState(morador);
  const [ocupado, setOcupado] = useState(false);
  const quem = `morador ${numero} da casa de ${casa.bairro}`;

  function comecarEdicao() {
    setRascunho(morador);
    setModo('editar');
  }

  async function salvar() {
    setOcupado(true);
    try {
      await atualizarEntrevistado(casa.id, morador.id, rascunho);
      setModo('ver');
      aoInformar(`Dados do ${quem} corrigidos.`);
    } catch {
      aoInformar(`Não foi possível salvar a correção do ${quem}. Tente novamente.`, 'erro');
    } finally {
      setOcupado(false);
    }
  }

  async function excluir() {
    setOcupado(true);
    try {
      await excluirEntrevistado(casa.id, morador.id, { ultimoDaCasa });
      aoInformar(ultimoDaCasa ? `O ${quem} foi excluído, e a casa também (era o último).` : `O ${quem} foi excluído.`);
    } catch {
      setOcupado(false);
      aoInformar(`Não foi possível excluir o ${quem}. Tente novamente.`, 'erro');
    }
  }

  if (modo === 'editar') {
    const atualizar = (campo) => (valor) => setRascunho((atual) => ({ ...atual, [campo]: valor }));
    return (
      <tr className={styles.linhaEditando}>
        <th scope="row">{numero}</th>
        <td>
          <CampoSelecao rotulo={`Sexo do ${quem}`} valor={rascunho.sexo} opcoes={OPCOES_SEXO} aoMudar={atualizar('sexo')} />
        </td>
        <td>
          <CampoSelecao
            rotulo={`Faixa etária do ${quem}`}
            valor={rascunho.faixaIdade}
            opcoes={OPCOES_FAIXA.map((faixa) => ({ valor: faixa, rotulo: faixa }))}
            aoMudar={atualizar('faixaIdade')}
          />
        </td>
        <td>
          <CampoSelecao
            rotulo={`Voto federal do ${quem}`}
            valor={rascunho.votoFederal}
            opcoes={opcoesDeVoto(candidatos, 'federal')}
            aoMudar={atualizar('votoFederal')}
          />
        </td>
        <td>
          <CampoSelecao
            rotulo={`Voto estadual do ${quem}`}
            valor={rascunho.votoEstadual}
            opcoes={opcoesDeVoto(candidatos, 'estadual')}
            aoMudar={atualizar('votoEstadual')}
          />
        </td>
        <td className={styles.acoes}>
          <button type="button" className={styles.botaoPrimario} onClick={salvar} disabled={ocupado}>
            {ocupado ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className={styles.botaoSecundario} onClick={() => setModo('ver')} disabled={ocupado}>
            Cancelar
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <th scope="row">{numero}</th>
      <td>{rotuloSexo(morador.sexo)}</td>
      <td>{morador.faixaIdade}</td>
      <td>{nomeDoVoto(morador.votoFederal, candidatos)}</td>
      <td>{nomeDoVoto(morador.votoEstadual, candidatos)}</td>
      <td className={styles.acoes}>
        {modo === 'confirmarExclusao' ? (
          <div className={styles.confirmacaoLinha} role="alertdialog" aria-label={`Confirmar exclusão do ${quem}`}>
            <span>
              {ultimoDaCasa ? 'É o último entrevistado: a casa também será excluída. Confirmar?' : 'Excluir este morador?'}
            </span>
            <button type="button" className={styles.botaoPerigoPreenchido} onClick={excluir} disabled={ocupado}>
              {ocupado ? 'Excluindo...' : 'Sim, excluir'}
            </button>
            <button type="button" className={styles.botaoSecundario} onClick={() => setModo('ver')} disabled={ocupado}>
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <button type="button" className={styles.botaoSecundario} onClick={comecarEdicao} aria-label={`Corrigir ${quem}`}>
              Corrigir
            </button>
            <button
              type="button"
              className={styles.botaoPerigo}
              onClick={() => setModo('confirmarExclusao')}
              aria-label={`Excluir ${quem}`}
            >
              Excluir
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default LinhaMorador;
