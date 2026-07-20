import styles from './AvatarCandidato.module.css';

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

function AvatarCandidato({ candidato }) {
  const corFundo = candidato.isFoco
    ? candidato.cargo === 'estadual'
      ? 'var(--cor-foco-estadual)'
      : 'var(--cor-foco-federal)'
    : 'var(--cor-concorrente-1)';

  if (candidato.fotoUrl) {
    return <img className={styles.avatar} src={candidato.fotoUrl} alt={candidato.nome} />;
  }

  return (
    <span className={styles.avatar} style={{ background: corFundo, color: '#fff' }}>
      {iniciais(candidato.nome)}
    </span>
  );
}

export default AvatarCandidato;
