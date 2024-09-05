import type { Component } from '@js/core/component';
import type { dxElementWrapper } from '@js/core/renderer';
import Widget from '@js/ui/widget/ui.widget';

interface AriaOptions {
  id?: string;
  role?: string;
  // eslint-disable-next-line spellcheck/spell-checker
  roledescription?: string;
  label?: string;
  haspopup?: boolean;
  expanded?: boolean | undefined;
}

declare class ExtendedWidget<TProperties> extends Widget<TProperties> {
  _keyboardListenerId: string;

  // component
  _deprecatedOptions: Record<string, unknown>;

  _optionsByReference: Record<string, unknown>;

  _disposed?: boolean;

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
  _cleanFocusState(): void;

  _toggleVisibility(visible: boolean): void;

  // dom_component
  _render(): void;
  _initMarkup(): void;
  _initTemplates(): void;
  _clean(): void;

  _getDefaultOptions(): TProperties;
  _getTemplateByOption(optionName: string): unknown;
  _getSynchronizableOptionsForCreateComponent(): string[];
  _defaultOptionsRules(): Record<string, unknown>[];

  _setOptionWithoutOptionChange(optionName: string, value: unknown): void;
  _setOptionsByReference(): void;

  _toggleActiveState($element: dxElementWrapper, value: boolean, e?: unknown): void;
  _toggleFocusClass(isFocused: boolean, $element: dxElementWrapper): void;

  _createComponent<TComponent>(
    element: string | HTMLElement | dxElementWrapper,
    component: string | (new (...args) => TComponent),
    config: TComponent extends Component<infer TTProperties> ? TTProperties : never,
  ): TComponent;

  // component
  _init(): void;
  _initOptions(options: TProperties): void;
  _createActionByOption(optionName: string, config?: Record<string, unknown>);
  _isInitialOptionValue(name: string): boolean;
  _setDeprecatedOptions(): void;
  _optionChanged(args: Record<string, unknown>): void;
  _dispose(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedWidget: typeof ExtendedWidget = Widget as any;

export default TypedWidget;
