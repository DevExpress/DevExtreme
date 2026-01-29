export interface ValidatorRuleError {
  arguments?: string[];
}
export type ValidatorRuleResult = boolean | ValidatorRuleError;
export type ValidatorRule<TValue> = (value: TValue) => ValidatorRuleResult;

export type ValidatorErrors = Record<string, ValidatorRuleResult>;
export type ValidatorResult = true | ValidatorErrors;

export type OptionsValidatorErrors<
  TValidators extends string,
> = Partial<Record<TValidators, ValidatorErrors>>;
export type OptionsValidatorResult<
  TValidators extends string,
> = true | OptionsValidatorErrors<TValidators>;

export interface GlobalErrorHandler {
  logError: (errorCode: string, ...args: string[]) => void;
  throwError: (errorCode: string, ...args: string[]) => void;
}

// This export just a workaround for SystemJS issue
//  with ts files that contains only type definitions.
export const REDUNDANT_EXPORT = undefined;
