import { getWindow } from '@devextreme/interim';
import { RadioButton } from './radio-button';
import { RadioGroupCompatible } from './radio-group';

const window = getWindow();
window.DevExpress = window.DevExpress || {
  ui: {
    dxRadioButton: RadioButton,
    dxRadioGroup: RadioGroupCompatible,
  },
};
