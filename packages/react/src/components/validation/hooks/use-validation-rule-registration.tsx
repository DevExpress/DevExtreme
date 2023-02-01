import { ValidationRule, ValidationRuleType } from '@devextreme/interim';
import { useContext, useEffect, useRef } from 'react';
import { ValidatorContext } from '../contexts/validator-context';

export function useValidationRuleRegistration(
  type: ValidationRuleType,
  props: ValidationRule,
) {
  const validatorContext = useContext(ValidatorContext);
  const ruleRegistered = useRef(false);
  useEffect(() => {
    if (!ruleRegistered.current) {
      validatorContext?.registerRule({ ...props, type, reevaluate: true });
      ruleRegistered.current = true;
    }
  }, []);
}
