import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/button_group.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

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
  hint: [undefined, 'hint'],
  selectionMode: ['multiple', 'none', 'single'],
  selectedItemKeys: [['text_1']],
  // NOTE: Doesn't matter if there are contrast issues
  // stylingMode: ['text', 'contained', 'outlined'],
  // type: ['danger', 'default', 'normal', 'success'],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const configurationWithSimpleItems: Configuration = {
  component: 'dxButtonGroup',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
};

testAccessibility(configurationWithSimpleItems);
