import type { Properties } from 'devextreme/ui/button_group';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const elementAttr = { 'aria-label': 'aria-label' };

const optionsWithSimpleItems: Options<Properties> = {
  items: [
    [],
    [{ elementAttr }, { elementAttr }],
    [{ text: 'text_1' }, { text: 'text_2' }],
    [{ icon: 'user' }, { icon: 'check' }],
    [{ text: 'text_1' }, { text: 'text_2', disabled: true }],
  ],
  disabled: [true, false],
  selectionMode: ['multiple', 'none', 'single'],
  selectedItemKeys: [['text_1']],
};

const a11yCheckConfig = {};

const configurationWithSimpleItems: Configuration<Properties> = {
  component: 'dxButtonGroup',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
};

testAccessibility(configurationWithSimpleItems);
