export interface LocalizationExecutorSchema {
  messagesDir?: string;
  messageTemplate?: string;
  messageOutputDir?: string;
  generatedTemplate?: string;
  cldrDataOutputDir?: string;
  defaultMessagesOutputDir?: string;
  lintGeneratedFiles?: boolean;
  skipCldrGeneration?: boolean;
  skipMessageGeneration?: boolean;
}
