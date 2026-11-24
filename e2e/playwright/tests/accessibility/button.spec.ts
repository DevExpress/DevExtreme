import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/button';
import Button from '../../models/button';
import { isMaterialBased } from '../../helpers/themeUtils';
import { defaultSelector, testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const optionsWithSimpleItems: Options<Properties> = {
  useSubmitBehavior: [true, false],
  disabled: [true, false],
  icon: [undefined, 'user'],
  text: [undefined, 'text'],
};

const created = async (page: Page, optionConfiguration: Properties): Promise<void> => {
  const { icon, text } = optionConfiguration;

  if (!(icon && text)) {
    const button = new Button(page, defaultSelector);

    await button.option({ elementAttr: { 'aria-label': 'aria-label' } });
  }
};

const a11yCheckConfig = (theme: string) => ({
  rules: {
    // NOTE: false positive in isMaterialBased
    'nested-interactive': { enabled: !isMaterialBased(theme) },
  },
});

const configurationWithSimpleItems: Configuration<Properties> = {
  component: 'dxButton',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
  created,
};

testAccessibility(configurationWithSimpleItems);
