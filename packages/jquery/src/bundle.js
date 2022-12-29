import { getWindow } from '@devextreme/interim';
import { RadioGroupCompatible } from './radio-group';
import { RadioButton } from './radio-button';

const window = getWindow();
window.DevExpress = window.DevExpress || {
  ui: {
    dxRadioButton: RadioButton,
    dxRadioGroup: RadioGroupCompatible,
  },
};
