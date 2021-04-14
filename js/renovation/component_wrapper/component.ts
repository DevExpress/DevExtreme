/* eslint-disable */
import { render, createRef, RefObject, Fragment } from "inferno";
import { createElement } from 'inferno-create-element';
import { hydrate } from 'inferno-hydrate';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import DOMComponent from '../../core/dom_component';
import { extend } from '../../core/utils/extend';
import { getPublicElement } from '../../core/element';
import { isDefined, isRenderer } from '../../core/utils/type';

import { InfernoEffectHost } from "@devextreme/vdom";
import { TemplateWrapper } from "./template_wrapper";


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
  _propsInfo!: {
    allowNull: string[],
    twoWay: any[],
    elements: string[],
    templates: string[]
  };
  _storedClasses?: string;
  _supportedKeys!: () => {
    [name: string]: Function,
  };
  _viewRef!: RefObject<unknown>;
  _viewComponent!: any;

  get viewRef() {
    return this._viewRef.current;
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
  }

  _render() {} // NOTE: Inherited from DOM_Component

  _dispose() {
    const containerNode = this.$element()[0];
    const parentNode = containerNode.parentNode;
    parentNode.$V = containerNode.$V;
    containerNode.$V = null;
    render(null, parentNode);
    delete parentNode.$V;
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

  _patchOptionValues(options) {
    const { allowNull, twoWay, elements } = this._propsInfo;
    const defaultProps = this._viewComponent.defaultProps;

    allowNull.forEach(
      setDefaultOptionValue(options, () => null)
    );

    Object.keys(defaultProps).forEach(
      setDefaultOptionValue(
        options,
        (name: string) => defaultProps[name]
      )
    );

    twoWay.forEach(([name, defaultValue]) =>
      setDefaultOptionValue(options, () => defaultValue)(name)
    );

    elements.forEach((name: string) => {
      if(name in options) {
        const value = options[name];
        if(isRenderer(value)) {
          options[name] = this._patchElementParam(value);
        }
      }
    });

    return options;
  }

  getProps() {
    const options = this._patchOptionValues({
      ...this.option(),
      ref: this._viewRef,
      children: this._extractDefaultSlot(),
    });

    return {
      ...options,
      ...this.elementAttr,
      ...options.elementAttr,
      className: [
        ...(this.elementAttr.class || '').split(' '),
        ...(options.elementAttr.class || '').split(' '),
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

  _init() {
    super._init();
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

      action = function (actArgs: { [name: string]: any }) {
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
    const { name } = option || {};
    if (name && this._getActionConfigs()[name]) {
      this._addAction(name);
    }

    super._optionChanged(option);
    this._invalidate();
  }

  _extractDefaultSlot() {
    if (this.option('_hasAnonymousTemplateContent')) {
      const dummyDivRefCallback: (ref: any) => void = (dummyDivRef) => {
        if (dummyDivRef) {
          const { parentNode } = dummyDivRef;
          if (parentNode) {
            parentNode.removeChild(dummyDivRef);
            this._getTemplate(this._templateManager.anonymousTemplateName).render(
              {
                container: getPublicElement($(parentNode)),
                transclude: true,
              }
            );
          }
        }
      };

      return createElement(
        Fragment,
        {},
        createElement('div', {
          style: { display: 'none' },
          ref: dummyDivRefCallback,
        })
      );
    }
    return null;
  }

  _createTemplateComponent(props, templateOption) {
    if (!templateOption) {
      return;
    }

    const template = this._getTemplate(templateOption);

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
    } catch(error) {
      return value;
    }
    result = result?.get(0);
    return result?.nodeType ? result : value
  }

  // Public API
  repaint() {
    this._isNodeReplaced = false;
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
