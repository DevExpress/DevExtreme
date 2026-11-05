import type { Page } from '@playwright/test';
import type { TestOptions } from '../fixtures';
import { test } from '../fixtures';
import { readEnv } from './const';

export const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;

export type MachineTimezone = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

export const getTimezone = (): string => readEnv(process.env.TIMEZONE, 'GMT');

type TestDeclaration = (
  title: string,
  body: (args: TestOptions & { page: Page }) => Promise<void>,
) => void;

export const getTimezoneTest = (timezone: MachineTimezone): TestDeclaration => (
  getTimezone() === timezone ? test : test.skip
);

export const normalizeTimezoneName = (timezone: MachineTimezone): string => timezone.replace(/\//g, '-');
