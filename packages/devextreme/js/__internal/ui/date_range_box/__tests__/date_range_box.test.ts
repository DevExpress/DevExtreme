import {
  afterEach, beforeAll, describe, expect, it,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { Properties } from '@js/ui/date_range_box';
import DateRangeBox from '@js/ui/date_range_box';
import { DateRangeBoxModel } from '@ts/ui/__tests__/__mock__/model/date_range_box';

const dateRangeBoxes: DateRangeBox[] = [];

const createDateRangeBox = (options: Partial<Properties> = {}): DateRangeBoxModel => {
  const element = document.body.appendChild(document.createElement('div'));

  const instance = new DateRangeBox(element, options);

  dateRangeBoxes.push(instance);

  return new DateRangeBoxModel(element);
};

describe('DateRangeBox commits the input text on focus out when the browser fires no change event', () => {
  beforeAll(() => {
    fx.off = true;
  });

  afterEach(() => {
    dateRangeBoxes.forEach((instance) => instance.dispose());
    dateRangeBoxes.length = 0;
    document.body.innerHTML = '';
  });

  it('resets the start date when the start input is cleared after a calendar pick (T1334896)', () => {
    const dateRangeBox = createDateRangeBox();
    const startDateBox = dateRangeBox.getStartDateBox();

    dateRangeBox.open();
    dateRangeBox.getCalendarCells()[10].click();
    expect(dateRangeBox.getInstance().option('startDate')).not.toBeNull();

    startDateBox.clearInput();
    startDateBox.blurInput();

    expect(dateRangeBox.getInstance().option('startDate')).toBeNull();
    expect(startDateBox.getInputElement().value).toBe('');
  });
});
