"use strict";

var _validator_rules = require("../../../scheduler/options_validator/core/validator_rules");
describe('createValidatorRule', () => {
  it('should add the "name" property to the passed function', () => {
    const expectedResult = 'test-name';
    const result = (0, _validator_rules.createValidatorRule)(expectedResult, () => true);
    expect(result.name).toBe(expectedResult);
  });
});