import {
  describe, expect, it,
} from '@jest/globals';

import { parseRecurrenceRule } from './base';
import { validateRRule, validateRRuleObject } from './validate_rule';

describe('validateRRule', () => {
  it('should return true for valid rule', () => {
    const rule = 'FREQ=MONTHLY';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(true);
  });

  it('should return false for undefined rule', () => {
    const isValid = validateRRule(undefined);

    expect(isValid).toBe(false);
  });

  it('should return false for incorrect freq', () => {
    const rule = 'FREQ=WRONG';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return false for wrong rule name', () => {
    const rule = 'FRE=DAILY';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return true and correct parsed rule for wrong count', () => {
    const rule = 'FREQ=DAILY;COUNT=wrong';
    const parsed = parseRecurrenceRule(rule);
    const isValid = validateRRuleObject(parsed, rule);

    expect(parsed).toEqual({ freq: 'DAILY', interval: 1 });
    expect(isValid).toBe(true);
  });

  it('should return true and correct parsed rule for wrong interval', () => {
    const rule = 'FREQ=DAILY;INTERVAL=wrong';
    const parsed = parseRecurrenceRule(rule);
    const isValid = validateRRuleObject(parsed, rule);

    expect(parsed).toEqual({ freq: 'DAILY', interval: 1 });
    expect(isValid).toBe(true);
  });

  it('should return false for wrong byDay', () => {
    const rule = 'FREQ=DAILY;BYDAY=wrong';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return false for empty byDay', () => {
    const rule = 'FREQ=DAILY;BYDAY=';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return false for wrong byDay, several value', () => {
    const rule = 'FREQ=DAILY;BYDAY=MO,wrong';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return false for wrong byMonthDay', () => {
    const rule = 'FREQ=MONTHLY;BYMONTHDAY=wrong';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return false for wrong byMonth', () => {
    const rule = 'FREQ=YEARLY;BYMONTH=wrong;BYMONTHDAY=12';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return false for wrong until date', () => {
    const rule = 'FREQ=DAILY;UNTIL=wrong';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(false);
  });

  it('should return true if byDay has frequence for day', () => {
    const rule = 'FREQ=MONTHLY;BYDAY=1TU';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(true);
  });

  it('should return true if byDay has frequence for day', () => {
    const rule = 'FREQ=MONTHLY;BYDAY=1TU,3FR';
    const isValid = validateRRule(rule);

    expect(isValid).toBe(true);
  });
});
