import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

// Teste de regressao do Bug 3 / issue #3 (TP1/docs/bugs-e-classificacao.md): o
// uuid instalado transitivamente pelo exceljs precisa ficar fora da faixa
// vulneravel (< 11.1.1, CVE-2026-41907). Sem o "overrides" no package.json,
// esse teste falha porque o uuid resolvido fica em 8.3.2.
describe('dependencia uuid (CVE-2026-41907)', () => {
  it('resolve para uma versao >= 11.1.1, fora da faixa vulneravel', () => {
    const { version } = require('uuid/package.json');
    const [major, minor, patch] = version.split('.').map(Number);

    const foraDaFaixaVulneravel =
      major > 11 || (major === 11 && (minor > 1 || (minor === 1 && patch >= 1)));

    expect(foraDaFaixaVulneravel).toBe(true);
  });
});
