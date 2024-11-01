import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import Overlay from '@js/ui/overlay/ui.overlay';

import { ListBase } from './m_list.base';
import EditDecorator from './m_list.edit.decorator';
import EditDecoratorMenuHelperMixin from './m_list.edit.decorator_menu_helper';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

const CONTEXTMENU_CLASS = 'dx-list-context-menu';
const CONTEXTMENU_MENUCONTENT_CLASS = 'dx-list-context-menucontent';

registerDecorator(
  'menu',
  'context',
  EditDecorator.inherit({

    _init() {
      const $menu = $('<div>').addClass(CONTEXTMENU_CLASS);
      this._list.$element().append($menu);

      this._menu = this._renderOverlay($menu);
    },

    _renderOverlay($element) {
      return this._list._createComponent($element, Overlay, {
        shading: false,
        deferRendering: true,
        hideOnParentScroll: true,
        hideOnOutsideClick(e) {
          return !$(e.target).closest(`.${CONTEXTMENU_CLASS}`).length;
        },
        animation: {
          show: {
            type: 'slide',
            duration: 300,
            from: {
              height: 0,
              opacity: 1,
            },
            to: {
              height: function () { return getOuterHeight(this._$menuList); }.bind(this),
              opacity: 1,
            },
          },
          hide: {
            type: 'slide',
            duration: 0,
            from: {
              opacity: 1,
            },
            to: {
              opacity: 0,
            },
          },
        },
        _ignoreFunctionValueDeprecation: true,
        height: function () { return this._$menuList ? getOuterHeight(this._$menuList) : 0; }.bind(this),
        width: function () { return getOuterWidth(this._list.$element()); }.bind(this),
        onContentReady: this._renderMenuContent.bind(this),
      });
    },

    _renderMenuContent(e) {
      const $overlayContent = e.component.$content();

      const items = this._menuItems().slice();
      if (this._deleteEnabled()) {
        items.push({
          text: messageLocalization.format('dxListEditDecorator-delete'),
          action: this._deleteItem.bind(this),
        });
      }

      this._$menuList = $('<div>');
      this._list._createComponent(this._$menuList, ListBase, {
        items,
        onItemClick: this._menuItemClickHandler.bind(this),
        height: 'auto',
        integrationOptions: {},
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
          collision: 'flip',
        },
      });
      this._menu.show();

      return true;
    },

    dispose() {
      if (this._menu) {
        this._menu.$element().remove();
      }

      this.callBase.apply(this, arguments);
    },
  }).include(EditDecoratorMenuHelperMixin),
);
