export interface Rule {
  validate: (value: unknown) => boolean;
  message: string;
}
export type FormValidationResult = Record<string, string[]>;
