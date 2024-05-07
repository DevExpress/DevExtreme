/* eslint-disable max-classes-per-file */
import Widget from '@js/ui/widget/ui.widget';

interface AriaOptions {
  role: string;
  // eslint-disable-next-line spellcheck/spell-checker
  roledescription: string;
  label: string;
}

declare class TWidget<TProperties> extends Widget<TProperties> {
  setAria(ariaOptions: AriaOptions): void;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void>;

  // dom_component
  _render(): void;
  _initMarkup(): void;
  _clean(): void;

  _getDefaultOptions(): TProperties;
  _optionChanged(args: Record<string, unknown>): void;

  // component
  _init(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedWidget: typeof TWidget = Widget as any;

export default TypedWidget;
