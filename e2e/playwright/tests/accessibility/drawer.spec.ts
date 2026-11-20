import type { Properties } from 'devextreme/ui/drawer';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  height: [400],
  disabled: [true, false],
  revealMode: ['slide', 'expand'],
  opened: [true, false],
  template: [() => {
    const $drawerContent = $('<div>').width(200).css('height', '100%');
    return $drawerContent;
  }],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxDrawer',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
