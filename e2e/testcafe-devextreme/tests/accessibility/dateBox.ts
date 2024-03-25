import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from 'devextreme/ui/date_box.d';
import DateBox from 'devextreme-testcafe-models/dateBox';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const now = new Date();

const options: Options<Properties> = {
  value: [undefined, now],
  disabled: [true, false],
  readOnly: [true, false],
  type: ['date', 'time', 'datetime'],
  placeholder: [undefined, 'placeholder'],
  applyValueMode: ['instantly', 'useButtons'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
  deferRendering: [true, false],
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
  const {
    disabled, readOnly, type, value,
  } = optionConfiguration;

  if (
    disabled
    || readOnly
    || (type === 'datetime' && !value)
  ) {
    return;
  }

  const dateBox = new DateBox(defaultSelector);

  await ClientFunction(() => {
    (dateBox.getInstance() as any).open();
  }, {
    dependencies: { dateBox },
  })();
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const configuration: Configuration = {
  component: 'dxDateBox',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
