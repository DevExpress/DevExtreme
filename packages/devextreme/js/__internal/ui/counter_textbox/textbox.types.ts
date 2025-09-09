export interface TextBoxProps extends Record<string, unknown> {
  label: string;
  value: string;
  name: string;
  placeholder: string;
  maxLength: number;
  reset?: () => void;
  onInput?: (e: unknown) => void;
  onChange?: (e: unknown) => void;
  onValueChange?: (value: string) => void;
}

export interface TextBoxState {
  value: string;
}
