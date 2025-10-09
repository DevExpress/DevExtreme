import { ClientFunction } from 'testcafe';
import { Properties } from 'devextreme/ui/date_box.d';
import DateBox from 'devextreme-testcafe-models/dateBox';
import url from '../../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

const now = new Date();

const options: Options<Properties> = {
  value: [undefined, now],
  disabled: [true, false],
  readOnly: [true, false],
  type: ['date', 'time', 'datetime'],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
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

const deferredConfiguration: Configuration = {
  component: 'dxDateBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true, false],
    deferRendering: [true],
  },
  created,
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration = {
  component: 'dxDateBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [false],
    deferRendering: [false],
  },
  created,
};

testAccessibility(noDeferredConfiguration);
