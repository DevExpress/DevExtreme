import { CustomRule as CustomRuleProps } from '@devextreme/interim';
import { useContext, useEffect, useRef } from 'react';
import { ValidatorContext } from '../contexts/validator-context';

export function CustomRule(props: CustomRuleProps) {
  const validatorContext = useContext(ValidatorContext);
  const ruleRegistered = useRef(false);
  useEffect(() => {
    if (!ruleRegistered.current) {
      validatorContext?.registerRule({ ...props, type: 'custom', reevaluate: true });
      ruleRegistered.current = true;
    }
  }, []);
  return null;
}
