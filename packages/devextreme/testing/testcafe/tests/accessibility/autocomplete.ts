import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { isMaterial, isMaterialBased } from '../../helpers/themeUtils';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/autocomplete.d';
import Autocomplete from '../../model/autocomplete';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = ['A', 'Aa', 'B'];

const options: Options<Properties> = {
  dataSource: [[], items],
  placeholder: [undefined, 'placeholder'],
  showClearButton: [true, false],
  value: [undefined, 'A'],
  disabled: [true, false],
  searchTimeout: [0],
  buttons: [
    undefined,
    [
      {
        name: 'today',
        location: 'before',
        options: {
          text: 'Today',
          stylingMode: 'text',
          onClick: () => {},
        },
      },
    ],
  ],
};

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  if (optionConfiguration.disabled) {
    return;
  }

  const autocomplete = new Autocomplete(defaultSelector);
  const { input } = autocomplete;

  await t.typeText(input, 'a');
};

const a11yCheckConfig = isMaterialBased() ? {
  // NOTE: color-contrast issues in Material
  runOnly: isMaterial() ? '' : 'color-contrast',
  rules: { 'color-contrast': { enabled: !isMaterial() } },
} : {};

const configuration: Configuration = {
  component: 'dxAutocomplete',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
