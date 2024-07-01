export type ValidatorRuleResult = true | string;
export type ValidatorRule<TValue> = (value: TValue) => ValidatorRuleResult;

export type ValidatorErrors = Record<string, string>;
export type ValidatorResult = true | ValidatorErrors;

export type OptionsValidatorErrors<TValidators extends string> =
  Partial<Record<TValidators, ValidatorErrors>>;
export type OptionsValidatorResult<TValidators extends string> =
  true | OptionsValidatorErrors<TValidators>;

export interface GlobalErrorHandler {
  logError: (errorCode: string) => void;
  throwError: (errorCode: string) => void;
}

// TODO: This export just a workaround for SystemJS issue
//  with ts files that contains only type definitions.
export const REDUNDANT_EXPORT = undefined;
