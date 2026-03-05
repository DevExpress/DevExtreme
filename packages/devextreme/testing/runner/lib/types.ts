export type RunnerLogColor = 'red' | 'green' | 'yellow' | 'white';

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
  Constellation: string;
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
  Constellation: string;
  CategoriesList: string;
  Version: string;
  Suites: SuiteInfo[];
}

export interface TestCaseIssue {
  message?: string;
}

export interface TestCaseResult {
  name?: string;
  url?: string;
  time?: number | string;
  executed?: boolean;
  failure?: TestCaseIssue;
  reason?: TestCaseIssue;
}

export interface TestSuiteResult {
  name?: string;
  time?: number | string;
  pureTime?: number | string;
  results?: TestResultItem[];
}

export type TestResultItem = TestSuiteResult | TestCaseResult;

export interface TestResultsPayload {
  name?: string;
  total?: number | string;
  failures?: number | string;
  suites?: TestSuiteResult[];
}

export interface VectorMapDataItem {
  name: string;
  expected: string;
}

export interface VectorMapOutputItem {
  file: string;
  variable: string | null;
  content: unknown;
}

export type PortsMap = Record<string, number | string>;

export type TemplateVars = Record<string, unknown>;
