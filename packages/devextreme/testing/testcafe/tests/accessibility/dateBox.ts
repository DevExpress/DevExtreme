import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/date_box.d';
import DateBox from '../../model/dateBox';

const TIME_TO_WAIT = 1500;

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const now = new Date();

const options: Options<Properties> = {
  value: [undefined, now],
  disabled: [true, false],
  readOnly: [true, false],
  type: ['date', 'time', 'datetime'],
  showClearButton: [true, false],
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

  const dateBox = new DateBox(defaultSelector);
  const { dropDownEditorButton } = dateBox;

  await t
    .click(dropDownEditorButton)
    .wait(TIME_TO_WAIT);
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxDateBox',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
