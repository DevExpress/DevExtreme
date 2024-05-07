import type { dxElementWrapper } from '@js/core/renderer';
import Widget from '@js/ui/widget/ui.widget';

interface AriaOptions {
  role: string;
  // eslint-disable-next-line spellcheck/spell-checker
  roledescription: string;
  label: string;
}

declare class ExtendedWidget<TProperties> extends Widget<TProperties> {
  setAria(ariaOptions: AriaOptions): void;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void>;

  // dom_component
  _render(): void;
  _initMarkup(): void;
  _clean(): void;

  _getDefaultOptions(): TProperties;
  _optionChanged(args: Record<string, unknown>): void;

  _toggleActiveState($element: dxElementWrapper, value: boolean): void;

  _createComponent(
    element: string | HTMLElement | dxElementWrapper,
    component: unknown,
    config: TProperties,
  ): void;

  // component
  _init(): void;
  _createActionByOption(optionName: string, config: Record<string, unknown>);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedWidget: typeof ExtendedWidget = Widget as any;

export default TypedWidget;
