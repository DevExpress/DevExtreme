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

  test('API inside trial_panel should not be triggered in Angular, where HTMLElement is mocked', () => {
    if (global.HTMLElement) {
      throw Error('Wrong environment for this test!');
    }

    try {
      // @ts-expect-error mocking HTMLElement with a symbol
      global.HTMLElement = Symbol('HTMLElement mock');
      expect(() => validateLicense('', '1.0.4')).not.toThrow();
    } finally {
      // @ts-expect-error removing the mock
      delete global.HTMLElement;
    }
  });
});
