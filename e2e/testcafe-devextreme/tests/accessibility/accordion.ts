import { Properties } from 'devextreme/ui/accordion.d';
import { Selector as $ } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  dataSource: [items],
  disabled: [true, false],
  deferRendering: [true, false],
  hint: [undefined, 'hint'],
  multiple: [true, false],
  focusStateEnabled: [true],
};

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const { disabled, multiple } = optionConfiguration;

  if (disabled || !multiple) {
    return;
  }

  const itemTitle = $('.dx-accordion-item-title');

  await t
    .click(itemTitle.nth(0));

  await t
    .click(itemTitle.nth(1));
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxAccordion',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
