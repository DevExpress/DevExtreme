export const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;
export type MachineTimezonesType = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

export const getMachineTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getTimezoneTest = (timezones: MachineTimezonesType[]): TestFn => {
  const machineTimezone = getMachineTimezone();
  return timezones.includes(machineTimezone as MachineTimezonesType) ? test : test.skip;
};

export const getTimezoneFixture = (timezones: MachineTimezonesType[]): FixtureFn => {
  const machineTimezone = getMachineTimezone();
  return timezones.includes(machineTimezone as MachineTimezonesType) ? fixture : fixture.skip;
};

export const normalizeTimezoneName = (timezone: MachineTimezonesType): string => timezone.replace(/\//g, '-');
