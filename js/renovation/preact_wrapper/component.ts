/* eslint-disable */
import * as Preact from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import DOMComponent from '../../core/dom_component';
import { extend } from '../../core/utils/extend';
import { removeDifferentElements } from './utils';
import { getPublicElement } from '../../core/element';

const setDefaultOptionValue = (options, defaultValueGetter) => (name) => {
  if (options.hasOwnProperty(name) && options[name] === undefined) {
    options[name] = defaultValueGetter(name);
  }
};


export default class PreactWrapper extends DOMComponent {
  // NOTE: We should declare all instance options with '!' because of DOMComponent life cycle
  _actionsMap!: {
    [name: string]: Function;
  };
  _documentFragment!: DocumentFragment;
  _elementAttr!: {
    class?: string;
    [name: string]: unknown;
  };
  _preactReplaced!: boolean;
  _propsInfo!: {
    allowNull: string[],
    twoWay: any[],
    elements: string[]
  };
  _shouldRefresh!: boolean;
  _storedClasses?: string;
  _supportedKeys!: () => {
    [name: string]: Function,
  };
  _viewRef!: Preact.RefObject<unknown>;
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
      )
    );
  }

  _initMarkup() {
    const props = this.getProps();
    if (this._shouldRefresh) {
      this._shouldRefresh = false;

      this._renderPreact({
        ...props,
        width: null,
        height: null,
        style: '',
        className: '',
        children: null,
      });
    }
    this._renderPreact(props);
  }

  _renderPreact(props) {
    const containerNode = this.$element()[0];

    if (!containerNode.parentNode) {
      this._documentFragment.appendChild(containerNode);
    }

    Preact.render(
      Preact.h(this._viewComponent, props),
      containerNode,
      this._preactReplaced ? undefined : containerNode,
    );
    this._preactReplaced = true;

    if (containerNode.parentNode === this._documentFragment) {
      this._documentFragment.removeChild(containerNode);
    }
  }

  _render() {}

  _dispose() {
    Preact.render(null, this.$element()[0]);
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
    }
    const elemStyle = this.$element()[0].style;

    const style = {};
    for (let i = 0; i < elemStyle.length; i++) {
      style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
    }
    this._elementAttr.style = style;

    const cssClass = this.$element()[0].getAttribute('class') || '';
    this._storedClasses =
      this._storedClasses ??
      cssClass
        .split(' ')
        .filter((name) => name.indexOf('dx-') === 0)
        .join(' ');
    this._elementAttr.class = cssClass
      .split(' ')
      .filter((name) => name.indexOf('dx-') !== 0)
      .concat(this._storedClasses)
      .join(' ')
      .trim();

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
        options[name] = this._patchElementParam(options[name]);
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

    this._viewRef = Preact.createRef();
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
          if (domAdapter.isNode(actArgs[name])) {
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
          parentNode.removeChild(dummyDivRef);
          this._getTemplate(this._templateManager.anonymousTemplateName).render(
            {
              container: getPublicElement($(parentNode)),
              transclude: true,
            }
          );
        }
      };

      return Preact.h(
        Preact.Fragment,
        {},
        Preact.h('div', {
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
    return ({ data, index }) => {
      const dummyDivRef = useRef<any>(); // TS doesn't allow to use <HTMLElement> ref type in Preact.h, only <SVGElement>
      useLayoutEffect(
        () => {
          const { parentNode } = dummyDivRef.current!;
          parentNode!.removeChild(dummyDivRef.current!);
          const $parent = $(parentNode);
          const $children = $parent.contents();

          Object.keys(data).forEach((name) => {
            if (domAdapter.isNode(data[name])) {
              data[name] = getPublicElement($(data[name]));
            }
          });

          $(
            template.render({
              container: getPublicElement($parent),
              model: data,
              ...(isFinite(index) ? { index } : {}),
            })
          );
          const $newChildren = $parent.contents();

          return () => {
            // NOTE: order is important
            removeDifferentElements($children, $newChildren);
          };
        },
        Object.keys(props).map((key) => props[key])
      );
      return Preact.h(
        Preact.Fragment,
        {},
        Preact.h("div", { style: { display: "none" }, ref: dummyDivRef })
      );
    };
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
    this._shouldRefresh = true;
    this._refresh();
  }

  registerKeyHandler(key, handler) {
    const currentKeys = this._supportedKeys();
    this._supportedKeys = () => ({ ...currentKeys, [key]: handler });
  }

  // NOTE: this method will be deprecated
  //       aria changes should be defined in declaration or passed through property
  setAria() {
    throw new Error(
      '"setAria" method is deprecated, use "aria" property instead'
    );
  }

  static IS_RENOVATED_WIDGET = false;
}

/// #DEBUG
PreactWrapper.IS_RENOVATED_WIDGET = true;
/// #ENDDEBUG
