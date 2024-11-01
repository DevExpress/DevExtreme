import Class from '@js/core/class';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import errors from '@js/ui/widget/ui.errors';

import { registry } from './m_list.edit.decorator_registry';

const editOptionsRegistry: {
  enabled: any;
  decoratorType: any;
  decoratorSubType: any;
}[] = [];

const registerOption = function (enabledFunc, decoratorTypeFunc, decoratorSubTypeFunc) {
  editOptionsRegistry.push({
    enabled: enabledFunc,
    decoratorType: decoratorTypeFunc,
    decoratorSubType: decoratorSubTypeFunc,
  });
};

// NOTE: option registration order does matter
registerOption(
  function () {
    return this.option('menuItems').length;
  },
  () => 'menu',
  function () {
    return this.option('menuMode');
  },
);
registerOption(
  function () {
    return !this.option('menuItems').length && this.option('allowItemDeleting');
  },
  function () {
    const mode = this.option('itemDeleteMode');

    return mode === 'toggle' || mode === 'slideButton' || mode === 'swipe' || mode === 'static' ? 'delete' : 'menu';
  },
  function () {
    let mode = this.option('itemDeleteMode');

    if (mode === 'slideItem') {
      mode = 'slide';
    }

    return mode;
  },
);
registerOption(
  function () {
    return this.option('selectionMode') !== 'none' && this.option('showSelectionControls');
  },
  () => 'selection',
  () => 'default',
);
registerOption(
  function () {
    return this.option('itemDragging.allowReordering') || this.option('itemDragging.allowDropInsideItem') || this.option('itemDragging.group');
  },
  () => 'reorder',
  () => 'default',
);

const LIST_ITEM_BEFORE_BAG_CLASS = 'dx-list-item-before-bag';
const LIST_ITEM_AFTER_BAG_CLASS = 'dx-list-item-after-bag';

const DECORATOR_BEFORE_BAG_CREATE_METHOD = 'beforeBag';
const DECORATOR_AFTER_BAG_CREATE_METHOD = 'afterBag';
const DECORATOR_MODIFY_ELEMENT_METHOD = 'modifyElement';
const DECORATOR_AFTER_RENDER_METHOD = 'afterRender';
const DECORATOR_GET_EXCLUDED_SELECTORS_METHOD = 'getExcludedSelectors';

const EditProvider = Class.inherit({

  ctor(list) {
    this._list = list;
    this._fetchRequiredDecorators();
  },

  dispose() {
    if (this._decorators && this._decorators.length) {
      each(this._decorators, (_, decorator) => {
        decorator.dispose();
      });
    }
  },

  _fetchRequiredDecorators() {
    this._decorators = [];

    each(editOptionsRegistry, (_, option) => {
      const optionEnabled = option.enabled.call(this._list);
      if (optionEnabled) {
        const decoratorType = option.decoratorType.call(this._list);
        const decoratorSubType = option.decoratorSubType.call(this._list);

        const decorator = this._createDecorator(decoratorType, decoratorSubType);

        this._decorators.push(decorator);
      }
    });
  },

  _createDecorator(type, subType) {
    const decoratorClass = this._findDecorator(type, subType);
    // eslint-disable-next-line new-cap
    return new decoratorClass(this._list);
  },

  _findDecorator(type, subType) {
    const foundDecorator = registry[type]?.[subType];

    if (!foundDecorator) {
      throw errors.Error('E1012', type, subType);
    }

    return foundDecorator;
  },

  modifyItemElement(args) {
    const $itemElement = $(args.itemElement);

    const config = {
      $itemElement,
    };

    this._prependBeforeBags($itemElement, config);
    this._appendAfterBags($itemElement, config);
    this._applyDecorators(DECORATOR_MODIFY_ELEMENT_METHOD, config);
  },

  afterItemsRendered() {
    this._applyDecorators(DECORATOR_AFTER_RENDER_METHOD);
  },

  _prependBeforeBags($itemElement, config) {
    const $beforeBags = this._collectDecoratorsMarkup(DECORATOR_BEFORE_BAG_CREATE_METHOD, config, LIST_ITEM_BEFORE_BAG_CLASS);
    $itemElement.prepend($beforeBags);
  },

  _appendAfterBags($itemElement, config) {
    const $afterBags = this._collectDecoratorsMarkup(DECORATOR_AFTER_BAG_CREATE_METHOD, config, LIST_ITEM_AFTER_BAG_CLASS);
    $itemElement.append($afterBags);
  },

  _collectDecoratorsMarkup(method, config, containerClass) {
    const $collector = $('<div>');

    each(this._decorators, function () {
      const $container = $('<div>').addClass(containerClass);
      this[method](extend({
        $container,
      }, config));
      if ($container.children().length) {
        $collector.append($container);
      }
    });

    return $collector.children();
  },

  _applyDecorators(method, config) {
    each(this._decorators, function () {
      this[method](config);
    });
  },

  _handlerExists(name) {
    if (!this._decorators) {
      return false;
    }

    const decorators = this._decorators;
    const { length } = decorators;
    for (let i = 0; i < length; i++) {
      if (decorators[i][name] !== noop) {
        return true;
      }
    }

    return false;
  },

  _eventHandler(name, $itemElement, e) {
    if (!this._decorators) {
      return false;
    }

    let response = false;
    const decorators = this._decorators;
    const { length } = decorators;
    for (let i = 0; i < length; i++) {
      response = decorators[i][name]($itemElement, e);
      if (response) {
        break;
      }
    }

    return response;
  },

  handleClick($itemElement, e) {
    return this._eventHandler('handleClick', $itemElement, e);
  },

  handleKeyboardEvents(currentFocusedIndex, moveFocusUp) {
    return this._eventHandler('handleKeyboardEvents', currentFocusedIndex, moveFocusUp);
  },

  handleEnterPressing(e) {
    return this._eventHandler('handleEnterPressing', e);
  },

  contextMenuHandlerExists() {
    return this._handlerExists('handleContextMenu');
  },

  handleContextMenu($itemElement, e) {
    return this._eventHandler('handleContextMenu', $itemElement, e);
  },

  getExcludedItemSelectors() {
    const excludedSelectors = [];

    this._applyDecorators(DECORATOR_GET_EXCLUDED_SELECTORS_METHOD, excludedSelectors);

    return excludedSelectors.join(',');
  },
});

export default EditProvider;
