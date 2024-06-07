/**
 * @jest-environment node
 */
import {
  setLicenseCheckSkipCondition,
  validateLicense,
} from './license_validation';

describe('license token', () => {
  beforeEach(() => {
    setLicenseCheckSkipCondition(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('API inside trial_panel should not be triggered on the server', () => {
    expect(() => validateLicense('', '1.0.4')).not.toThrow();
  });
});
