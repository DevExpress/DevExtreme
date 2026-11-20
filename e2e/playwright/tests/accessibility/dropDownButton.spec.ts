import type { Properties } from 'devextreme/ui/drop_down_button';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];

const options: Options<Properties> = {
  dataSource: [[], items],
  text: [undefined, 'Download Trial'],
  icon: [undefined, 'save'],
  disabled: [true, false],
};

const a11yCheckConfig = {};

const noSplitButtonConfiguration: Configuration<Properties> = {
  component: 'dxDropDownButton',
  a11yCheckConfig,
  options: {
    ...options,
    splitButton: [false],
    showArrowIcon: [true, false],
  },
};
testAccessibility(noSplitButtonConfiguration);

const deferredConfiguration: Configuration<Properties> = {
  component: 'dxDropDownButton',
  name: 'split button deferred',
  a11yCheckConfig,
  options: {
    ...options,
    splitButton: [true],
    useSelectMode: [true, false],
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration<Properties> = {
  component: 'dxDropDownButton',
  name: 'split button not deferred',
  a11yCheckConfig,
  options: {
    ...options,
    splitButton: [true],
    useSelectMode: [true, false],
    opened: [false],
    deferRendering: [false],
  },
};

testAccessibility(noDeferredConfiguration);
