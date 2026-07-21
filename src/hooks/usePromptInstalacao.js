import { useEffect, useState } from 'react';

// No Android/Chrome o navegador dispara esse evento oferecendo o prompt
// nativo de instalação; no iOS/Safari ele nunca existe, por isso o banner
// trata os dois casos separadamente.
function usePromptInstalacao() {
  const [eventoInstalacao, setEventoInstalacao] = useState(null);

  useEffect(() => {
    function aoDispararEvento(evento) {
      evento.preventDefault();
      setEventoInstalacao(evento);
    }
    window.addEventListener('beforeinstallprompt', aoDispararEvento);
    return () => window.removeEventListener('beforeinstallprompt', aoDispararEvento);
  }, []);

  async function instalar() {
    if (!eventoInstalacao) return;
    await eventoInstalacao.prompt();
    await eventoInstalacao.userChoice;
    setEventoInstalacao(null);
  }

  return { podeInstalar: Boolean(eventoInstalacao), instalar };
}

export { usePromptInstalacao };
