var $ = require('../../core/renderer'),
    EditDecoratorMenuHelperMixin = require('./ui.list.edit.decorator_menu_helper'),
    messageLocalization = require('../../localization/message'),
    registerDecorator = require('./ui.list.edit.decorator_registry').register,
    EditDecorator = require('./ui.list.edit.decorator'),
    Overlay = require('../overlay'),
    ListBase = require('./ui.list.base');

var CONTEXTMENU_CLASS = 'dx-list-context-menu',
    CONTEXTMENU_MENUCONTENT_CLASS = 'dx-list-context-menucontent';

registerDecorator(
    'menu',
    'context',
    EditDecorator.inherit({

        _init: function() {
            var $menu = $('<div>').addClass(CONTEXTMENU_CLASS);
            this._list.$element().append($menu);

            this._menu = this._renderOverlay($menu);
        },

        _renderOverlay: function($element) {
            return this._list._createComponent($element, Overlay, {
                shading: false,
                deferRendering: true,
                closeOnTargetScroll: true,
                closeOnOutsideClick: function(e) {
                    return !$(e.target).closest('.' + CONTEXTMENU_CLASS).length;
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
                            height: (function() { return this._$menuList.outerHeight(); }).bind(this),
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
                height: (function() { return this._$menuList ? this._$menuList.outerHeight() : 0; }).bind(this),
                width: (function() { return this._list.$element().outerWidth(); }).bind(this),
                onContentReady: this._renderMenuContent.bind(this)
            });
        },

        _renderMenuContent: function(e) {
            var $overlayContent = e.component.$content();

            var items = this._menuItems().slice();
            if(this._deleteEnabled()) {
                items.push({
                    text: messageLocalization.format('dxListEditDecorator-delete'),
                    action: this._deleteItem.bind(this)
                });
            }

            this._$menuList = $('<div>');
            this._list._createComponent(this._$menuList, ListBase, {
                items: items,
                onItemClick: this._menuItemClickHandler.bind(this),
                height: 'auto',
                integrationOptions: {}
            });

            $overlayContent.addClass(CONTEXTMENU_MENUCONTENT_CLASS);
            $overlayContent.append(this._$menuList);
        },

        _menuItemClickHandler: function(args) {
            this._menu.hide();
            this._fireMenuAction(this._$itemWithMenu, args.itemData.action);
        },

        _deleteItem: function() {
            this._list.deleteItem(this._$itemWithMenu);
        },

        handleContextMenu: function($itemElement) {
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

        dispose: function() {
            if(this._menu) {
                this._menu.$element().remove();
            }

            this.callBase.apply(this, arguments);
        }
    }).include(EditDecoratorMenuHelperMixin)
);
