import {
  Children,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { CustomRule, CustomRule1, CustomRuleProps } from '../dummy-validation';
import { Rule } from '../types';
import { filterNodesByTypes } from '../utils';

export function useEditorValidationRulesInitialization(
  editorName: string,
  children: ReactNode | ReactNode[] = [],
) {
  const validationEngineContext = useContext(ValidationEngineContext);

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
    validationEngineContext?.initializeEditorRules(editorName, validationRules);
  }, [validationRules, editorName]);
}
