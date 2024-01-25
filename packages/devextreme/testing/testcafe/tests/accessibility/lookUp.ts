import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/lookup.d';
import Lookup from '../../model/lookup';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = ['John Heart', 'Samantha Bright'];

const options: Options<Properties> = {
  dataSource: items,
  disabled: [true, false],
  readOnly: [true, false],
  placeholder: [undefined, 'placeholder'],
  applyValueMode: ['instantly', 'useButtons'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
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
  const { disabled, readOnly } = optionConfiguration;

  if (disabled || readOnly) {
    return;
  }

  const lookup = new Lookup(defaultSelector);

  await ClientFunction(() => {
    (lookup.getInstance() as any).open();
  }, {
    dependencies: { lookup },
  })();
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxLookup',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
