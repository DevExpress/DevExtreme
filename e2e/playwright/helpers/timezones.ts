import type { Page } from '@playwright/test';
import type { TestOptions } from '../fixtures';
import { test } from '../fixtures';
import { readEnv } from './const';

export const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;

export type MachineTimezone = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

// The timezone of the run: the job passes it in TIMEZONE, and the config hands it to the browser
// context and to this process alike.
export const getTimezone = (): string => readEnv(process.env.TIMEZONE, 'GMT');

type TestDeclaration = (
  title: string,
  body: (args: TestOptions & { page: Page }) => Promise<void>,
) => void;

// A test of one timezone is declared skipped in the jobs of the others, the way the TestCafe
// "getTimezoneTest" turned it into "test.skip" on an agent set to another zone.
export const getTimezoneTest = (timezone: MachineTimezone): TestDeclaration => (
  getTimezone() === timezone ? test : test.skip
);

export const normalizeTimezoneName = (timezone: MachineTimezone): string => timezone.replace(/\//g, '-');
