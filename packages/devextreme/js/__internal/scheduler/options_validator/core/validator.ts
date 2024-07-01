import type { ValidatorResult, ValidatorRule } from './types';

export class Validator<TWidgetOptions, TOption> {
  constructor(
    private readonly valueSelector: (options: TWidgetOptions) => TOption,
    private readonly rules: ValidatorRule<TOption>[],
  ) {
  }

  validate(options: TWidgetOptions): ValidatorResult {
    const value = this.valueSelector(options);

    const errors = this.rules
      .reduce<Record<string, string>>((result, rule) => {
      const validationResult = rule(value);

      if (validationResult !== true) {
        result[rule.name] = validationResult;
      }

      return result;
    }, {});

    return Object.keys(errors).length
      ? errors
      : true;
  }
}
