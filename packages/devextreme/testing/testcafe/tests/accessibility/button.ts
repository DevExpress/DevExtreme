import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/button.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const optionsWithSimpleItems: Options<Properties> = {
  useSubmitBehavior: [true, false],
  disabled: [true, false],
  hint: [undefined, 'hint'],
  icon: [undefined, 'user'],
  text: [undefined, 'text'],
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
  component: 'dxList',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
};

testAccessibility(configurationWithSimpleItems);
