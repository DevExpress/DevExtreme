import { useContext, useEffect, useRef } from 'react';
import { ValidatorContext } from '../contexts/validator-context';
import { Rule } from '../types';

export type CustomRuleProps = Rule;

export function CustomRule(props: CustomRuleProps) {
  const validatorContext = useContext(ValidatorContext);
  const ruleRegistered = useRef(false);
  useEffect(() => {
    if (!ruleRegistered.current) {
      validatorContext?.registerRule(props);
      ruleRegistered.current = true;
    }
  }, []);
  return null;
}
