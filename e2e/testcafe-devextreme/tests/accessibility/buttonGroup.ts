import { Properties } from 'devextreme/ui/button_group.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

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

const configurationWithSimpleItems: Configuration = {
  component: 'dxButtonGroup',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
};

testAccessibility(configurationWithSimpleItems);
