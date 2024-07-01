import { Validator } from './validator';

interface TestWidgetOptions {
  A: number;
  B: string;
}

const widgetOptions: TestWidgetOptions = {
  A: 5,
  B: '5',
};

describe('Validator', () => {
  it('should return "true" if there are no errors', () => {
    const validator = new Validator<TestWidgetOptions, number>(
      ({ A }) => A,
      [
        (): true => true,
        (): true => true,
        (): true => true,
      ],
    );

    const result = validator.validate(widgetOptions);

    expect(result).toBe(true);
  });

  it('should return "true" with empty rules array', () => {
    const validator = new Validator<TestWidgetOptions, number>(
      ({ A }) => A,
      [],
    );

    const result = validator.validate(widgetOptions);

    expect(result).toBe(true);
  });

  it('should return object with errors if some rules return errors', () => {
    const firstFailedRule = (): string => 'error_1';
    const secondFailedRule = (): string => 'error_2';

    Object.defineProperty(firstFailedRule, 'name', { value: 'rule_1', writable: false });
    Object.defineProperty(secondFailedRule, 'name', { value: 'rule_2', writable: false });

    const expectedResult = {
      rule_1: 'error_1',
      rule_2: 'error_2',
    };

    const validator = new Validator<TestWidgetOptions, number>(
      ({ A }) => A,
      [
        firstFailedRule,
        jest.fn(() => true),
        secondFailedRule,
      ],
    );

    const result = validator.validate(widgetOptions);

    expect(result).toEqual(expectedResult);
  });
});
