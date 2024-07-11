"use strict";

var _license_validation = require("./license_validation");
/**
 * @jest-environment node
 */

describe('license token', () => {
  beforeEach(() => {
    (0, _license_validation.setLicenseCheckSkipCondition)(false);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('API inside trial_panel should not be triggered on the server', () => {
    expect(() => (0, _license_validation.validateLicense)('', '1.0.4')).not.toThrow();
  });
});