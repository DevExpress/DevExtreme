export const KNOWN_CONSTELLATION_NAMES = [
  'export',
  'misc',
  'ui',
  'ui.widgets',
  'ui.editors',
  'ui.grid',
  'ui.scheduler',
] as const;

export type RunnerLogColor = 'red' | 'green' | 'yellow' | 'white';
export type ConstellationName = (typeof KNOWN_CONSTELLATION_NAMES)[number];
export type ConstellationFilter = string;
const KNOWN_CONSTELLATIONS_SET = new Set<string>(KNOWN_CONSTELLATION_NAMES);

export function isConstellationName(value: string): value is ConstellationName {
  return KNOWN_CONSTELLATIONS_SET.has(value);
}

export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface RunnerLogger {
  write: (message?: string, color?: RunnerLogColor) => void;
  writeLine: (message?: string, color?: RunnerLogColor) => void;
  writeError: (message: string) => void;
}

export interface BaseRunProps {
  IsContinuousIntegration: boolean;
  NoGlobals: boolean;
  NoTimers: boolean;
  NoTryCatch: boolean;
  NoJQuery: boolean;
  ShadowDom: boolean;
  WorkerInWindow: boolean;
  NoCsp: boolean;
  MaxWorkers: number | null;
}

export interface CategoryInfo {
  Name: string;
  Constellation: ConstellationName;
  Explicit: boolean;
  RunOnDevices: boolean;
}

export interface SuiteInfo {
  ShortName: string;
  FullName: string;
  Url: string;
}

export interface RunSuiteModel {
  Title: string;
  ScriptVirtualPath: string;
}

export interface RunAllModel {
  Constellation: ConstellationFilter;
  CategoriesList: string;
  Version: string;
  Suites: SuiteInfo[];
}

export interface TestCaseIssue {
  message: string;
}

export interface TestCaseResult {
  name: string;
  url: string;
  time: number;
  executed: boolean;
  failure: TestCaseIssue | null;
  reason: TestCaseIssue | null;
}

export interface TestSuiteResult {
  name: string;
  time: number;
  pureTime: number;
  results: TestResultItem[];
}

export type TestResultItem = TestSuiteResult | TestCaseResult;

export interface TestResultsPayload {
  name: string;
  total: number;
  failures: number;
  suites: TestSuiteResult[];
}

export interface VectorMapDataItem {
  name: string;
  expected: string;
}

export interface VectorMapOutputItem {
  file: string;
  variable: string | null;
  content: JsonValue;
}

export interface PortsMap {
  [key: string]: number | string;
  qunit: number | string;
  'vectormap-utils-tester': number | string;
}

export type TemplateVarValue = JsonValue | bigint | undefined;
export type TemplateVars = Record<string, TemplateVarValue>;
