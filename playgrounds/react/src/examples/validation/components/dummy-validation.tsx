import { useContext, useEffect } from 'react';
import { ValidatorContext } from '../contexts/validator-context';
import { Rule } from '../types';

export type CustomRuleProps = Rule;

export function CustomRule(props: CustomRuleProps) {
  const validatorContext = useContext(ValidatorContext);
  useEffect(() => {
    validatorContext?.registerRule(props);
  }, []);
  return null;
}

export function CustomRule1(props: CustomRuleProps) {
  const validatorContext = useContext(ValidatorContext);
  useEffect(() => {
    validatorContext?.registerRule(props);
  }, []);
  return null;
}
