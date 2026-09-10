import {
  afterEach, beforeAll, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import { DateBoxModel } from '@ts/ui/__tests__/__mock__/model/date_box';

import DateBox from '../date_box';

const dateBoxes: DateBox[] = [];

const createDateBox = (options = {}): DateBoxModel => {
  const element = $('<div>').appendTo(document.body).get(0) as HTMLElement;
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance: DateBox = new DateBox(element, {
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
