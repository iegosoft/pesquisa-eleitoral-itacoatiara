import { useEffect, useState } from 'react';
import AvatarCandidato from '../../components/AvatarCandidato.jsx';
import SeletorPills from '../../components/SeletorPills.jsx';
import { criarCandidato, atualizarCandidato } from '../../services/candidatos.js';
import styles from './FormularioCandidato.module.css';

const OPCOES_CARGO = [
  { valor: 'federal', rotulo: 'Deputado Federal' },
  { valor: 'estadual', rotulo: 'Deputado Estadual' },
];

function estadoInicial(candidatoEmEdicao) {
  if (candidatoEmEdicao) {
    return {
      nome: candidatoEmEdicao.nome,
      partido: candidatoEmEdicao.partido,
      cargo: candidatoEmEdicao.cargo,
      fotoUrl: candidatoEmEdicao.fotoUrl,
      isFoco: candidatoEmEdicao.isFoco,
    };
  }
  return { nome: '', partido: '', cargo: 'federal', fotoUrl: '', isFoco: false };
}

function FormularioCandidato({ candidatoEmEdicao, aoConcluir, aoCancelar }) {
  const [form, setForm] = useState(() => estadoInicial(candidatoEmEdicao));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setForm(estadoInicial(candidatoEmEdicao));
    setErro('');
  }, [candidatoEmEdicao]);

  const podeSalvar = form.nome.trim() && form.partido.trim() && form.cargo;

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      if (candidatoEmEdicao) {
        await atualizarCandidato(candidatoEmEdicao.id, form);
      } else {
        await criarCandidato(form);
      }
      aoConcluir();
    } catch {
      setErro('Não foi possível salvar o candidato. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className={styles.formulario} onSubmit={aoEnviar}>
      <h2>{candidatoEmEdicao ? 'Editar candidato' : 'Novo candidato'}</h2>

      <div className={styles.previa}>
        <AvatarCandidato
          candidato={{ nome: form.nome || '?', fotoUrl: form.fotoUrl, isFoco: form.isFoco, cargo: form.cargo }}
        />
      </div>

      <label className={styles.campo}>
        Nome
        <input
          type="text"
          className={styles.campoTexto}
          value={form.nome}
          onChange={(evento) => atualizarCampo('nome', evento.target.value)}
          required
        />
      </label>

      <label className={styles.campo}>
        Partido
        <input
          type="text"
          className={styles.campoTexto}
          value={form.partido}
          onChange={(evento) => atualizarCampo('partido', evento.target.value)}
          required
        />
      </label>

      <div className={styles.campo}>
        <span>Cargo</span>
        <SeletorPills
          opcoes={OPCOES_CARGO}
          valorSelecionado={form.cargo}
          aoSelecionar={(valor) => atualizarCampo('cargo', valor)}
        />
      </div>

      <label className={styles.campo}>
        URL da foto (opcional — link de uma imagem já hospedada)
        <input
          type="url"
          className={styles.campoTexto}
          placeholder="https://..."
          value={form.fotoUrl}
          onChange={(evento) => atualizarCampo('fotoUrl', evento.target.value)}
        />
      </label>

      <label className={styles.campoCheckbox}>
        <input
          type="checkbox"
          checked={form.isFoco}
          onChange={(evento) => atualizarCampo('isFoco', evento.target.checked)}
        />
        Marcar como candidato foco (destacado nos gráficos)
      </label>

      {erro && <p className={styles.erro}>{erro}</p>}

      <div className={styles.acoes}>
        {candidatoEmEdicao && (
          <button type="button" className={styles.botaoSecundario} onClick={aoCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className={styles.botaoPrimario} disabled={!podeSalvar || salvando}>
          {salvando ? 'Salvando...' : candidatoEmEdicao ? 'Salvar alterações' : 'Cadastrar candidato'}
        </button>
      </div>
    </form>
  );
}

export default FormularioCandidato;
