import { ClientFunction } from 'testcafe';
import { Properties } from 'devextreme/ui/date_box.d';
import DateBox from 'devextreme-testcafe-models/dateBox';
import url from '../../../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

const now = new Date();

const options: Options<Properties> = {
  value: [now],
  label: [undefined, 'label'],
  showClearButton: [true, false],
  showDropDownButton: [true, false],
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
