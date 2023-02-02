import {
  CustomRule as CustomRuleProps,
  RangeRule as RangeRuleProps,
} from '@devextreme/interim';
import { useValidationRuleRegistration } from '../hooks/use-validation-rule-registration';

//* Component={"name":"CustomRule", "jQueryRegistered":true}
export function CustomRule(props: CustomRuleProps) {
  useValidationRuleRegistration('custom', props);
  return null;
}

//* Component={"name":"RangeRule", "jQueryRegistered":true}
export function RangeRule(props: RangeRuleProps) {
  useValidationRuleRegistration('range', props);
  return null;
}
