import type { ValidatorRule } from './types';

export const createValidatorRule = <TValue>(
  name: string,
  ruleFunc: ValidatorRule<TValue>,
): ValidatorRule<TValue> => {
  Object.defineProperty(ruleFunc, 'name', { value: name, writable: false });
  return ruleFunc;
};
