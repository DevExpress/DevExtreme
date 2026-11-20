import type { Properties } from 'devextreme/ui/slider';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  value: [45],
  min: [undefined, 10],
  max: [undefined, 90],
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

const availabilityConfiguration: Configuration<Properties> = {
  component: 'dxSlider',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const appearanceConfiguration: Configuration<Properties> = {
  component: 'dxSlider',
  name: 'appearance',
  a11yCheckConfig,
  options: {
    ...options,
    name: ['', 'name'],
    height: [undefined, 250],
    width: [undefined, '50%'],
  },
};

testAccessibility(appearanceConfiguration);
