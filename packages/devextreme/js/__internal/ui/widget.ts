import type { Component } from '@js/core/component';
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
  setAria(attribute: string, value: string | boolean, $element?: dxElementWrapper): void;

  _setWidgetOption(componentInstancePath: string, args: unknown): void;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void>;

  _fireContentReadyAction(force?: boolean): void;

  // dom_component
  _render(): void;
  _initMarkup(): void;
  _clean(): void;

  _getDefaultOptions(): TProperties;
  _defaultOptionsRules(): Record<string, unknown>[];
  _optionChanged(args: Record<string, unknown>): void;

  _toggleActiveState($element: dxElementWrapper, value: boolean): void;

  _createComponent<TComponent>(
    element: string | HTMLElement | dxElementWrapper,
    component: new (...args) => TComponent,
    config: TComponent extends Component<infer TTProperties> ? TTProperties : never,
  ): TComponent;

  // component
  _init(): void;
  _createActionByOption(optionName: string, config?: Record<string, unknown>);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedWidget: typeof ExtendedWidget = Widget as any;

export default TypedWidget;
