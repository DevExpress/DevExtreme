/* eslint-disable */
import * as Preact from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';
import $ from '../../core/renderer';
import DOMComponent from '../../core/dom_component';
import { extend } from '../../core/utils/extend';
import { wrapElement, removeDifferentElements } from './utils';
import { getPublicElement } from '../../core/element';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export default class PreactWrapper extends DOMComponent {
  getInstance() {
    return this;
  }

  get viewRef() {
    return this._viewRef.current;
  }

  _getDefaultOptions() {
    return extend(
      true,
      super._getDefaultOptions(),
      this._viewComponent.defaultProps,
      (this._twoWayProps || []).reduce((options, [name, eventName, defaultValue]) => ({
        ...options,
        [name]: defaultValue,
        [eventName]: (value) => this.option(name, value),
      }), {}),
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
    const containerNode = this.$element().get(0);
    const replaceNode = !this._preactReplaced && containerNode.parentNode
      ? containerNode
      : undefined;

    if (containerNode.parentNode) {
      this._preactReplaced = true;
    }

    Preact.render(
      Preact.h(this._viewComponent, props),
      containerNode,
      replaceNode,
    );
  }

  _render() {}

  _dispose() {
    Preact.render(null, this.$element().get(0));
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
    this.storedClasses = this.storedClasses ?? cssClass
      .split(' ')
      .filter((name) => name.indexOf('dx-') === 0)
      .join(' ');
    this._elementAttr.class = cssClass
      .split(' ')
      .filter((name) => name.indexOf('dx-') !== 0)
      .concat(this.storedClasses)
      .join(' ')
      .trim();

    return this._elementAttr;
  }

  getProps() {
    const options = {
      ...this.option(),
      ref: this._viewRef,
      children: this._extractDefaultSlot(),
    };

    (this._twoWayProps || []).forEach(([name]) => {
      if (options.hasOwnProperty(name) && options[name] === undefined) {
        options[name] = null;
      }
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
      ...this._actionsMap,
    };
  }

  _getActionConfigs() {
    return {};
  }

  _init() {
    super._init();
    this._actionsMap = {};

    Object.keys(this._getActionConfigs()).forEach((name) =>
      this._addAction(name)
    );

    this._viewRef = Preact.createRef();
    this._supportedKeys = () => ({});
  }

  _addAction(event, action) {
    if(!action) {
      const actionByOption = this._createActionByOption(
        event,
        this._getActionConfigs()[event]
      );

      action = function(args) {
        Object.keys(args).forEach((name) => {
          if (/element$/i.exec(name)) {
            args[name] = getPublicElement($(args[name]));
          }
        });
        return actionByOption(args);
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
      const dummyDivRefCallback = (dummyDivRef) => {
        if (!dummyDivRef) return null;
        const { parentNode } = dummyDivRef;
        parentNode.removeChild(dummyDivRef);
        this._getTemplate(this._templateManager.anonymousTemplateName).render({
          container: getPublicElement($(parentNode)),
          transclude: true,
        });
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
  }

  _createTemplateComponent(props, templateOption) {
    if (!templateOption) {
      return;
    }

    const template = this._getTemplate(templateOption);
    return ({ data, index }) => {
      const dummyDivRef = useRef();
      useLayoutEffect(
        () => {
          const { parentNode } = dummyDivRef.current;
          parentNode.removeChild(dummyDivRef.current);
          const $parent = $(parentNode);
          const $children = $parent.contents();

          const $template = $(
            template.render({
              container: getPublicElement($parent),
              model: data,
              ...(isFinite(index) ? { index } : {}),
            })
          );

          if ($template.hasClass(TEMPLATE_WRAPPER_CLASS)) {
            wrapElement($parent, $template);
          }
          const $newChildren = $parent.contents();

          return () => {
            // NOTE: order is important
            removeDifferentElements($children, $newChildren);
          };
        },
        Object.keys(props).map((key) => props[key]),
      );
      return Preact.h(
        Preact.Fragment,
        {},
        Preact.h('div', { style: { display: 'none' }, ref: dummyDivRef })
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
      '"setAria" method is deprecated, use "aria" property instead',
    );
  }
}
