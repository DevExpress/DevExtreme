import { getWindow } from '@devextreme/interim';
import { RadioButton } from './radio-button';

const window = getWindow();
window.DevExpress = window.DevExpress || {
  ui: {
    dxRadioButton: RadioButton,
  },
};
