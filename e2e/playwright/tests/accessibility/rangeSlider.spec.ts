import type { Properties } from 'devextreme/ui/range_slider';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  start: [40],
  end: [60],
  disabled: [true, false],
  readOnly: [true, false],
  height: [undefined, 250],
  width: [undefined, '50%'],
  label: [
    {
      visible: true,
      format(value) {
        return `${value}%`;
      },
      position: 'top',
    },
  ],
  tooltip: [
    {
      enabled: true,
      format(value) {
        return `${value}%`;
      },
      showMode: 'always',
      position: 'bottom',
    },
  ],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxRangeSlider',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
