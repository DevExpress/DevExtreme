import {
  ReactElement, ReactNode, useContext, useEffect, useMemo,
} from 'react';
import { CustomRuleProps } from '../dummy-validation';
import { FormContext } from '../form-context';
import { Rule } from '../types';

export function useFormItemRulesInitialization(
  formItemName: string,
  ruleComponents: ReactNode[] = [],
) {
  const formContext = useContext(FormContext);

  const validationRules = useMemo<Rule[]>(
    () => ruleComponents.map((rule) => {
      const props = (rule as ReactElement).props as CustomRuleProps;
      return props;
    }),
    [ruleComponents],
  );

  useEffect(() => {
    formContext?.onValidationRulesInitialized(formItemName, validationRules);
  }, [validationRules, formItemName]);
}
