"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../../core/class"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _m_listEdit = require("./m_list.edit.decorator_registry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const editOptionsRegistry = [];
const registerOption = function (enabledFunc, decoratorTypeFunc, decoratorSubTypeFunc) {
  editOptionsRegistry.push({
    enabled: enabledFunc,
    decoratorType: decoratorTypeFunc,
    decoratorSubType: decoratorSubTypeFunc
  });
};
// NOTE: option registration order does matter
registerOption(function () {
  return this.option('menuItems').length;
}, () => 'menu', function () {
  return this.option('menuMode');
});
registerOption(function () {
  return !this.option('menuItems').length && this.option('allowItemDeleting');
}, function () {
  const mode = this.option('itemDeleteMode');
  return mode === 'toggle' || mode === 'slideButton' || mode === 'swipe' || mode === 'static' ? 'delete' : 'menu';
}, function () {
  let mode = this.option('itemDeleteMode');
  if (mode === 'slideItem') {
    mode = 'slide';
  }
  return mode;
});
registerOption(function () {
  return this.option('selectionMode') !== 'none' && this.option('showSelectionControls');
}, () => 'selection', () => 'default');
registerOption(function () {
  return this.option('itemDragging.allowReordering') || this.option('itemDragging.allowDropInsideItem') || this.option('itemDragging.group');
}, () => 'reorder', () => 'default');
const LIST_ITEM_BEFORE_BAG_CLASS = 'dx-list-item-before-bag';
const LIST_ITEM_AFTER_BAG_CLASS = 'dx-list-item-after-bag';
const DECORATOR_BEFORE_BAG_CREATE_METHOD = 'beforeBag';
const DECORATOR_AFTER_BAG_CREATE_METHOD = 'afterBag';
const DECORATOR_MODIFY_ELEMENT_METHOD = 'modifyElement';
const DECORATOR_AFTER_RENDER_METHOD = 'afterRender';
const DECORATOR_GET_EXCLUDED_SELECTORS_METHOD = 'getExcludedSelectors';
const EditProvider = _class.default.inherit({
  ctor(list) {
    this._list = list;
    this._fetchRequiredDecorators();
  },
  dispose() {
    if (this._decorators && this._decorators.length) {
      (0, _iterator.each)(this._decorators, (_, decorator) => {
        decorator.dispose();
      });
    }
  },
  _fetchRequiredDecorators() {
    this._decorators = [];
    (0, _iterator.each)(editOptionsRegistry, (_, option) => {
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
    var _registry$type;
    const foundDecorator = (_registry$type = _m_listEdit.registry[type]) === null || _registry$type === void 0 ? void 0 : _registry$type[subType];
    if (!foundDecorator) {
      throw _ui.default.Error('E1012', type, subType);
    }
    return foundDecorator;
  },
  modifyItemElement(args) {
    const $itemElement = (0, _renderer.default)(args.itemElement);
    const config = {
      $itemElement
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
    const $collector = (0, _renderer.default)('<div>');
    (0, _iterator.each)(this._decorators, function () {
      const $container = (0, _renderer.default)('<div>').addClass(containerClass);
      this[method]((0, _extend.extend)({
        $container
      }, config));
      if ($container.children().length) {
        $collector.append($container);
      }
    });
    return $collector.children();
  },
  _applyDecorators(method, config) {
    (0, _iterator.each)(this._decorators, function () {
      this[method](config);
    });
  },
  _handlerExists(name) {
    if (!this._decorators) {
      return false;
    }
    const decorators = this._decorators;
    const {
      length
    } = decorators;
    for (let i = 0; i < length; i++) {
      if (decorators[i][name] !== _common.noop) {
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
    const {
      length
    } = decorators;
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
  }
});
var _default = exports.default = EditProvider;