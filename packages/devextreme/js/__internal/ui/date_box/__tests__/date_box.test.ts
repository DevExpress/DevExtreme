import {
  afterEach, beforeAll, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { Properties } from '@js/ui/date_box';
import DateBox from '@js/ui/date_box';
import { DateBoxModel } from '@ts/ui/__tests__/__mock__/model/date_box';

const dateBoxes: DateBox[] = [];

const createDateBox = (options: Partial<Properties> = {}): DateBoxModel => {
  const element = document.body.appendChild(document.createElement('div'));

  const instance = new DateBox(element, {
    type: 'date',
    pickerType: 'calendar',
    ...options,
  });

  dateBoxes.push(instance);

  return new DateBoxModel(element);
};

describe('DateBox commits the input text on focus out when the browser fires no change event', () => {
  beforeAll(() => {
    fx.off = true;
  });

  afterEach(() => {
    dateBoxes.forEach((instance) => instance.dispose());
    dateBoxes.length = 0;
    document.body.innerHTML = '';
  });

  it('resets the value when the input is cleared after a calendar pick (T1334896)', () => {
    const dateBox = createDateBox();
    const input = dateBox.getInputElement();

    dateBox.open();
    dateBox.getCalendarCells()[0].click();
    expect(input.value).not.toBe('');

    dateBox.clearInput();
    dateBox.blurInput();

    expect(dateBox.getInstance().option('value')).toBeNull();
    expect(input.value).toBe('');
  });

  it('resets the value in mask mode when the input is cleared after a calendar pick (T1334896)', () => {
    const dateBox = createDateBox({ useMaskBehavior: true });

    dateBox.open();
    dateBox.getCalendarCells()[0].click();

    dateBox.clearInput();
    dateBox.blurInput();

    expect(dateBox.getInstance().option('value')).toBeNull();
  });

  it('commits the original date typed back after a calendar pick (T1334896)', () => {
    const initialValue = new Date(2026, 8, 1);
    const dateBox = createDateBox({ value: initialValue });
    const initialText = dateBox.getInputElement().value;

    dateBox.open();
    dateBox.getCalendarCells()[10].click();
    expect(dateBox.getInstance().option('value')).not.toEqual(initialValue);

    dateBox.setInputText(initialText);
    dateBox.blurInput();

    expect(dateBox.getInstance().option('value')).toEqual(initialValue);
  });

  it('commits the text once when the browser does fire the change event (T1334896)', () => {
    const onValueChanged = jest.fn();
    const dateBox = createDateBox({ onValueChanged });
    const input = dateBox.getInputElement();

    dateBox.open();
    dateBox.getCalendarCells()[0].click();
    onValueChanged.mockClear();

    dateBox.clearInput();
    input.dispatchEvent(new Event('change', { bubbles: true }));
    dateBox.blurInput();

    expect(dateBox.getInstance().option('value')).toBeNull();
    expect(onValueChanged).toHaveBeenCalledTimes(1);
  });

  it('does not validate the same text again on focus out (T1334896)', () => {
    const onOptionChanged = jest.fn<(e: { name: string }) => void>();
    const dateBox = createDateBox({ onOptionChanged });
    const input = dateBox.getInputElement();

    input.value = 'not a date';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const validationChangesAfterChange = onOptionChanged.mock.calls
      .filter(([{ name }]) => name === 'validationError').length;

    dateBox.blurInput();

    const validationChangesAfterBlur = onOptionChanged.mock.calls
      .filter(([{ name }]) => name === 'validationError').length;

    expect(dateBox.getInstance().option('isValid')).toBe(false);
    expect(validationChangesAfterBlur).toBe(validationChangesAfterChange);
  });

  it('fires the change once on focus out in mask mode when the typed date is out of range (T1334896)', () => {
    const onChange = jest.fn();
    const dateBox = createDateBox({
      useMaskBehavior: true,
      value: new Date(2026, 8, 9),
      max: new Date(2026, 8, 10),
      onChange,
    });

    dateBox.pressKey('ArrowUp');
    dateBox.pressKey('ArrowUp');
    dateBox.pressKey('ArrowUp');
    dateBox.blurInput();

    expect(dateBox.getInstance().option('isValid')).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('resets the value on a repeated clear after a calendar pick (T1334896)', () => {
    const dateBox = createDateBox();

    dateBox.open();
    dateBox.getCalendarCells()[0].click();
    dateBox.clearInput();
    dateBox.blurInput();
    expect(dateBox.getInstance().option('value')).toBeNull();

    dateBox.open();
    dateBox.getCalendarCells()[0].click();
    expect(dateBox.getInstance().option('value')).not.toBeNull();

    dateBox.clearInput();
    dateBox.blurInput();

    expect(dateBox.getInstance().option('value')).toBeNull();
  });

  it('keeps the value when valueChangeEvent excludes change (T1334896)', () => {
    const dateBox = createDateBox({ valueChangeEvent: 'paste' });

    dateBox.open();
    dateBox.getCalendarCells()[0].click();
    const pickedValue = dateBox.getInstance().option('value');

    dateBox.clearInput();
    dateBox.blurInput();

    expect(dateBox.getInstance().option('value')).toEqual(pickedValue);
  });
});

describe('DateBox with a date option that cannot be parsed', () => {
  beforeAll(() => {
    fx.off = true;
  });

  afterEach(() => {
    dateBoxes.forEach((instance) => instance.dispose());
    dateBoxes.length = 0;
    document.body.innerHTML = '';
  });

  it.each([
    { type: 'date', pickerType: 'calendar' },
    { type: 'time', pickerType: 'list' },
    { type: 'date', pickerType: 'rollers' },
    { type: 'date', pickerType: 'native' },
  ] as const)('renders an empty input for value: abc ($type, $pickerType)', ({ type, pickerType }) => {
    const dateBox = createDateBox({ type, pickerType, value: 'abc' });

    expect(dateBox.getInputElement().value).toBe('');
    expect(dateBox.getInstance().option('value')).toBe('abc');
  });

  it('renders an empty input when the value is set to abc on a live widget', () => {
    const dateBox = createDateBox({ value: new Date(2020, 0, 2) });

    dateBox.getInstance().option('value', 'abc');

    expect(dateBox.getInputElement().value).toBe('');
  });

  it('renders an empty input for an invalid Date', () => {
    const dateBox = createDateBox({ value: new Date(NaN) });

    expect(dateBox.getInputElement().value).toBe('');
  });

  it.each(['min', 'max'] as const)('ignores %s: abc', (optionName) => {
    const dateBox = createDateBox({ value: new Date(2020, 0, 2), [optionName]: 'abc' });

    expect(dateBox.getInputElement().value).not.toBe('');
    expect(dateBox.getInstance().option('isValid')).toBe(true);
  });

  it('opens the calendar for value: abc', () => {
    const dateBox = createDateBox({ value: 'abc' });

    expect(() => dateBox.open()).not.toThrow();
  });

  it('still parses a valid date string', () => {
    const dateBox = createDateBox({ value: '2020-01-02' });

    expect(dateBox.getInputElement().value).not.toBe('');
  });
});
