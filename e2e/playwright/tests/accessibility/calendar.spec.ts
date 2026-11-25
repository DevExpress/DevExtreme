import type { Properties } from 'devextreme/ui/calendar';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date().getTime();

const options: Options<Properties> = {
  name: ['', 'name'],
  disabled: [true, false],
  readOnly: [true, false],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: empty-table-header issues
    'empty-table-header': { enabled: false },
  },
};

const configurationWithSingleSelectionMode: Configuration<Properties> = {
  component: 'dxCalendar',
  a11yCheckConfig,
  options: {
    ...options,
    value: [undefined, now],
    zoomLevel: ['century', 'decade', 'month', 'year'],
  },
};

testAccessibility(configurationWithSingleSelectionMode);

const configurationWithoutSingleSelectionMode: Configuration<Properties> = {
  component: 'dxCalendar',
  name: 'multiple selection',
  a11yCheckConfig,
  options: {
    ...options,
    value: [[now, now + msInDay]],
    selectionMode: ['multiple', 'range'],
    showTodayButton: [true, false],
    showWeekNumbers: [true, false],
    zoomLevel: ['month'],
  },
};

testAccessibility(configurationWithoutSingleSelectionMode);
