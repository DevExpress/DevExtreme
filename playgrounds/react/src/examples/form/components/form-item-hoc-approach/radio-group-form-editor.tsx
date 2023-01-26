import { RadioGroupEditor as RadioGroupWithValidator } from '../../../validation/components/enhanced-radio-group';
import { withFormContext } from './with-form-context';

export const RadioGroupEditor = withFormContext(RadioGroupWithValidator);
