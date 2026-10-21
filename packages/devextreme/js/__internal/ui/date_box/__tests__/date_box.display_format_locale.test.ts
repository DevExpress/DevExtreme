import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import dateLocalization from '@js/common/core/localization/date';
import config from '@js/core/config';
import type { Properties } from '@js/ui/date_box';
import DateBox from '@js/ui/date_box';
import DateRangeBox from '@js/ui/date_range_box';
import type { TimeViewProperties } from '@ts/ui/date_box/time_view';
import TimeView from '@ts/ui/date_box/time_view';

const TimeViewWidget = TimeView as unknown as new (
  element: Element,
  options: Partial<TimeViewProperties>,
) => TimeView;

const widgets: { dispose: () => void }[] = [];
const value = new Date(2024, 5, 15, 14, 30);
const presetValue = new Date(2020, 0, 2, 14, 5, 6, 7);

const createDateBox = (options: Partial<Properties>): HTMLInputElement => {
  const element = document.body.appendChild(document.createElement('div'));
  const instance = new DateBox(element, options);

  widgets.push(instance);

  return element.querySelector('.dx-texteditor-input') as HTMLInputElement;
};

const expectExplicitPreset = (
  editorType: 'date' | 'time' | 'datetime',
  preset: string,
  expected: string,
): void => {
  const stringFormatInput = createDateBox({
    type: editorType,
    value: presetValue,
    displayFormat: preset,
  });
  const objectFormatInput = createDateBox({
    type: editorType,
    value: presetValue,
    displayFormat: { type: preset },
  });

  expect([preset, stringFormatInput.value]).toEqual([preset, expected]);
  expect([preset, objectFormatInput.value]).toEqual([preset, expected]);
};

describe('locale-only displayFormat follows the editor type', () => {
  afterEach(() => {
    widgets.forEach((instance) => instance.dispose());
    widgets.length = 0;
    document.body.innerHTML = '';
  });

  it('keeps time for a datetime calendar', () => {
    const input = createDateBox({
      type: 'datetime',
      pickerType: 'calendar',
      value,
      displayFormat: { locale: 'en-US' },
    });

    expect(input.value).toBe('6/15/2024, 2:30 PM');
  });

  it('keeps time for datetime rollers', () => {
    const input = createDateBox({
      type: 'datetime',
      pickerType: 'rollers',
      value,
      displayFormat: { locale: 'de-DE' },
    });

    expect(input.value).toBe('15.6.2024, 14:30');
  });

  it('keeps time for a time editor', () => {
    const input = createDateBox({
      type: 'time',
      pickerType: 'list',
      value,
      displayFormat: { locale: 'en-US' },
    });

    expect(input.value).toBe('2:30 PM');
  });

  it('uses the format locale for month names in an LDML pattern', () => {
    const input = createDateBox({
      type: 'date',
      value: new Date(2024, 5, 15),
      displayFormat: { type: 'dd MMMM yyyy', locale: 'de' },
    });

    expect(input.value).toBe('15 Juni 2024');
  });

  it('stays date-only for a date editor', () => {
    const input = createDateBox({
      type: 'date',
      pickerType: 'calendar',
      value,
      displayFormat: { locale: 'en-US' },
    });

    expect(input.value).toBe('6/15/2024');
  });

  it('keeps time in the datetime mask', () => {
    const input = createDateBox({
      type: 'datetime',
      pickerType: 'calendar',
      useMaskBehavior: true,
      value,
      displayFormat: { locale: 'de-DE' },
    });

    expect(input.value).toBe('15.6.2024, 14:30');
  });

  it('stays date-only in DateRangeBox editors', () => {
    const element = document.body.appendChild(document.createElement('div'));
    const instance = new DateRangeBox(element, {
      value: [value, value],
      displayFormat: { locale: 'en-US' },
    });

    widgets.push(instance);

    const inputs = element.querySelectorAll<HTMLInputElement>('.dx-texteditor-input');

    expect(inputs[0].value).toBe('6/15/2024');
    expect(inputs[1].value).toBe('6/15/2024');
  });

  it('edits a longDate mask that uses another locale', () => {
    const element = document.body.appendChild(document.createElement('div'));
    const instance = new DateBox(element, {
      type: 'date',
      pickerType: 'calendar',
      useMaskBehavior: true,
      value,
      displayFormat: { type: 'longDate', locale: 'de' },
    });

    widgets.push(instance);

    const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;
    const textBeforeEdit = input.value;

    expect(textBeforeEdit).toContain('Juni');

    const editor = instance as DateBox & { _upDownArrowHandler: (step: number) => void };

    expect(() => editor._upDownArrowHandler(1)).not.toThrow();
    expect(input.value).not.toBe(textBeforeEdit);
  });

  it('rebuilds the mask when a locale function changes before the value', () => {
    let currentLocale = 'de';
    const element = document.body.appendChild(document.createElement('div'));
    const instance = new DateBox(element, {
      type: 'date',
      pickerType: 'calendar',
      useMaskBehavior: true,
      value,
      displayFormat: { type: 'longDate', locale: () => currentLocale },
    });

    widgets.push(instance);

    const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;

    expect(input.value).toContain('Juni');

    currentLocale = 'en';
    instance.option('value', new Date(2024, 6, 20));

    expect(input.value).toContain('July');

    const editor = instance as DateBox & { _upDownArrowHandler: (step: number) => void };
    const textBeforeEdit = input.value;

    expect(() => editor._upDownArrowHandler(1)).not.toThrow();
    expect(input.value).not.toBe(textBeforeEdit);
    expect(input.value).toContain('July');
  });

  it('pastes a localized longDate into a mask that uses another locale', () => {
    const element = document.body.appendChild(document.createElement('div'));
    const instance = new DateBox(element, {
      type: 'date',
      pickerType: 'calendar',
      useMaskBehavior: true,
      value,
      displayFormat: { type: 'longDate', locale: 'de' },
    });

    widgets.push(instance);

    const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;
    const pastedDate = new Date(2024, 6, 20);
    const pastedText = dateLocalization.format(pastedDate, {
      type: 'longDate',
      locale: 'de',
    }) as string;

    expect(input.value).toContain('Juni');
    expect(pastedText).toContain('Juli');

    input.setSelectionRange(0, input.value.length);

    const editor = instance as DateBox & {
      _maskPasteHandler: (e: {
        originalEvent: { clipboardData: { getData: () => string } };
        preventDefault: () => void;
      }) => void;
      _maskValue?: Date | null;
    };

    editor._maskPasteHandler({
      originalEvent: {
        clipboardData: {
          getData: () => pastedText,
        },
      },
      preventDefault: () => {},
    });

    expect(editor._maskValue?.getFullYear()).toBe(2024);
    expect(editor._maskValue?.getMonth()).toBe(6);
    expect(editor._maskValue?.getDate()).toBe(20);
    expect(input.value).toContain('Juli');
  });

  it('edits a longDate mask whose locale comes from a preset override', () => {
    const savedLocale = coreLocalization.locale();
    const savedPresets = config().dateTimeFormatPresets;

    coreLocalization.locale('en');
    config({
      ...config(),
      dateTimeFormatPresets: {
        longDate: { default: { type: 'longDate', locale: 'de' } },
      },
    });

    try {
      const element = document.body.appendChild(document.createElement('div'));
      const instance = new DateBox(element, {
        type: 'date',
        pickerType: 'calendar',
        useMaskBehavior: true,
        value,
        displayFormat: 'longDate',
      });

      widgets.push(instance);

      const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;
      const textBeforeEdit = input.value;

      expect(textBeforeEdit).toContain('Juni');

      const editor = instance as DateBox & { _upDownArrowHandler: (step: number) => void };

      expect(() => editor._upDownArrowHandler(1)).not.toThrow();
      expect(input.value).not.toBe(textBeforeEdit);
    } finally {
      const currentConfig = config();

      if (savedPresets === undefined) {
        delete currentConfig.dateTimeFormatPresets;
      } else {
        currentConfig.dateTimeFormatPresets = savedPresets;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it('keeps the message locale for an explicit date preset', () => {
    const savedLocale = coreLocalization.locale();
    const savedDateFormat = config().dateFormat;
    const presets: [string, string][] = [
      ['day', '2'],
      ['dayOfWeek', 'Thursday'],
      ['longDate', 'Thursday, January 2, 2020'],
      ['month', 'January'],
      ['monthAndDay', 'January 2'],
      ['monthAndYear', 'January 2020'],
      ['quarter', 'Q1'],
      ['quarterAndYear', 'Q1 2020'],
      ['shortDate', '1/2/2020'],
      ['year', '2020'],
    ];

    coreLocalization.locale('en');
    config({
      ...config(),
      dateFormat: {
        default: {
          locale: 'de-DE',
        },
      },
    });

    try {
      presets.forEach(([preset, expected]) => {
        expectExplicitPreset('date', preset, expected);
      });
    } finally {
      const currentConfig = config();

      if (savedDateFormat === undefined) {
        delete currentConfig.dateFormat;
      } else {
        currentConfig.dateFormat = savedDateFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it('keeps the message locale for an explicit time preset', () => {
    const savedLocale = coreLocalization.locale();
    const savedTimeFormat = config().timeFormat;
    const presets: [string, string][] = [
      ['hour', '14'],
      ['longTime', '2:05:06 PM'],
      ['millisecond', '007'],
      ['minute', '05'],
      ['second', '06'],
      ['shortTime', '2:05 PM'],
    ];

    coreLocalization.locale('en');
    config({
      ...config(),
      timeFormat: {
        default: {
          locale: 'de-DE',
        },
      },
    });

    try {
      presets.forEach(([preset, expected]) => {
        expectExplicitPreset('time', preset, expected);
      });
    } finally {
      const currentConfig = config();

      if (savedTimeFormat === undefined) {
        delete currentConfig.timeFormat;
      } else {
        currentConfig.timeFormat = savedTimeFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it('keeps the message locale for an explicit date-time preset', () => {
    const savedLocale = coreLocalization.locale();
    const savedDateTimeFormat = config().dateTimeFormat;
    const presets: [string, string][] = [
      ['longDateLongTime', 'Thursday, January 2, 2020 at 2:05:06 PM'],
      ['shortDateShortTime', '1/2/2020, 2:05 PM'],
    ];

    coreLocalization.locale('en');
    config({
      ...config(),
      dateTimeFormat: {
        default: {
          locale: 'de-DE',
        },
      },
    });

    try {
      presets.forEach(([preset, expected]) => {
        expectExplicitPreset('datetime', preset, expected);
      });
    } finally {
      const currentConfig = config();

      if (savedDateTimeFormat === undefined) {
        delete currentConfig.dateTimeFormat;
      } else {
        currentConfig.dateTimeFormat = savedDateTimeFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it.each([
    {
      type: 'date' as const,
      pickerType: 'calendar' as const,
      displayFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      expected: 'June 15, 2024',
    },
    {
      type: 'date' as const,
      pickerType: 'calendar' as const,
      displayFormat: 'dd MMMM yyyy',
      expected: '15 June 2024',
    },
    {
      type: 'time' as const,
      pickerType: 'list' as const,
      displayFormat: { hour: 'numeric', minute: 'numeric' },
      expected: '2:30 PM',
    },
    {
      type: 'datetime' as const,
      pickerType: 'calendar' as const,
      displayFormat: {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
      },
      expected: '6/15/2024, 2:30 PM',
    },
  ])('ignores global format locales for an explicit $type displayFormat %#', ({
    type, pickerType, displayFormat, expected,
  }) => {
    const savedLocale = coreLocalization.locale();
    const { dateFormat, timeFormat, dateTimeFormat } = config();

    coreLocalization.locale('en');
    config({
      ...config(),
      dateFormat: { default: { type: 'longDate', locale: 'de-DE' } },
      timeFormat: { default: { type: 'longTime', locale: 'de-DE' } },
      dateTimeFormat: { default: { type: 'longDateLongTime', locale: 'de-DE' } },
    });

    try {
      const input = createDateBox({
        type,
        pickerType,
        value,
        displayFormat: displayFormat as Properties['displayFormat'],
      });
      const maskInput = createDateBox({
        type,
        pickerType,
        useMaskBehavior: true,
        value,
        displayFormat: displayFormat as Properties['displayFormat'],
      });

      expect(input.value).toBe(expected);
      expect(maskInput.value).toBe(expected);
    } finally {
      const currentConfig = config();

      currentConfig.dateFormat = dateFormat;
      currentConfig.timeFormat = timeFormat;
      currentConfig.dateTimeFormat = dateTimeFormat;
      if (dateFormat === undefined) delete currentConfig.dateFormat;
      if (timeFormat === undefined) delete currentConfig.timeFormat;
      if (dateTimeFormat === undefined) delete currentConfig.dateTimeFormat;

      coreLocalization.locale(savedLocale);
    }
  });

  describe('time separator', () => {
    let savedLocale = '';
    let savedTimeFormat = config().timeFormat;
    let savedDateTimeFormat = config().dateTimeFormat;

    beforeEach(() => {
      savedLocale = coreLocalization.locale();
      savedTimeFormat = config().timeFormat;
      savedDateTimeFormat = config().dateTimeFormat;
      coreLocalization.locale('en');
    });

    afterEach(() => {
      const currentConfig = config();

      currentConfig.timeFormat = savedTimeFormat;
      currentConfig.dateTimeFormat = savedDateTimeFormat;
      if (savedTimeFormat === undefined) delete currentConfig.timeFormat;
      if (savedDateTimeFormat === undefined) delete currentConfig.dateTimeFormat;

      coreLocalization.locale(savedLocale);
    });

    const getTimeViewSeparator = (formatLocale?: string): string => {
      const element = document.body.appendChild(document.createElement('div'));
      const instance = new TimeViewWidget(element, {
        value,
        _formatLocale: formatLocale,
      });

      widgets.push(instance);

      return element.querySelector('.dx-timeview-time-separator')?.textContent ?? '';
    };

    it('uses the format locale passed by the DateBox instead of timeFormat', () => {
      config({ ...config(), timeFormat: { default: { locale: 'fi' } } });

      expect(getTimeViewSeparator('en')).toBe(':');
      expect(getTimeViewSeparator('fi')).toBe('.');
    });

    it('passes the explicit displayFormat locale to the time view', () => {
      config({
        ...config(),
        timeFormat: { default: { locale: 'fi' } },
        dateTimeFormat: { default: { locale: 'fi' } },
      });

      const element = document.body.appendChild(document.createElement('div'));
      const instance = new DateBox(element, {
        type: 'datetime',
        pickerType: 'calendar',
        value,
        displayFormat: 'dd/MM/yyyy HH:mm',
      });

      widgets.push(instance);

      const strategy = (instance as unknown as {
        _strategy: { _getFormatLocale: () => string };
      })._strategy;

      expect(strategy._getFormatLocale()).toBe('en');
    });

    it('passes the dateTimeFormat locale to the time view when displayFormat is not set', () => {
      config({ ...config(), dateTimeFormat: { default: { locale: 'fi' } } });

      const element = document.body.appendChild(document.createElement('div'));
      const instance = new DateBox(element, {
        type: 'datetime',
        pickerType: 'calendar',
        value,
      });

      widgets.push(instance);

      const strategy = (instance as unknown as {
        _strategy: { _getFormatLocale: () => string };
      })._strategy;

      expect(strategy._getFormatLocale()).toBe('fi');
    });
  });
});
