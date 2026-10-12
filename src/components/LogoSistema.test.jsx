import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LogoSistema from './LogoSistema.jsx';

describe('LogoSistema', () => {
  it('mostra a logo oficial no tamanho pedido, escondida do leitor de tela', () => {
    const { container } = render(<LogoSistema tamanho={42} />);
    const moldura = container.firstChild;

    expect(moldura).toHaveAttribute('aria-hidden', 'true');
    expect(moldura).toHaveStyle({ width: '42px', height: '42px' });
    expect(moldura.querySelector('img')).toHaveAttribute('src', '/icons/icon-192.png');
  });
});
