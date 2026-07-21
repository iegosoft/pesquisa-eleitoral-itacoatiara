import { useEffect, useState } from 'react';
import { usePromptInstalacao } from '../hooks/usePromptInstalacao.js';
import styles from './BannerInstalacao.module.css';

const CHAVE_DISPENSADO = 'pei_banner_instalacao_dispensado';

function estaEmModoStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function ehIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function ehMobile() {
  return /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function BannerInstalacao() {
  const { podeInstalar, instalar } = usePromptInstalacao();
  const [dispensado, setDispensado] = useState(() => localStorage.getItem(CHAVE_DISPENSADO) === '1');
  const [instalado, setInstalado] = useState(estaEmModoStandalone);

  useEffect(() => {
    function aoInstalar() {
      setInstalado(true);
    }
    window.addEventListener('appinstalled', aoInstalar);
    return () => window.removeEventListener('appinstalled', aoInstalar);
  }, []);

  function dispensar() {
    localStorage.setItem(CHAVE_DISPENSADO, '1');
    setDispensado(true);
  }

  async function aoClicarInstalar() {
    await instalar();
    dispensar();
  }

  if (instalado || dispensado || !ehMobile()) return null;
  if (!podeInstalar && !ehIOS()) return null;

  return (
    <div className={styles.banner}>
      {podeInstalar ? (
        <>
          <span>Instale este app na tela inicial pra acessar mais rápido, sem precisar abrir o navegador.</span>
          <div className={styles.acoes}>
            <button type="button" className={styles.botaoPrimario} onClick={aoClicarInstalar}>
              Instalar
            </button>
            <button type="button" className={styles.botaoTexto} onClick={dispensar}>
              Agora não
            </button>
          </div>
        </>
      ) : (
        <>
          <span>
            Pra instalar: toque no botão de compartilhar do navegador e escolha "Adicionar à Tela de Início".
          </span>
          <button type="button" className={styles.botaoTexto} onClick={dispensar}>
            Entendi
          </button>
        </>
      )}
    </div>
  );
}

export default BannerInstalacao;
