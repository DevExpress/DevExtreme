import {
  Children,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { ValidationContext } from '../contexts/validation-context';
import { CustomRule, CustomRule1, CustomRuleProps } from '../dummy-validation';
import { Rule } from '../types';
import { filterNodesByTypes } from '../utils';

export function useEditorValidationRulesInitialization(
  editorName: string,
  children: ReactNode | ReactNode[] = [],
) {
  const validationContext = useContext(ValidationContext);

  const ruleComponents = filterNodesByTypes(
    Children.toArray(children), [CustomRule, CustomRule1],
  ) || [];

  const validationRules = useMemo<Rule[]>(
    () => ruleComponents.map(
      (rule) => ((rule as ReactElement).props as CustomRuleProps),
    ),
    [ruleComponents],
  );

  useEffect(() => {
    validationContext?.initializeEditorRules(editorName, validationRules);
  }, [validationRules, editorName]);
}
