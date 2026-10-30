import { describe, expect, it } from '@jest/globals';
import errors from '@js/core/errors';
import { format } from '@js/core/utils/string';

import { LIBRARIES } from './const';
import { SUBSCRIPTIONS, TEMPLATES } from './license_warnings';

interface CliTemplates {
  purchaseLicense: (version: string) => string;
  trialExpired: (version: string) => string;
  installationInstructions: (version: string) => string;
  keyVerificationFailed: (type: string, keyVersion: string, requiredVersion: string) => string;
}

/* eslint-disable global-require, @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const { TEMPLATES: CLI_TEMPLATES } = require('../../../../license/messages') as { TEMPLATES: CliTemplates };
/* eslint-enable global-require, @typescript-eslint/no-var-requires */
/* eslint-enable @typescript-eslint/no-require-imports */

describe('texts of the console and of the devextreme-license CLI', () => {
  const version = '26.2.3';

  it('should be the same for DX1000', () => {
    expect(TEMPLATES.purchaseLicense(version)).toBe(CLI_TEMPLATES.purchaseLicense(version));
  });

  it('should be the same for DX1001', () => {
    expect(TEMPLATES.installationInstructions(version))
      .toBe(CLI_TEMPLATES.installationInstructions(version));
  });

  it('should be the same for DX1002', () => {
    expect(TEMPLATES.keyVerificationFailed('incompatibleVersion', '25.1', '26.2'))
      .toBe(CLI_TEMPLATES.keyVerificationFailed('incompatibleVersion', 'v25.1', '26.2'));
  });

  it('should be the same for DX1004', () => {
    expect(format(errors.ERROR_MESSAGES.E0124, version, LIBRARIES, SUBSCRIPTIONS, ''))
      .toBe(CLI_TEMPLATES.trialExpired(version));
  });
});
