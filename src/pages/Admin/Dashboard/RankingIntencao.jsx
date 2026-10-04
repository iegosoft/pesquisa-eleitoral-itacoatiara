import { useEffect, useRef } from 'react';
import AvatarCandidato from '../../../components/AvatarCandidato.jsx';
import styles from './RankingIntencao.module.css';

function formatarPercentual(valor) {
  return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

// O candidato foco leva a cor do próprio resultado (lidera/empata/perde);
// concorrentes ficam em cinza sólido e indeciso/branco num cinza apagado.
function classeDaBarra(item, statusFoco) {
  if (item.tipo !== 'candidato') return styles.barraNeutra;
  if (item.isFoco) return styles[`barra_${statusFoco}`] ?? styles.barraConcorrente;
  return styles.barraConcorrente;
}

function FotoItem({ item }) {
  if (item.tipo === 'candidato') {
    return (
      <AvatarCandidato
        candidato={{ nome: item.rotulo, cargo: item.cargo, fotoUrl: item.fotoUrl }}
        className={styles.foto}
        decorativo
      />
    );
  }
  return (
    <span className={`${styles.foto} ${styles.fotoNeutra}`} aria-hidden="true">
      {item.tipo === 'indeciso' ? '?' : '–'}
    </span>
  );
}

// Onde o candidato clicado é forte e onde é fraco, bairro a bairro. O foco vai
// para o título ao abrir, para quem usa teclado ou leitor de tela.
function DetalheCandidato({ id, candidato, linhas, aoFechar }) {
  const titulo = useRef(null);

  useEffect(() => {
    titulo.current?.focus();
  }, [candidato.chave]);

  return (
    <section id={id} className={styles.detalhe} aria-labelledby={`${id}-titulo`}>
      <div className={styles.detalheCabecalho}>
        <h4 id={`${id}-titulo`} ref={titulo} tabIndex={-1}>
          {candidato.rotulo} bairro a bairro
        </h4>
        <button type="button" className={styles.botaoFechar} onClick={aoFechar}>
          Fechar
        </button>
      </div>
      <ul className={styles.detalheLista}>
        {linhas.map((linha) => (
          <li key={linha.bairro} className={linha.amostraPequena ? styles.detalheAmostraPequena : ''}>
            <span className={styles.detalheBairro}>{linha.bairro}</span>
            <span className={styles.detalheTrilho} aria-hidden="true">
              <span className={styles.detalheBarra} style={{ width: `${linha.percentual}%` }} />
            </span>
            <span className={styles.detalhePercentual}>{formatarPercentual(linha.percentual)}</span>
            <span className={styles.detalheVotos}>
              {linha.votos} de {linha.entrevistas} {linha.entrevistas === 1 ? 'entrevista' : 'entrevistas'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RankingIntencao({ titulo, cargo, itens, statusFoco, base, candidatoAberto, detalhe, aoAlternarCandidato }) {
  const maior = Math.max(...itens.map((item) => item.percentual), 1);
  const idDetalhe = `detalhe-candidato-${cargo}`;
  const aberto = itens.find((item) => item.chave === candidatoAberto);

  return (
    <div className={styles.cartao}>
      <div className={styles.cabecalho}>
        <h3>{titulo}</h3>
        <span className={styles.base}>
          Base: {base.toLocaleString('pt-BR')} {base === 1 ? 'entrevistado' : 'entrevistados'}
        </span>
      </div>

      <ol className={styles.lista}>
        {itens.map((item, indice) => (
          <li
            key={item.chave}
            className={`${styles.item} ${item.isFoco ? styles.itemFoco : ''} ${candidatoAberto === item.chave ? styles.itemAberto : ''}`}
          >
            <FotoItem item={item} />
            <div className={styles.identificacao}>
              <span className={styles.nome}>
                {item.tipo === 'candidato' ? (
                  <button
                    type="button"
                    className={styles.botaoNome}
                    aria-expanded={candidatoAberto === item.chave}
                    aria-controls={idDetalhe}
                    title="Ver o desempenho bairro a bairro"
                    onClick={() => aoAlternarCandidato(item.chave)}
                  >
                    {item.rotulo}
                  </button>
                ) : (
                  item.rotulo
                )}
                {item.isFoco && <span className={styles.seloFoco}>Foco</span>}
              </span>
              {item.partido && <span className={styles.partido}>{item.partido}</span>}
            </div>
            <div className={styles.trilho} aria-hidden="true">
              <span
                className={`${styles.barra} ${classeDaBarra(item, statusFoco)}`}
                style={{ width: `${(item.percentual / maior) * 100}%`, animationDelay: `${indice * 70}ms` }}
              />
            </div>
            <span className={styles.valores}>
              <span className={styles.percentual}>{formatarPercentual(item.percentual)}</span>
              <span className={styles.votos}>
                {item.quantidade} {item.quantidade === 1 ? 'voto' : 'votos'}
              </span>
            </span>
          </li>
        ))}
      </ol>

      {aberto && detalhe && (
        <DetalheCandidato id={idDetalhe} candidato={aberto} linhas={detalhe} aoFechar={() => aoAlternarCandidato(aberto.chave)} />
      )}
    </div>
  );
}

export default RankingIntencao;
