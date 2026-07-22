import { useEffect, useState } from 'react';
import BarraTopo from '../../components/BarraTopo.jsx';
import BannerInstalacao from '../../components/BannerInstalacao.jsx';
import FormularioCasa from '../../components/coleta/FormularioCasa.jsx';
import { useAuth } from '../../contexts/useAuth.js';
import { observarBairros } from '../../services/bairros.js';
import { observarCandidatosPorCargo } from '../../services/candidatos.js';
import { salvarResidencia } from '../../services/residencias.js';
import styles from './PaginaColeta.module.css';

function PaginaColeta() {
  const { usuarioAuth } = useAuth();
  const [casasComFalha, setCasasComFalha] = useState(0);
  const [bairros, setBairros] = useState([]);
  const [candidatosFederal, setCandidatosFederal] = useState([]);
  const [candidatosEstadual, setCandidatosEstadual] = useState([]);

  useEffect(() => {
    const cancelarBairros = observarBairros(setBairros);
    const cancelarFederal = observarCandidatosPorCargo('federal', setCandidatosFederal);
    const cancelarEstadual = observarCandidatosPorCargo('estadual', setCandidatosEstadual);
    return () => {
      cancelarBairros();
      cancelarFederal();
      cancelarEstadual();
    };
  }, []);

  function aoSalvar(dados) {
    // O Firestore grava no cache local na hora e sincroniza sozinho quando
    // a internet voltar, então não esperamos a confirmação do servidor pra
    // liberar o pesquisador pra próxima casa — por isso não relançamos o
    // erro aqui, só contabilizamos pra avisar na tela se algo falhar de
    // verdade (não só ficar pendente por falta de sinal).
    salvarResidencia({
      bairro: dados.bairro,
      pesquisadorId: usuarioAuth.uid,
      qtdMoradores: dados.quantidadeMoradores,
      entrevistados: dados.moradores,
    }).catch((erro) => {
      console.error('Falha ao salvar residência:', erro);
      setCasasComFalha((atual) => atual + 1);
    });
    return Promise.resolve();
  }

  return (
    <>
      <BarraTopo />
      <main className={styles.pagina}>
        <div className={styles.cartaoPrincipal}>
          <BannerInstalacao />

          {casasComFalha > 0 && (
            <p className={styles.avisoFalha}>
              {casasComFalha === 1
                ? '1 casa não conseguiu salvar. Avise o administrador.'
                : `${casasComFalha} casas não conseguiram salvar. Avise o administrador.`}
            </p>
          )}

          <h1>Nova casa</h1>

          <FormularioCasa
            bairros={bairros}
            candidatosFederal={candidatosFederal}
            candidatosEstadual={candidatosEstadual}
            aoSalvar={aoSalvar}
          />
        </div>
      </main>
    </>
  );
}

export default PaginaColeta;
