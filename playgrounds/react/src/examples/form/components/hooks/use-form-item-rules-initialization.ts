import {
  ReactElement, ReactNode, useContext, useEffect, useMemo,
} from 'react';
import { ValidationContext } from '../contexts/validation-context';
import { CustomRuleProps } from '../dummy-validation';
import { Rule } from '../types';

export function useFormItemRulesInitialization(
  formItemName: string,
  ruleComponents: ReactNode[] = [],
) {
  const validationContext = useContext(ValidationContext);

  const validationRules = useMemo<Rule[]>(
    () => ruleComponents.map((rule) => {
      const props = (rule as ReactElement).props as CustomRuleProps;
      return props;
    }),
    [ruleComponents],
  );

  useEffect(() => {
    validationContext?.initializeEditorRules(formItemName, validationRules);
  }, [validationRules, formItemName]);
}
