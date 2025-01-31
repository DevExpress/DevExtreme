import Class from '@js/core/class';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { attachInstanceToElement, getInstanceByElement } from '@js/core/utils/public_component';

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ITEM_CONTENT_PLACEHOLDER_CLASS = 'dx-item-content-placeholder';

const forcibleWatcher = function (watchMethod, fn, callback) {
  const filteredCallback = (function () {
    let oldValue;
    return function (value) {
      if (oldValue !== value) {
        callback(value, oldValue);
        oldValue = value;
      }
    };
  }());

  return {
    dispose: watchMethod(fn, filteredCallback),
    force() {
      filteredCallback(fn());
    },
  };
};

const CollectionItem = Class.inherit({

  ctor($element, options, rawData) {
    this._$element = $element;
    this._options = options;
    this._rawData = rawData;

    attachInstanceToElement($element, this, this._dispose);

    this._render();
  },

  _render() {
    const $placeholder = $('<div>').addClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
    this._$element.append($placeholder);

    this._watchers = [];
    this._renderWatchers();
  },

  _renderWatchers() {
    this._startWatcher('disabled', this._renderDisabled.bind(this));
    this._startWatcher('visible', this._renderVisible.bind(this));
  },

  _startWatcher(field, render) {
    const rawData = this._rawData;
    const exprGetter = this._options.fieldGetter(field);

    const watcher = forcibleWatcher(this._options.watchMethod(), () => exprGetter(rawData), (value, oldValue) => {
      this._dirty = true;
      render(value, oldValue);
    });

    this._watchers.push(watcher);
  },
  // @ts-expect-error
  setDataField() {
    this._dirty = false;
    each(this._watchers, (_, watcher) => {
      watcher.force();
    });
    if (this._dirty) {
      return true;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderDisabled(value, oldValue) {
    this._$element.toggleClass(DISABLED_STATE_CLASS, !!value);
    this._$element.attr('aria-disabled', !!value);

    this._updateOwnerFocus(value);
  },

  _updateOwnerFocus(isDisabled) {
    const ownerComponent = this._options.owner;

    if (ownerComponent && isDisabled) {
      ownerComponent._resetItemFocus(this._$element);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderVisible(
    value: boolean | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    oldValue?: boolean,
  ): void {
    this._$element.toggleClass(INVISIBLE_STATE_CLASS, value !== undefined && !value);
  },

  _dispose() {
    each(this._watchers, (_, watcher) => {
      watcher.dispose();
    });
  },

});
// @ts-expect-error
CollectionItem.getInstance = function ($element) {
  return getInstanceByElement($element, this);
};

export default CollectionItem;
