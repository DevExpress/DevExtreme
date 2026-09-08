import { test } from '../fixtures';

export const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;

export type MachineTimezonesType = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

// The TestCafe run read the timezone off the agent, which the workflow re-pointed per job. Here
// the browser context carries it, so the job passes it in TIMEZONE and the tests of the other
// timezones skip — the same way "test.skip" worked there.
export const getMachineTimezone = (): string => process.env.TIMEZONE ?? 'GMT';

export const getTimezoneTest = (
  timezones: readonly MachineTimezonesType[],
): typeof test | typeof test.skip => (
  timezones.includes(getMachineTimezone() as MachineTimezonesType) ? test : test.skip
);

export const normalizeTimezoneName = (
  timezone: MachineTimezonesType,
): string => timezone.replace(/\//g, '-');
