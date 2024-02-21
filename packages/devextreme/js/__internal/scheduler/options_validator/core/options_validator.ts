import type { OptionsValidatorErrors, OptionsValidatorResult } from './types';
import type { Validator } from './validator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidatorType<TWidgetOptions> = Validator<TWidgetOptions, any>;

export abstract class OptionsValidator<TValidators extends string, TWidgetOptions> {
  protected constructor(
    private readonly validators: Record<TValidators, ValidatorType<TWidgetOptions>>,
  ) {}

  validate(options: TWidgetOptions): OptionsValidatorResult<TValidators> {
    const errors = Object.entries<ValidatorType<TWidgetOptions>>(this.validators)
      .reduce<OptionsValidatorErrors<TValidators>>((
      result,
      [validatorName, validator],
    ) => {
      const validatorResult = validator.validate(options);

      if (validatorResult !== true) {
        result[validatorName] = validatorResult;
      }

      return result;
    }, {});

    return Object.keys(errors).length > 0
      ? errors
      : true;
  }
}
