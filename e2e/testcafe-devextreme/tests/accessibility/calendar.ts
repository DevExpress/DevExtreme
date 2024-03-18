import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from 'devextreme/ui/calendar.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date().getTime();

const options: Options<Properties> = {
  name: ['', 'name'],
  firstDayOfWeek: [0, 1],
  hint: [undefined, 'hint'],
  disabled: [true, false],
  readOnly: [true, false],
  showTodayButton: [true, false],
  showWeekNumbers: [true, false],
  zoomLevel: ['century', 'decade', 'month', 'year'],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
    // NOTE: empty-table-header issues
    'empty-table-header': { enabled: false },
  },
};

const configurationWithSingleSelectionMode: Configuration = {
  component: 'dxCalendar',
  a11yCheckConfig,
  options: { ...options, value: [undefined, now] },
};

testAccessibility(configurationWithSingleSelectionMode);

const configurationWithoutSingleSelectionMode: Configuration = {
  component: 'dxCalendar',
  a11yCheckConfig,
  options: {
    ...options,
    value: [[now, now + msInDay]],
    selectionMode: ['multiple', 'range'],
  },
};

testAccessibility(configurationWithoutSingleSelectionMode);
