import type { Component } from '@js/core/component';
import type { dxElementWrapper } from '@js/core/renderer';
import Widget from '@js/ui/widget/ui.widget';

interface AriaOptions {
  id?: string;
  role?: string;
  // eslint-disable-next-line spellcheck/spell-checker
  roledescription?: string;
  label?: string;
}

declare class ExtendedWidget<TProperties> extends Widget<TProperties> {
  _keyboardListenerId: string;

  // component
  _deprecatedOptions: Record<string, unknown>;

  setAria(ariaOptions: AriaOptions, $element?: dxElementWrapper): void;
  setAria(
    attribute: string,
    value: string | boolean | null | undefined,
    $element?: dxElementWrapper
  ): void;

  _setWidgetOption(componentInstancePath: string, args: unknown): void;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyboardListeners(): any[];
  _keyboardHandler(options: unknown, onlyChildProcessing: boolean): boolean;

  _fireContentReadyAction(force?: boolean): void;

  _focusOutHandler(event: unknown): void;
  _focusInHandler(event: unknown): void;
  _hoverEndHandler(event: unknown): void;

  _attachKeyboardEvents(): void;
  _attachHoverEvents(): void;
  _attachClickEvent(): void;

  _renderFocusState(): void;

  // dom_component
  _render(): void;
  _initMarkup(): void;
  _clean(): void;

  _getDefaultOptions(): TProperties;
  _defaultOptionsRules(): Record<string, unknown>[];
  _optionChanged(args: Record<string, unknown>): void;
  _setOptionWithoutOptionChange(optionName: string, value: unknown): void;
  _setOptionsByReference(): void;

  _toggleActiveState($element: dxElementWrapper, value: boolean, e?: unknown): void;
  _toggleFocusClass(isFocused: boolean, $element: dxElementWrapper): void;

  _createComponent<TComponent>(
    element: string | HTMLElement | dxElementWrapper,
    component: new (...args) => TComponent,
    config: TComponent extends Component<infer TTProperties> ? TTProperties : never,
  ): TComponent;

  // component
  _init(): void;
  _createActionByOption(optionName: string, config?: Record<string, unknown>);
  _isInitialOptionValue(name: string): boolean;
  _setDeprecatedOptions(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedWidget: typeof ExtendedWidget = Widget as any;

export default TypedWidget;
