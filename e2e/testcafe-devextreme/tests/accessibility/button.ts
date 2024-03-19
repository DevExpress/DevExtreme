import { ClientFunction } from 'testcafe';
import { isMaterialBased } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from 'devextreme/ui/button.d';
import Button from 'devextreme-testcafe-models/button';

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

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const { icon, text } = optionConfiguration;

  if (!(icon && text)) {
    const button = new Button(defaultSelector);

    await ClientFunction(() => {
      (button.getInstance() as any).option({ elementAttr: { 'aria-label': 'aria-label' } });
    }, {
      dependencies: { button },
    })();
  }
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
    // NOTE: false positive in isMaterialBased
    'nested-interactive': { enabled: !isMaterialBased() },
  },
};

const configurationWithSimpleItems: Configuration = {
  component: 'dxButton',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
  created,
};

testAccessibility(configurationWithSimpleItems);
