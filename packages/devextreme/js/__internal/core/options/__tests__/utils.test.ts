import { describe, expect, it } from '@jest/globals';
import type { Device } from '@js/core/devices';
import { deviceMatch } from '@ts/core/options/utils';

const android: Device = {
  deviceType: 'phone', platform: 'android', android: true, phone: true,
};
const iPhone: Device = {
  deviceType: 'phone', platform: 'ios', ios: true, phone: true,
};
const desktop: Device = { deviceType: 'desktop', platform: 'generic', generic: true };

describe('deviceMatch', () => {
  it('matches an empty filter on any device', () => {
    expect(deviceMatch(desktop, {})).toBe(true);
    expect(deviceMatch(desktop, [])).toBe(true);
  });

  it('matches a device filter only on devices with the same values', () => {
    expect(deviceMatch(android, { platform: 'android' })).toBe(true);
    expect(deviceMatch(iPhone, { platform: 'android' })).toBe(false);
    expect(deviceMatch(desktop, { platform: 'android' })).toBe(false);
  });

  it('matches a filter array on a device that matches any of its items', () => {
    const filter: Device[] = [{ platform: 'android' }, { platform: 'ios' }];

    expect(deviceMatch(android, filter)).toBe(true);
    expect(deviceMatch(iPhone, filter)).toBe(true);
  });

  it('does not match a filter array on a device that matches none of its items', () => {
    expect(deviceMatch(desktop, [{ platform: 'android' }, { platform: 'ios' }])).toBe(false);
    expect(deviceMatch(iPhone, [{ platform: 'android' }])).toBe(false);
  });

  it('matches a filter array that contains an empty item on any device', () => {
    expect(deviceMatch(desktop, [{ platform: 'android' }, {}])).toBe(true);
  });
});
