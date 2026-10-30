/**
 * @timezone Europe/Zurich
 */

import {
  describe, expect, it,
} from '@jest/globals';

import { trimInterval } from './trim_interval';

describe('trimInterval', () => {
  it('T1337427: should not extend the interval end on the DST end day', () => {
    const interval = trimInterval({
      min: Date.UTC(2021, 9, 25, 9),
      max: Date.UTC(2021, 9, 31, 24),
    });

    expect(interval).toEqual({
      min: Date.UTC(2021, 9, 25),
      max: Date.UTC(2021, 10, 1),
    });
  });

  it('T1337427: should not shorten the interval end on the DST start day', () => {
    const interval = trimInterval({
      min: Date.UTC(2021, 2, 22, 9),
      max: Date.UTC(2021, 2, 28, 24),
    });

    expect(interval).toEqual({
      min: Date.UTC(2021, 2, 22),
      max: Date.UTC(2021, 2, 29),
    });
  });
});
