import {
  Children,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { filterNodesByTypes } from '../../form/components/utils';
import {
  CustomRule,
  CustomRule1,
  CustomRuleProps,
} from '../components/dummy-validation';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { Rule } from '../types';

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
      (rule) => (rule as ReactElement).props as CustomRuleProps,
    ),
    [ruleComponents],
  );

  useEffect(() => {
    validationEngineContext?.initializeEditorRules(editorName, validationRules);
  }, [validationRules, editorName]);
}
