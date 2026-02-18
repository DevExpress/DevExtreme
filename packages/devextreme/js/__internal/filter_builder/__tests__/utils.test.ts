import { describe, expect, it } from '@jest/globals';
import type { CustomOperation, Field } from '@js/ui/filter_builder';

import { getCurrentValueText } from '../m_utils';

describe('Formatting', () => {
  it('empty string', () => {
    const field = {};
    const value = '';

    expect(getCurrentValueText(field, value, null)).toBe('');
  });

  it('string', () => {
    const field = {};
    const value = 'Text';

    expect(getCurrentValueText(field, value, null)).toBe('Text');
  });

  it('shortDate', () => {
    const field = { format: 'shortDate' };
    const value = new Date(2017, 8, 5);

    expect(getCurrentValueText(field, value, null)).toBe('9/5/2017');
  });

  it('invalid date string (T1319193)', () => {
    const field = { format: 'shortDate' };
    const dateString = 'Weekend';

    expect(getCurrentValueText(field, dateString, null)).toBe(dateString);
  });

  it('boolean', () => {
    const field: Field = { dataType: 'boolean' };
    let value = true;

    expect(getCurrentValueText(field, value, null)).toBe('true');

    value = false;
    expect(getCurrentValueText(field, value, null)).toBe('false');

    field.falseText = 'False Text';
    expect(getCurrentValueText(field, value, null)).toBe('False Text');
  });

  it('field.customizeText', () => {
    const field: Field = {
      customizeText(conditionInfo) {
        return `${conditionInfo.valueText}Test`;
      },
    };
    const value = 'MyValue';

    expect(getCurrentValueText(field, value, null)).toBe('MyValueTest');
  });

  it('customOperation.customizeText', () => {
    const field: Field = {
      customizeText(conditionInfo) {
        return `${conditionInfo.valueText}Test`;
      },
    };
    const value = 'MyValue';
    const customOperation: CustomOperation = {
      customizeText(conditionInfo) {
        return `${conditionInfo.valueText}CustomOperation`;
      },
    };

    expect(getCurrentValueText(field, value, customOperation)).toBe('MyValueTestCustomOperation');
  });

  it('customOperation.customizeText for array', async () => {
    const field: Field = { dataType: 'string' };

    const customOperation = { customizeText: (): string => '(Blanks)' };
    let text = await getCurrentValueText(field, '', customOperation);

    expect(text).toBe('');

    text = await getCurrentValueText(field, [null], customOperation);
    expect(text).toEqual(['(Blanks)']);

    const field2: Field = { dataType: 'number' };

    text = await getCurrentValueText(field2, null, customOperation);

    expect(text).toBe('');

    text = await getCurrentValueText(field, [null], customOperation);
    expect(text).toEqual(['(Blanks)']);
  });

  it('default format for date', () => {
    const field: Field = { dataType: 'date' };
    const value = new Date(2017, 8, 5, 12, 30, 0);

    expect(getCurrentValueText(field, value, null)).toBe('9/5/2017');
  });

  it('default format for datetime', () => {
    const field: Field = { dataType: 'datetime' };
    const value = new Date(2017, 8, 5, 12, 30, 0);

    expect(getCurrentValueText(field, value, null)).toBe('9/5/2017, 12:30 PM');
  });
});
