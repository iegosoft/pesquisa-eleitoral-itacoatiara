import { useEffect, useState } from 'react';
import { iniciais } from '../utils/texto.js';
import styles from './AvatarCandidato.module.css';

// `decorativo`: quando o nome já aparece em texto ao lado, a foto não repete
// o nome para o leitor de tela.
function AvatarCandidato({ candidato, className = '', decorativo = false }) {
  const [falhouAoCarregar, setFalhouAoCarregar] = useState(false);

  useEffect(() => {
    setFalhouAoCarregar(false);
  }, [candidato.fotoUrl]);

  // Cor pela eleição (federal/estadual), igual em todo o sistema — não
  // varia por foco/concorrente, isso é sinalizado à parte (selo "Foco").
  const corFundo = candidato.cargo === 'estadual' ? 'var(--cor-foco-estadual)' : 'var(--cor-foco-federal)';

  if (candidato.fotoUrl && !falhouAoCarregar) {
    return (
      <img
        className={`${styles.avatar} ${className}`}
        src={candidato.fotoUrl}
        alt={decorativo ? '' : candidato.nome}
        onError={() => setFalhouAoCarregar(true)}
      />
    );
  }

  return (
    <span className={`${styles.avatar} ${className}`} aria-hidden={decorativo || undefined} style={{ background: corFundo, color: '#fff' }}>
      {iniciais(candidato.nome)}
    </span>
  );
}

export default AvatarCandidato;
