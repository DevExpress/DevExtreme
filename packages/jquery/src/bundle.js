import { getWindow } from '@devextreme/interim';
import { RadioGroupCompatible } from './compatible-radio-group';
import { RadioButton } from './radio-button';

const window = getWindow();
window.DevExpress = window.DevExpress || {
  ui: {
    dxRadioButton: RadioButton,
    dxRadioGroup: RadioGroupCompatible,
  },
};
