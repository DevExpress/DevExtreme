/* eslint-disable @typescript-eslint/ban-types */
import {
  render, createRef, RefObject, VNode, Component,
} from 'inferno';
import { createElement } from 'inferno-create-element';
import { InfernoEffectHost, hydrate } from '@devextreme/vdom';
// eslint-disable-next-line import/named
import $, { dxElementWrapper } from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import DOMComponent from '../../../core/dom_component';
import { extend } from '../../../core/utils/extend';
import { getPublicElement } from '../../../core/element';
import { isDefined, isRenderer, isString } from '../../../core/utils/type';

import { TemplateModel, TemplateWrapper } from './template_wrapper';
import { updatePropsImmutable } from '../utils/update-props-immutable';
import { Option, TemplateComponent } from './types';

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

interface ComponentWrapperProps extends Record<string, unknown> {
  onContentReady?: (e: Record<string, unknown>) => void;
  elementAttr?: ElementAttributes;
}

export default class ComponentWrapper extends DOMComponent<ComponentWrapperProps> {
  static IS_RENOVATED_WIDGET = false;

  // NOTE: We should declare all instance options with '!' because of DOMComponent life cycle
  _actionsMap!: {
    [name: string]: Function;
  };

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
    this.option('onContentReady')?.({ component: this, element: this.$element() });
  }

  _getDefaultOptions(): Record<string, unknown> {
    return extend(
      true,
      super._getDefaultOptions(),
      this._viewComponent.defaultProps,
      this._propsInfo.twoWay.reduce(
        (
          options: { [name: string]: unknown },
          [name, defaultName, eventName],
        ) => ({
          ...options,
          [name]: this._viewComponent.defaultProps[defaultName],
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
    );
  }

  _initMarkup(): void {
    const props = this.getProps();
    this._renderWrapper(props);
  }

  _renderWrapper(props: Record<string, unknown>): void {
    const containerNode = this.$element()[0];
    const { parentNode } = containerNode;

    if (!this._isNodeReplaced) {
      const nextNode = containerNode?.nextSibling;

      const rootNode = domAdapter.createElement('div');
      rootNode.appendChild(containerNode);
      const mountNode = this._documentFragment.appendChild(rootNode);
      InfernoEffectHost.lock();
      hydrate(
        createElement(this._viewComponent, props),
        mountNode,
      );
      containerNode.$V = mountNode.$V;
      if (parentNode) {
        parentNode.insertBefore(containerNode, nextNode);
      }
      InfernoEffectHost.callEffects();
      this._isNodeReplaced = true;
      this._shouldRaiseContentReady = true;
    } else {
      render(
        createElement(this._viewComponent, props),
        containerNode,
      );
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

  _dispose(): void {
    const containerNode = this.$element()[0];
    const { parentNode } = containerNode;

    if (parentNode) {
      parentNode.$V = containerNode.$V;
      render(null, parentNode);
      parentNode.appendChild(containerNode);
      containerNode.innerHTML = '';

      delete parentNode.$V;
    }
    delete containerNode.$V;

    super._dispose();
  }

  get elementAttr(): HTMLAttributes<unknown> {
    if (!this._elementAttr) {
      const { attributes } = this.$element()[0];
      this._elementAttr = {
        ...Object.keys(attributes).reduce((result, key) => {
          const updatedAttributes = result;
          if (attributes[key].specified) {
            updatedAttributes[attributes[key].name] = attributes[key].value;
          }
          return updatedAttributes;
        }, {}),
      };
      this._storedClasses = this.$element()[0].getAttribute('class') || '';
    }
    const elemStyle: CSSStyleDeclaration = this.$element()[0].style;

    const style = {};
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < elemStyle.length; i += 1) {
      style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
    }
    this._elementAttr.style = style;

    this._elementAttr.class = this._storedClasses;

    return this._elementAttr;
  }

  _patchOptionValues(options: Record<string, unknown>): Record<string, unknown> {
    const {
      allowNull, twoWay, elements, props,
    } = this._propsInfo;
    const { defaultProps } = this._viewComponent;
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
    [...props, 'onContentReady'].forEach((propName) => {
      if (Object.prototype.hasOwnProperty.call(options, propName)) {
        widgetProps[propName] = options[propName];
      }
    });

    allowNull.forEach(
      setDefaultOptionValue(widgetProps, () => null),
    );

    Object.keys(defaultProps).forEach(
      setDefaultOptionValue(
        widgetProps,
        (name: string) => defaultProps[name],
      ),
    );
    twoWay.forEach(([name, defaultName]) => {
      setDefaultOptionValue(widgetProps, () => defaultProps[defaultName])(name);
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

  getProps(): Record<string, unknown> {
    const { elementAttr } = this.option();

    const options = this._patchOptionValues({
      ...this._props,
      ref: this._viewRef,
      children: this._extractDefaultSlot(),
    });
    this._propsInfo.templates.forEach((template) => {
      options[template] = this._componentTemplates[template];
    });

    return {
      ...options,
      ...this.elementAttr,
      ...elementAttr,
      className: [
        ...(this.elementAttr.class || '').split(' '),
        ...(elementAttr?.class || '').split(' '),
      ]
        .filter((c, i, a) => c && a.indexOf(c) === i)
        .join(' ')
        .trim(),
      class: '',
      ...this._actionsMap,
    };
  }

  _getActionConfigs(): Record<string, Record<string, unknown>> {
    return {};
  }

  getDefaultTemplates(): Record<string, undefined> {
    const names = this.getDefaultTemplateNames();
    const result = {};

    names.forEach((name) => {
      result[name] = 'dx-renovation-template-mock';
    });

    return result;
  }

  getDefaultTemplateNames(): string[] {
    return [];
  }

  _init(): void {
    super._init();

    this.customKeyHandlers = {};
    this.defaultKeyHandlers = {};
    this._templateManager?.addDefaultTemplates(this.getDefaultTemplates());
    this._props = { ...this.option() };
    this._documentFragment = domAdapter.createDocumentFragment();
    this._actionsMap = {};

    this._componentTemplates = {};
    this._propsInfo.templates.forEach((template) => {
      this._componentTemplates[template] = this._createTemplateComponent(this._props[template]);
    });

    Object.keys(this._getActionConfigs()).forEach((name) => this._addAction(name));

    this._viewRef = createRef();
  }

  _addAction(event: string, actionToAdd?: Function): void {
    let action = actionToAdd;
    if (!action) {
      const actionByOption = this._createActionByOption(
        event,
        this._getActionConfigs()[event],
      );

      action = (actArgs: Record<string, string | Element | dxElementWrapper>): void => {
        Object.keys(actArgs).forEach((name) => {
          if (isDefined(actArgs[name]) && domAdapter.isNode(actArgs[name])) {
            // eslint-disable-next-line no-param-reassign
            actArgs[name] = getPublicElement($(actArgs[name]));
          }
        });
        return actionByOption(actArgs);
      };
    }
    this._actionsMap[event] = action;
  }

  _optionChanged(option: Option): void {
    const { name, fullName, value } = option;
    updatePropsImmutable(this._props, this.option(), name, fullName);

    if (this._propsInfo.templates.includes(name)) {
      this._componentTemplates[name] = this._createTemplateComponent(value);
    }

    if (name && this._getActionConfigs()[name]) {
      this._addAction(name);
    }

    this._shouldRaiseContentReady = this._shouldRaiseContentReady
      || this._checkContentReadyOption(fullName);
    super._optionChanged(option);
    this._invalidate();
  }

  _extractDefaultSlot(): VNode | null {
    if (this.option('_hasAnonymousTemplateContent')) {
      return createElement(TemplateWrapper, {
        template: this._getTemplate(this._templateManager.anonymousTemplateName),
        transclude: true,
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
    const templateWrapper = (model: TemplateModel): VNode => createElement(
      TemplateWrapper,
      {
        template,
        model,
      },
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
      return initialHandler?.(originalEvent, options);
    };
  }

  _toPublicElement(element: string | Element | dxElementWrapper): Element {
    return getPublicElement($(element));
  }

  _patchElementParam(value: Element): Element {
    try {
      const result: dxElementWrapper = $(value);
      const element = result?.get(0);
      return element?.nodeType ? element : value;
    } catch (error) {
      return value;
    }
  }

  // Public API
  repaint(): void {
    this._isNodeReplaced = false;
    this._shouldRaiseContentReady = true;
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
  setAria(_name: string, _value: string): void {
    throw new Error(
      '"setAria" method is deprecated, use "aria" property instead',
    );
  }
}

/// #DEBUG
ComponentWrapper.IS_RENOVATED_WIDGET = true;
/// #ENDDEBUG
