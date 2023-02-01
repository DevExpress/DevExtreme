import {
  CustomRule as CustomRuleProps,
  RangeRule as RangeRuleProps,
} from '@devextreme/interim';
import { useValidationRuleRegistration } from '../hooks/use-validation-rule-registration';

export function CustomRule(props: CustomRuleProps) {
  useValidationRuleRegistration('custom', props);
  return null;
}

export function RangeRule(props: RangeRuleProps) {
  useValidationRuleRegistration('range', props);
  return null;
}
