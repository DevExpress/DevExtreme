import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { Properties } from '@js/ui/date_box';
import DateBox from '@js/ui/date_box';
import DateRangeBox from '@js/ui/date_range_box';

const widgets: { dispose: () => void }[] = [];
const value = new Date(2024, 5, 15, 14, 30);

const createDateBox = (options: Partial<Properties>): HTMLInputElement => {
  const element = document.body.appendChild(document.createElement('div'));
  const instance = new DateBox(element, options);

  widgets.push(instance);

  return element.querySelector('.dx-texteditor-input') as HTMLInputElement;
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
});
