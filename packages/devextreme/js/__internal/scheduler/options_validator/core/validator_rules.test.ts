import { createValidatorRule } from '@ts/scheduler/options_validator/core/validator_rules';

describe('createValidatorRule', () => {
  it('should add the "name" property to the passed function', () => {
    const expectedResult = 'test-name';

    const result = createValidatorRule(expectedResult, () => true);

    expect(result.name).toBe(expectedResult);
  });
});
