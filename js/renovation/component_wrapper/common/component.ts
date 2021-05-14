/* eslint-disable */
import { render, createRef, RefObject } from "inferno";
import { createElement } from 'inferno-create-element';
import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import DOMComponent from '../../../core/dom_component';
import { extend } from '../../../core/utils/extend';
import { getPublicElement } from '../../../core/element';
import { isDefined, isRenderer } from '../../../core/utils/type';

import { InfernoEffectHost, hydrate } from "@devextreme/vdom";
import { TemplateWrapper } from "./template_wrapper";
import { updatePropsImmutable } from '../utils/update-props-immutable';


const setDefaultOptionValue = (options, defaultValueGetter) => (name) => {
  if (options.hasOwnProperty(name) && options[name] === undefined) {
    options[name] = defaultValueGetter(name);
  }
};

export default class ComponentWrapper extends DOMComponent {
  // NOTE: We should declare all instance options with '!' because of DOMComponent life cycle
  _actionsMap!: {
    [name: string]: Function;
  };
  _documentFragment!: DocumentFragment;
  _elementAttr!: {
    class?: string;
    [name: string]: unknown;
  };
  _isNodeReplaced!: boolean;
  _props: any;
  _storedClasses?: string;
  _supportedKeys!: () => {
    [name: string]: Function,
  };
  _viewRef!: RefObject<unknown>;
  _viewComponent!: any;
  _disposeMethodCalled = false;
  _shouldRaiseContentReady: boolean = false;

  get _propsInfo(): {
    allowNull: string[];
    twoWay: any[];
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

  get viewRef() {
    return this._viewRef?.current;
  }

  _checkContentReadyOption(fullName) {
    const contentReadyOptions = this._getContentReadyOptions().reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});

    this._checkContentReadyOption = (fullName) => {
      return !!contentReadyOptions[fullName];
    };
    return this._checkContentReadyOption(fullName);
  }

  _getContentReadyOptions(): string[] {
    return ['rtlEnabled'];
  }

  _fireContentReady() {
    this.option('onContentReady')?.({ component: this, element: this.$element() });
  }

  _getDefaultOptions() {
    return extend(
      true,
      super._getDefaultOptions(),
      this._viewComponent.defaultProps,
      this._propsInfo.twoWay.reduce(
        (
          options: { [name: string]: unknown },
          [name, defaultValue, eventName]
        ) => ({
          ...options,
          [name]: defaultValue,
          [eventName]: (value) => this.option(name, value),
        }),
        {}
      ),
      this._propsInfo.templates.reduce(
        (
          options: { [name: string]: unknown },
          name
        ) => ({
          ...options,
          [name]: null
        }),
        {}
      )
    );
  }

  _initMarkup() {
    const props = this.getProps();
    this._renderWrapper(props);
  }

  _renderWrapper(props): void {
    const containerNode = this.$element()[0];
    const parentNode = containerNode.parentNode;

    if (!this._isNodeReplaced) {
      const nextNode = containerNode?.nextSibling;

      const rootNode = domAdapter.createElement('div');
      rootNode.appendChild(containerNode);
      const mountNode = this._documentFragment.appendChild(rootNode);
      InfernoEffectHost.lock();
      hydrate(
        createElement(this._viewComponent, props),
        mountNode
      );
      containerNode.$V = mountNode.$V;
      if (parentNode) {
        parentNode.insertBefore(containerNode, nextNode);
      }
      InfernoEffectHost.callEffects();
      this._isNodeReplaced = true;
    } else {
      render(
        createElement(this._viewComponent, props),
        containerNode
      );
    }

    if (this._shouldRaiseContentReady !== false) {
      this._fireContentReady();
      this._shouldRaiseContentReady = false;
    }
  }

  _render() { } // NOTE: Inherited from DOM_Component

  dispose() {
    this._disposeMethodCalled = true;
    super.dispose();
  }

  _dispose() {
    const containerNode = this.$element()[0];
    const parentNode = containerNode.parentNode;

    if (parentNode) {
      parentNode.$V = containerNode.$V;
      render(
        this._disposeMethodCalled ? createElement(
          containerNode.tagName,
          this.elementAttr
        ) : null,
        parentNode);
      delete parentNode.$V;
    }
    delete containerNode.$V;

    super._dispose();
  }

  get elementAttr() {
    if (!this._elementAttr) {
      const { attributes } = this.$element()[0];
      this._elementAttr = {
        ...Object.keys(attributes).reduce((a, key) => {
          if (attributes[key].specified) {
            a[attributes[key].name] = attributes[key].value;
          }
          return a;
        }, {}),
      };
      this._storedClasses = this.$element()[0].getAttribute('class') || '';
    }
    const elemStyle = this.$element()[0].style;

    const style = {};
    for (let i = 0; i < elemStyle.length; i++) {
      style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
    }
    this._elementAttr.style = style;

    this._elementAttr.class = this._storedClasses;

    return this._elementAttr;
  }

  _patchOptionValues(options: Record<string, unknown> = {}) {
    const { allowNull, twoWay, elements, props } = this._propsInfo;
    const defaultProps = this._viewComponent.defaultProps;
    const { ref, children, onKeyboardHandled } = options;
    const onKeyDown = onKeyboardHandled ? (_, event_options) => (onKeyboardHandled as (unknown) => void)(event_options) : undefined;
    const widgetProps = {
      ref,
      children,
      onKeyDown,
    };
    [...props, 'onContentReady'].forEach(propName => {
      if (options.hasOwnProperty(propName)) {
        widgetProps[propName] = options[propName];
      }

    });

    allowNull.forEach(
      setDefaultOptionValue(widgetProps, () => null)
    );
    
    Object.keys(defaultProps).forEach(
      setDefaultOptionValue(
        widgetProps,
        (name: string) => defaultProps[name]
      )
    );

    twoWay.forEach(([name, defaultValue]) =>
      setDefaultOptionValue(widgetProps, () => defaultValue)(name)
    );

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

  getProps() {
    const { elementAttr } = this.option();

    const options = this._patchOptionValues({
      ...this._props,
      ref: this._viewRef,
      children: this._extractDefaultSlot(),
    });

    return {
      ...options,
      ...this.elementAttr,
      ...elementAttr,
      className: [
        ...(this.elementAttr.class || '').split(' '),
        ...(elementAttr.class || '').split(' '),
      ]
        .filter((c, i, a) => c && a.indexOf(c) === i)
        .join(' ')
        .trim(),
      class: '',
      ...this._actionsMap,
    };
  }

  _getActionConfigs() {
    return {};
  }

  getDefaultTemplates() {
    const names = this.getDefaultTemplateNames();
    const result = {};

    names.forEach((name) => result[name] = 'dx-renovation-template-mock');

    return result;
  }

  getDefaultTemplateNames(): string[] {
    return [];
  }

  _init() {
    super._init();
    this._templateManager.addDefaultTemplates(this.getDefaultTemplates());
    this._props = { ...this.option() };
    this._documentFragment = domAdapter.createDocumentFragment();
    this._actionsMap = {};

    Object.keys(this._getActionConfigs()).forEach((name) =>
      this._addAction(name)
    );

    this._viewRef = createRef();
    this._supportedKeys = () => ({});
  }

  _addAction(event: string, action?: Function) {
    if (!action) {
      const actionByOption = this._createActionByOption(
        event,
        this._getActionConfigs()[event]
      );

      action = function(actArgs: { [name: string]: any }) {
        Object.keys(actArgs).forEach((name) => {
          if (isDefined(actArgs[name]) && domAdapter.isNode(actArgs[name])) {
            actArgs[name] = getPublicElement($(actArgs[name]));
          }
        });
        return actionByOption(actArgs);
      };
    }
    this._actionsMap[event] = action;
  }

  _optionChanged(option) {
    const { name, fullName } = option;
    updatePropsImmutable(this._props, this.option(), name, fullName);
    if (name && this._getActionConfigs()[name]) {
      this._addAction(name);
    }
    this._shouldRaiseContentReady = this._shouldRaiseContentReady
      || this._checkContentReadyOption(fullName);
    super._optionChanged(option);
    this._invalidate();
  }

  _extractDefaultSlot() {
    if (this.option('_hasAnonymousTemplateContent')) {
      return createElement(TemplateWrapper, {
        template: this._getTemplate(this._templateManager.anonymousTemplateName),
        transclude: true,
      });
    }
    return null;
  }

  _createTemplateComponent(props, templateOption) {
    if (!templateOption) {
      return;
    }

    const template = this._getTemplate(templateOption);

    if (template.toString() === 'dx-renovation-template-mock') {
      return undefined;
    }
    const templateWrapper = (model: any) => {
      return createElement(
        TemplateWrapper,
        {
          template,
          model
        }
      )
    };

    return templateWrapper
  }

  _wrapKeyDownHandler(handler) {
    return (options) => {
      const { originalEvent, keyName, which } = options;
      const keys = this._supportedKeys();
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
      return handler?.(originalEvent, options);
    };
  }

  _toPublicElement(element: any) {
    return getPublicElement($(element));
  }

  _patchElementParam(value: any) {
    let result: any;

    try {
      result = $(value);
    } catch (error) {
      return value;
    }
    result = result?.get(0);
    return result?.nodeType ? result : value
  }

  // Public API
  repaint() {
    this._isNodeReplaced = false;
    this._shouldRaiseContentReady = true;
    this._refresh();
  }

  registerKeyHandler(key, handler) {
    const currentKeys = this._supportedKeys();
    this._supportedKeys = () => ({ ...currentKeys, [key]: handler });
  }

  // NOTE: this method will be deprecated
  //       aria changes should be defined in declaration or passed through property
  setAria(name: string, value: string) {
    throw new Error(
      '"setAria" method is deprecated, use "aria" property instead'
    );
  }

  static IS_RENOVATED_WIDGET = false;
}

/// #DEBUG
ComponentWrapper.IS_RENOVATED_WIDGET = true;  
/// #ENDDEBUG
