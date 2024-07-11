"use strict";

var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _size = require("../../../core/utils/size");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _m_list = require("./m_list.base");
var _m_listEdit = _interopRequireDefault(require("./m_list.edit.decorator"));
var _m_listEdit2 = _interopRequireDefault(require("./m_list.edit.decorator_menu_helper"));
var _m_listEdit3 = require("./m_list.edit.decorator_registry");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CONTEXTMENU_CLASS = 'dx-list-context-menu';
const CONTEXTMENU_MENUCONTENT_CLASS = 'dx-list-context-menucontent';
(0, _m_listEdit3.register)('menu', 'context', _m_listEdit.default.inherit({
  _init() {
    const $menu = (0, _renderer.default)('<div>').addClass(CONTEXTMENU_CLASS);
    this._list.$element().append($menu);
    this._menu = this._renderOverlay($menu);
  },
  _renderOverlay($element) {
    return this._list._createComponent($element, _ui.default, {
      shading: false,
      deferRendering: true,
      hideOnParentScroll: true,
      hideOnOutsideClick(e) {
        return !(0, _renderer.default)(e.target).closest(`.${CONTEXTMENU_CLASS}`).length;
      },
      animation: {
        show: {
          type: 'slide',
          duration: 300,
          from: {
            height: 0,
            opacity: 1
          },
          to: {
            height: function () {
              return (0, _size.getOuterHeight)(this._$menuList);
            }.bind(this),
            opacity: 1
          }
        },
        hide: {
          type: 'slide',
          duration: 0,
          from: {
            opacity: 1
          },
          to: {
            opacity: 0
          }
        }
      },
      _ignoreFunctionValueDeprecation: true,
      height: function () {
        return this._$menuList ? (0, _size.getOuterHeight)(this._$menuList) : 0;
      }.bind(this),
      width: function () {
        return (0, _size.getOuterWidth)(this._list.$element());
      }.bind(this),
      onContentReady: this._renderMenuContent.bind(this)
    });
  },
  _renderMenuContent(e) {
    const $overlayContent = e.component.$content();
    const items = this._menuItems().slice();
    if (this._deleteEnabled()) {
      items.push({
        text: _message.default.format('dxListEditDecorator-delete'),
        action: this._deleteItem.bind(this)
      });
    }
    this._$menuList = (0, _renderer.default)('<div>');
    this._list._createComponent(this._$menuList, _m_list.ListBase, {
      items,
      onItemClick: this._menuItemClickHandler.bind(this),
      height: 'auto',
      integrationOptions: {}
    });
    $overlayContent.addClass(CONTEXTMENU_MENUCONTENT_CLASS);
    $overlayContent.append(this._$menuList);
  },
  _menuItemClickHandler(args) {
    this._menu.hide();
    this._fireMenuAction(this._$itemWithMenu, args.itemData.action);
  },
  _deleteItem() {
    this._list.deleteItem(this._$itemWithMenu);
  },
  handleContextMenu($itemElement) {
    this._$itemWithMenu = $itemElement;
    this._menu.option({
      position: {
        my: 'top',
        at: 'bottom',
        of: $itemElement,
        collision: 'flip'
      }
    });
    this._menu.show();
    return true;
  },
  dispose() {
    if (this._menu) {
      this._menu.$element().remove();
    }
    this.callBase.apply(this, arguments);
  }
}).include(_m_listEdit2.default));