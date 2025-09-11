import { ClickEvent } from "@js/ui/button";

export interface CheckboxProps {
  disabled?: boolean;
  value?: boolean;
  text?: string;
  onClick?: (e: ClickEvent) => void;
}
