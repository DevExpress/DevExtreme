export interface CopyFilesExecutorSchema {
  files: Array<{
    from: string;
    to: string;
  }>;
}
