export interface ScssBuildExecutorSchema {
  mode: 'all' | 'ci';
  gulpBinary?: string;
  allTaskName?: string;
  ciTaskName?: string;
}
