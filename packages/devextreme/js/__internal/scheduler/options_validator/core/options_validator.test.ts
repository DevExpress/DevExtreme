import { OptionsValidator } from './options_validator';
import { Validator } from './validator';

type TestValidators = 'A' | 'B' | 'C';
interface TestWidgetOptions {
  A: number;
  B: string;
  C: boolean;
}

class TestOptionsValidator extends OptionsValidator<TestValidators, TestWidgetOptions> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(validators: Record<TestValidators, Validator<TestWidgetOptions, unknown>>) {
    super(validators);
  }
}

const widgetOptions = {
  A: 1,
  B: '1',
  C: true,
};

describe('OptionsValidator', () => {
  it('should call each validator\'s validate method', () => {
    const validators = [
      new Validator<TestWidgetOptions, unknown>(
        () => {},
        [],
      ),
      new Validator<TestWidgetOptions, unknown>(
        () => {},
        [],
      ),
      new Validator<TestWidgetOptions, unknown>(
        () => {},
        [],
      ),
    ];

    const validateSpies = validators.map((validator) => {
      const validateSpy = jest.spyOn(validator, 'validate');
      validateSpy.mockImplementation(() => true);
      return validateSpy;
    });

    const optionsValidator = new TestOptionsValidator({
      A: validators[0],
      B: validators[1],
      C: validators[2],
    });

    optionsValidator.validate(widgetOptions);

    expect(validateSpies[0]).toHaveBeenCalledWith(widgetOptions);
    expect(validateSpies[1]).toHaveBeenCalledWith(widgetOptions);
    expect(validateSpies[2]).toHaveBeenCalledWith(widgetOptions);
    validateSpies.forEach((spy) => { spy.mockReset(); });
  });

  it('should return true if all validators validates without errors', () => {
    const validator = new Validator<TestWidgetOptions, unknown>(
      () => {},
      [],
    );
    const validateSpy = jest.spyOn(validator, 'validate');
    validateSpy.mockImplementation(() => true);
    const optionsValidator = new TestOptionsValidator({
      A: validator,
      B: validator,
      C: validator,
    });

    const result = optionsValidator.validate(widgetOptions);

    expect(result).toBe(true);
    validateSpy.mockReset();
  });

  it('should return object with errors if some validators validates with errors', () => {
    const firstValidateResult = {
      required: 'false',
      isInteger: 'false',
    };
    const secondValidateResult = true;
    const thirdValidateResult = {
      someError: 'some message',
    };
    const expectedResult = {
      A: firstValidateResult,
      C: thirdValidateResult,
    };

    const validators = [
      new Validator<TestWidgetOptions, unknown>(
        () => {},
        [],
      ),
      new Validator<TestWidgetOptions, unknown>(
        () => {},
        [],
      ),
      new Validator<TestWidgetOptions, unknown>(
        () => {},
        [],
      ),
    ];

    const firstValidateSpy = jest.spyOn(validators[0], 'validate');
    const secondValidateSpy = jest.spyOn(validators[1], 'validate');
    const thirdValidateSpy = jest.spyOn(validators[2], 'validate');
    firstValidateSpy.mockImplementation(() => firstValidateResult);
    secondValidateSpy.mockImplementation(() => secondValidateResult);
    thirdValidateSpy.mockImplementation(() => thirdValidateResult);

    const optionsValidator = new TestOptionsValidator({
      A: validators[0],
      B: validators[1],
      C: validators[2],
    });

    const result = optionsValidator.validate(widgetOptions);

    expect(result).toEqual(expectedResult);
    firstValidateSpy.mockReset();
    secondValidateSpy.mockReset();
    thirdValidateSpy.mockReset();
  });
});
