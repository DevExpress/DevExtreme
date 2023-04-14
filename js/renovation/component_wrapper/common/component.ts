/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  createRef, RefObject, VNode, Component,
} from 'inferno';
import KeyboardProcessor from '../../../events/core/keyboard_processor';
import renderer from '../../../core/inferno_renderer';

// eslint-disable-next-line import/named
import $, { dxElementWrapper } from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import DOMComponent from '../../../core/dom_component';
import { extend } from '../../../core/utils/extend';
import { getPublicElement } from '../../../core/element';
import type { UserDefinedElement } from '../../../core/element';
import {
  isDefined, isRenderer, isString,
} from '../../../core/utils/type';
import { TemplateModel, TemplateWrapper } from './template_wrapper';
import { updatePropsImmutable } from '../utils/update_props_immutable';
import type { Option, TemplateComponent } from './types';

import '../../../events/click';
import '../../../events/core/emitter.feedback';
import '../../../events/hover';

const setDefaultOptionValue = (
  options: Record<string, unknown>,
  defaultValueGetter: (name: string) => unknown,
) => (name: string): void => {
  if (Object.prototype.hasOwnProperty.call(options, name) && options[name] === undefined) {
    // eslint-disable-next-line no-param-reassign
    options[name] = defaultValueGetter(name);
  }
};

interface ElementAttributes extends Record<string, unknown> {
  class: string;
}

export interface ComponentWrapperProps extends Record<string, unknown> {
  onContentReady?: (e: Record<string, unknown>) => void;
  elementAttr?: ElementAttributes;
}

export default class ComponentWrapper extends DOMComponent<ComponentWrapperProps> {
  static IS_RENOVATED_WIDGET = false;

  // NOTE: We should declare all instance options with '!' because of DOMComponent life cycle
  _actionsMap!: {
    [name: string]: Function;
  };

  _aria!: Record<string, string>;

  customKeyHandlers!: Record<string, Function>;

  defaultKeyHandlers!: Record<string, Function>;

  _documentFragment!: DocumentFragment;

  _elementAttr!: {
    [name: string]: unknown;
    class?: string;
  };

  _isNodeReplaced!: boolean;

  _props!: Record<string, unknown>;

  _storedClasses?: string;

  _viewRef!: RefObject<unknown>;

  _viewComponent!: typeof Component;

  _shouldRaiseContentReady = false;

  _componentTemplates!: Record<string, TemplateComponent | undefined>;

  get _propsInfo(): {
    allowNull: string[];
    twoWay: [string, string, string][];
    elements: string[];
    templates: string[];
    props: string[];
  } {
    return {
      allowNull: [],
      twoWay: [],
      elements: [],
      templates: [],
      props: [],
    };
  }

  constructor(element: UserDefinedElement, options?: ComponentWrapperProps) {
    super(element, options);

    this.validateKeyDownHandler();
  }

  validateKeyDownHandler(): void {
    const supportedKeyNames = this.getSupportedKeyNames();
    const hasComponentDefaultKeyHandlers = supportedKeyNames.length > 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasComponentKeyDownMethod = typeof (this._viewComponent.prototype as any).keyDown === 'function';

    if (hasComponentDefaultKeyHandlers && !hasComponentKeyDownMethod) {
      throw Error('Component\'s declaration must have \'keyDown\' method.');
    }
  }

  public get viewRef(): unknown {
    return this._viewRef?.current;
  }

  _checkContentReadyOption(fullName: string): boolean {
    const contentReadyOptions = this._getContentReadyOptions().reduce((options, name) => {
      // eslint-disable-next-line no-param-reassign
      options[name] = true;
      return options;
    }, {});

    this._checkContentReadyOption = (optionName): boolean => !!contentReadyOptions[optionName];
    return this._checkContentReadyOption(fullName);
  }

  _getContentReadyOptions(): string[] {
    return ['rtlEnabled'];
  }

  _fireContentReady(): void {
    this._actionsMap.onContentReady({});
  }

  _getDefaultOptions(): Record<string, unknown> {
    const viewDefaultProps = this._getViewComponentDefaultProps();
    return extend(
      true,
      super._getDefaultOptions(),
      viewDefaultProps,
      this._propsInfo.twoWay.reduce(
        (
          options: { [name: string]: unknown },
          [name, defaultName, eventName],
        ) => ({
          ...options,
          [name]: viewDefaultProps[defaultName],
          [eventName]: (value: unknown): void => this.option(name, value),
        }),
        {},
      ),
      this._propsInfo.templates.reduce(
        (
          options: { [name: string]: unknown },
          name,
        ) => ({
          ...options,
          [name]: null,
        }),
        {},
      ),
    ) as Record<string, unknown>;
  }

  _getUnwrappedOption(): Record<string, unknown> {
    const unwrappedProps = {};
    Object
      .keys(this.option())
      .forEach((key) => {
        unwrappedProps[key] = this.option(key);
      });
    return unwrappedProps;
  }

  _initializeComponent(): void {
    super._initializeComponent();

    this._templateManager?.addDefaultTemplates(this.getDefaultTemplates());
    const optionProxy = this._getUnwrappedOption();

    this._props = this._optionsWithDefaultTemplates(optionProxy);
    this._propsInfo.templates.forEach((template) => {
      this._componentTemplates[template] = this._createTemplateComponent(this._props[template]);
    });

    Object.keys(this._getActionConfigsFull()).forEach((name) => this._addAction(name));

    this._viewRef = createRef();
    this.defaultKeyHandlers = this._createDefaultKeyHandlers();
  }

  _initMarkup(): void {
    const props = this.getProps();
    this._renderWrapper(props);
  }

  _renderWrapper(props: Record<string, unknown>): void {
    const containerNode = this.$element()[0];

    if (!this._isNodeReplaced) {
      renderer.onPreRender();
    }

    renderer.render(this._viewComponent, props, containerNode, this._isNodeReplaced);

    if (!this._isNodeReplaced) {
      this._isNodeReplaced = true;
      renderer.onAfterRender();
      this._shouldRaiseContentReady = true;
    }

    if (this._shouldRaiseContentReady) {
      this._fireContentReady();
      this._shouldRaiseContentReady = false;
    }
  }

  _silent(name: string, value: unknown): void {
    this._options.silent(name, value);
  }

  _render(): void { } // NOTE: Inherited from DOM_Component

  _removeWidget(): void {
    renderer.remove(this.$element()[0]);
  }

  _dispose(): void {
    this._removeWidget();
    super._dispose();
  }

  get elementAttr(): HTMLAttributes<unknown> {
    const element = this.$element()[0];
    if (!this._elementAttr) {
      const { attributes } = element;
      const attrs = Array.from<{ name: string; value: unknown }>(attributes)
        .filter((attr) => !this._propsInfo.templates.includes(attr.name)
          && attributes[attr.name]?.specified)
        .reduce((result, { name, value }) => {
          const updatedAttributes = result;
          const isDomAttr = name in element;
          updatedAttributes[name] = value === '' && isDomAttr ? element[name] : value;
          return updatedAttributes;
        }, {});
      this._elementAttr = attrs;
      this._storedClasses = element.getAttribute('class') || '';
    }
    const elemStyle: CSSStyleDeclaration = element.style;

    const style = {};
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < elemStyle.length; i += 1) {
      style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
    }
    this._elementAttr.style = style;

    this._elementAttr.class = this._storedClasses;

    return this._elementAttr;
  }

  _getAdditionalActionConfigs(): Record<string, Record<string, unknown>> {
    return {
      onContentReady: {
        excludeValidators: ['disabled', 'readOnly'],
      },
    };
  }

  _getAdditionalProps(): string[] {
    return [];
  }

  _patchOptionValues(options: Record<string, unknown>): Record<string, unknown> {
    const {
      allowNull, twoWay, elements, props,
    } = this._propsInfo;
    const viewDefaultProps = this._getViewComponentDefaultProps();
    const defaultWidgetPropsKeys = Object.keys(viewDefaultProps);
    const defaultOptions = this._getDefaultOptions();
    const { ref, children, onKeyboardHandled } = options;
    const onKeyDown = onKeyboardHandled
      ? (_: never, event_options: unknown[]): void => {
        (onKeyboardHandled as (args: unknown[]) => void)(event_options);
      }
      : undefined;
    const widgetProps = {
      ref,
      children,
      onKeyDown,
    };
    [...props, ...this._getAdditionalProps()].forEach((propName) => {
      if (Object.prototype.hasOwnProperty.call(options, propName)) {
        widgetProps[propName] = options[propName];
      }
    });

    allowNull.forEach(
      setDefaultOptionValue(widgetProps, () => null),
    );

    defaultWidgetPropsKeys.forEach(
      setDefaultOptionValue(
        widgetProps,
        (name: string) => defaultOptions[name],
      ),
    );
    twoWay.forEach(([name, defaultName]) => {
      setDefaultOptionValue(widgetProps, () => defaultOptions[defaultName])(name);
    });

    elements.forEach((name: string) => {
      if (name in widgetProps) {
        const value = widgetProps[name];
        if (isRenderer(value)) {
          widgetProps[name] = this._patchElementParam(value);
        }
      }
    });

    return widgetProps;
  }

  getSupportedKeyNames(): string[] {
    return [];
  }

  prepareStyleProp(props: Record<string, unknown>): Record<string, unknown> {
    if (typeof props.style === 'string') {
      return { ...props, style: {}, cssText: props.style };
    }

    return props;
  }

  getProps(): Record<string, unknown> {
    const { elementAttr } = this.option();

    const options = this._patchOptionValues({
      ...this._props,
      ref: this._viewRef,
      children: this._extractDefaultSlot(),
      aria: this._aria,
    });
    this._propsInfo.templates.forEach((template) => {
      options[template] = this._componentTemplates[template];
    });

    return this.prepareStyleProp({
      ...options,
      ...this.elementAttr,
      ...elementAttr,
      className: [
        ...(this.elementAttr.class ?? '').split(' '),
        ...(elementAttr?.class ?? '').split(' '),
      ]
        .filter((c, i, a) => c && a.indexOf(c) === i)
        .join(' ')
        .trim(),
      class: '',
      ...this._actionsMap,
    });
  }

  _getActionConfigs(): Record<string, Record<string, unknown>> {
    return {};
  }

  _getActionConfigsFull(): Record<string, Record<string, unknown>> {
    return {
      ...this._getActionConfigs(),
      ...this._getAdditionalActionConfigs(),
    };
  }

  getDefaultTemplates(): Record<string, undefined> {
    const defaultTemplates = Object.values(this._templatesInfo);
    const result = {};

    defaultTemplates.forEach((template) => {
      result[template] = 'dx-renovation-template-mock';
    });

    return result;
  }

  get _templatesInfo(): Record<string, string> {
    return {};
  }

  _optionsWithDefaultTemplates(options: Record<string, unknown>): Record<string, unknown> {
    const templateOptions = Object.entries(this._templatesInfo)
      .reduce(
        (result, [templateName, templateValue]) => ({
          ...result,
          [templateName]: options[templateName] ?? templateValue,
        }), {},
      );
    return {
      ...options,
      ...templateOptions,
    };
  }

  _init(): void {
    super._init();

    this.customKeyHandlers = {};
    this._actionsMap = {};
    this._aria = {};
    this._componentTemplates = {};
  }

  _createDefaultKeyHandlers(): Record<string, Function> {
    const result = {};
    const keys = this.getSupportedKeyNames();

    keys.forEach((key) => {
      // eslint-disable-next-line
      result[key] = (e: Event): Event | undefined => (this.viewRef as any).keyDown(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (KeyboardProcessor as any).createKeyDownOptions(e),
      );
    });
    return result;
  }

  _addAction(event: string, actionToAdd?: Function): void {
    let action = actionToAdd;
    if (!action) {
      const actionByOption = this._createActionByOption(
        event,
        this._getActionConfigsFull()[event],
      );

      action = (
        actArgs: Record<string, string | Element | dxElementWrapper>,
      ): void => {
        Object.keys(actArgs).forEach((name) => {
          if (isDefined(actArgs[name]) && domAdapter.isNode(actArgs[name])) {
            // eslint-disable-next-line no-param-reassign
            actArgs[name] = getPublicElement($(actArgs[name]));
          }
        });
        return actionByOption(actArgs) as undefined;
      };
    }
    this._actionsMap[event] = action;
  }

  _optionChanged(option: Option): void {
    const {
      name,
      fullName,
      value,
      previousValue,
    } = option;
    updatePropsImmutable(this._props, this.option(), name, fullName);

    if (this._propsInfo.templates.includes(name) && value !== previousValue) {
      this._componentTemplates[name] = this._createTemplateComponent(value);
    }

    if (name && this._getActionConfigsFull()[name]) {
      this._addAction(name);
    }

    this._shouldRaiseContentReady = this._shouldRaiseContentReady
      || this._checkContentReadyOption(fullName);
    super._optionChanged(option);
    this._invalidate();
  }

  _extractDefaultSlot(): VNode | null {
    if (this.option('_hasAnonymousTemplateContent')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return renderer.createElement(TemplateWrapper, {
        template: this._getTemplate(this._templateManager.anonymousTemplateName),
        transclude: true,
        renovated: true,
      });
    }
    return null;
  }

  _createTemplateComponent(templateOption: unknown): TemplateComponent | undefined {
    if (!templateOption) {
      return undefined;
    }

    const template = this._getTemplate(templateOption);

    if (isString(template) && template === 'dx-renovation-template-mock') {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const templateWrapper = (model: TemplateModel): VNode => renderer.createElement(
      TemplateWrapper, { template, model },
    );

    return templateWrapper;
  }

  _wrapKeyDownHandler(initialHandler: Function): Function {
    return (options: {
      originalEvent: Event & { cancel: boolean };
      keyName: string;
      which: string;
    }): Event => {
      const { originalEvent, keyName, which } = options;
      const keys = this.customKeyHandlers;
      const func = keys[keyName] || keys[which];

      // NOTE: registered handler has more priority
      if (func !== undefined) {
        const handler = func.bind(this);
        const result = handler(originalEvent, options);

        if (!result) {
          originalEvent.cancel = true;
          return originalEvent;
        }
      }

      // NOTE: make it possible to pass onKeyDown property
      return initialHandler?.(originalEvent, options) as Event;
    };
  }

  _toPublicElement(element: string | Element | dxElementWrapper): Element {
    return getPublicElement($(element));
  }

  _patchElementParam(value: Element): Element {
    try {
      const result = $(value);
      const element = result?.get(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return element?.nodeType ? element : value;
    } catch (error) {
      return value;
    }
  }

  // Public API
  repaint(): void {
    this._isNodeReplaced = false;
    this._shouldRaiseContentReady = true;
    this._removeWidget();
    this._refresh();
  }

  _supportedKeys(): Record<string, Function> {
    return {
      ...this.defaultKeyHandlers,
      ...this.customKeyHandlers,
    };
  }

  registerKeyHandler(key: string, handler: Function): void {
    this.customKeyHandlers[key] = handler;
  }

  // NOTE: this method will be deprecated
  //       aria changes should be defined in declaration or passed through property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAria(name: string, value: string): void {
    this._aria[name] = value;
    this._initMarkup();
  }

  _getViewComponentDefaultProps(): Record<PropertyKey, unknown> {
    return this._viewComponent.defaultProps as Record<PropertyKey, unknown> || {};
  }
}

ComponentWrapper.IS_RENOVATED_WIDGET = true;

/* eslint-enable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
