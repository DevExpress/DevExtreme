import { RadioGroup } from '@devextreme/react';
import { withEditor } from '../hocs/with-editor';
import { withValidation } from '../hocs/with-validation';

export const RadioGroupValidatedEditor = withValidation(RadioGroup);

export const RadioGroupEditor = withEditor(RadioGroup);
