var $ = require('../../core/renderer'),
    eventsEngine = require('../../events/core/events_engine'),
    noop = require('../../core/utils/common').noop,
    clickEvent = require('../../events/click'),
    messageLocalization = require('../../localization/message'),
    translator = require('../../animation/translator'),
    eventUtils = require('../../events/utils'),
    feedbackEvents = require('../../events/core/emitter.feedback'),
    EditDecoratorMenuHelperMixin = require('./ui.list.edit.decorator_menu_helper'),
    registerDecorator = require('./ui.list.edit.decorator_registry').register,
    SwitchableEditDecorator = require('./ui.list.edit.decorator.switchable'),
    fx = require('../../animation/fx'),
    themes = require('../themes'),
    ActionSheet = require('../action_sheet');

var LIST_EDIT_DECORATOR = 'dxListEditDecorator',
    CLICK_EVENT_NAME = eventUtils.addNamespace(clickEvent.name, LIST_EDIT_DECORATOR),
    ACTIVE_EVENT_NAME = eventUtils.addNamespace(feedbackEvents.active, LIST_EDIT_DECORATOR),

    SLIDE_MENU_CLASS = 'dx-list-slide-menu',
    SLIDE_MENU_WRAPPER_CLASS = 'dx-list-slide-menu-wrapper',

    SLIDE_MENU_CONTENT_CLASS = 'dx-list-slide-menu-content',
    SLIDE_MENU_BUTTONS_CONTAINER_CLASS = 'dx-list-slide-menu-buttons-container',

    SLIDE_MENU_BUTTONS_CLASS = 'dx-list-slide-menu-buttons',
    SLIDE_MENU_BUTTON_CLASS = 'dx-list-slide-menu-button',

    SLIDE_MENU_BUTTON_MENU_CLASS = 'dx-list-slide-menu-button-menu',
    SLIDE_MENU_BUTTON_DELETE_CLASS = 'dx-list-slide-menu-button-delete',

    SLIDE_MENU_ANIMATION_DURATION = 400,
    SLIDE_MENU_ANIMATION_EASING = 'cubic-bezier(0.075, 0.82, 0.165, 1)';


registerDecorator(
    'menu',
    'slide',
    SwitchableEditDecorator.inherit({

        _shouldHandleSwipe: true,

        _init: function() {
            this.callBase.apply(this, arguments);

            this._$buttonsContainer = $('<div>').addClass(SLIDE_MENU_BUTTONS_CONTAINER_CLASS);
            eventsEngine.on(this._$buttonsContainer, ACTIVE_EVENT_NAME, noop);

            this._$buttons = $('<div>')
                .addClass(SLIDE_MENU_BUTTONS_CLASS)
                .appendTo(this._$buttonsContainer);

            this._renderMenu();
            this._renderDeleteButton();
        },

        _renderMenu: function() {
            if(!this._menuEnabled()) {
                return;
            }

            var menuItems = this._menuItems();

            if(menuItems.length === 1) {
                var menuItem = menuItems[0];

                this._renderMenuButton(menuItem.text, (function(e) {
                    e.stopPropagation();
                    this._fireAction(menuItem);
                }).bind(this));
            } else {
                var $menu = $('<div>').addClass(SLIDE_MENU_CLASS);
                this._menu = this._list._createComponent($menu, ActionSheet, {
                    showTitle: false,
                    items: menuItems,
                    onItemClick: (function(args) {
                        this._fireAction(args.itemData);
                    }).bind(this),
                    integrationOptions: {}
                });
                $menu.appendTo(this._list.$element());

                var $menuButton = this._renderMenuButton(messageLocalization.format('dxListEditDecorator-more'), (function(e) {
                    e.stopPropagation();
                    this._menu.show();
                }).bind(this));
                this._menu.option('target', $menuButton);
            }
        },

        _renderMenuButton: function(text, action) {
            var $menuButton = $('<div>')
                .addClass(SLIDE_MENU_BUTTON_CLASS)
                .addClass(SLIDE_MENU_BUTTON_MENU_CLASS)
                .text(text);

            this._$buttons.append($menuButton);
            eventsEngine.on($menuButton, CLICK_EVENT_NAME, action);

            return $menuButton;
        },

        _renderDeleteButton: function() {
            if(!this._deleteEnabled()) {
                return;
            }

            var $deleteButton = $('<div>')
                .addClass(SLIDE_MENU_BUTTON_CLASS)
                .addClass(SLIDE_MENU_BUTTON_DELETE_CLASS)
                .text(themes.isMaterial()
                    ? ''
                    : messageLocalization.format('dxListEditDecorator-delete'));

            eventsEngine.on($deleteButton, CLICK_EVENT_NAME, (function(e) {
                e.stopPropagation();
                this._deleteItem();
            }).bind(this));

            this._$buttons.append($deleteButton);
        },

        _fireAction: function(menuItem) {
            this._fireMenuAction($(this._cachedNode), menuItem.action);
            this._cancelDeleteReadyItem();
        },

        modifyElement: function(config) {
            this.callBase.apply(this, arguments);

            var $itemElement = config.$itemElement;

            $itemElement
                .addClass(SLIDE_MENU_WRAPPER_CLASS);

            var $slideMenuContent = $('<div>')
                .addClass(SLIDE_MENU_CONTENT_CLASS);

            $itemElement.wrapInner($slideMenuContent);
        },

        _getDeleteButtonContainer: function() {
            return this._$buttonsContainer;
        },

        handleClick: function(_, e) {
            if($(e.target).closest('.' + SLIDE_MENU_CONTENT_CLASS).length) {
                return this.callBase.apply(this, arguments);
            }
            return false;
        },

        _swipeStartHandler: function($itemElement) {
            this._enablePositioning($itemElement);
            this._cacheItemData($itemElement);
            this._setPositions(this._getPositions(0));
        },

        _swipeUpdateHandler: function($itemElement, args) {
            var rtl = this._isRtlEnabled(),
                signCorrection = rtl ? -1 : 1,
                isItemReadyToDelete = this._isReadyToDelete($itemElement),
                moveJustStarted = this._getCurrentPositions().content === this._getStartPositions().content;

            if(moveJustStarted && !isItemReadyToDelete && args.offset * signCorrection > 0) {
                args.cancel = true;
                return;
            }

            var offset = this._cachedItemWidth * args.offset,
                startOffset = isItemReadyToDelete ? -this._cachedButtonWidth * signCorrection : 0,
                correctedOffset = (offset + startOffset) * signCorrection,
                percent = correctedOffset < 0 ? Math.abs((offset + startOffset) / this._cachedButtonWidth) : 0;

            this._setPositions(this._getPositions(percent));
            return true;
        },

        _getStartPositions: function() {
            var rtl = this._isRtlEnabled(),
                signCorrection = rtl ? -1 : 1;

            return {
                content: 0,
                buttonsContainer: (rtl ? -this._cachedButtonWidth : this._cachedItemWidth),
                buttons: -this._cachedButtonWidth * signCorrection
            };
        },

        _getPositions: function(percent) {
            var rtl = this._isRtlEnabled(),
                signCorrection = rtl ? -1 : 1,
                startPositions = this._getStartPositions();

            return {
                content: startPositions.content - percent * this._cachedButtonWidth * signCorrection,
                buttonsContainer: startPositions.buttonsContainer - Math.min(percent, 1) * this._cachedButtonWidth * signCorrection,
                buttons: startPositions.buttons + Math.min(percent, 1) * this._cachedButtonWidth * signCorrection
            };
        },

        _getCurrentPositions: function() {
            return {
                content: translator.locate(this._$cachedContent).left,
                buttonsContainer: translator.locate(this._$buttonsContainer).left,
                buttons: translator.locate(this._$buttons).left
            };
        },

        _setPositions: function(positions) {
            translator.move(this._$cachedContent, { left: positions.content });
            translator.move(this._$buttonsContainer, { left: positions.buttonsContainer });
            translator.move(this._$buttons, { left: positions.buttons });
        },

        _cacheItemData: function($itemElement) {
            if($itemElement[0] === this._cachedNode) {
                return;
            }

            this._$cachedContent = $itemElement.find('.' + SLIDE_MENU_CONTENT_CLASS);
            this._cachedItemWidth = $itemElement.outerWidth();
            this._cachedButtonWidth = this._cachedButtonWidth || this._$buttons.outerWidth();
            this._$buttonsContainer.width(this._cachedButtonWidth);

            if(this._$cachedContent.length) {
                this._cachedNode = $itemElement[0];
            }
        },

        _minButtonContainerLeftOffset: function() {
            return this._cachedItemWidth - this._cachedButtonWidth;
        },

        _swipeEndHandler: function($itemElement, args) {
            this._cacheItemData($itemElement);

            var signCorrection = this._isRtlEnabled() ? 1 : -1,
                offset = this._cachedItemWidth * args.offset,
                endedAtReadyToDelete = !this._isReadyToDelete($itemElement) && (offset * signCorrection > this._cachedButtonWidth * 0.2),
                readyToDelete = args.targetOffset === signCorrection && endedAtReadyToDelete;

            this._toggleDeleteReady($itemElement, readyToDelete);
            return true;
        },

        _enablePositioning: function($itemElement) {
            fx.stop(this._$cachedContent, true);

            this.callBase.apply(this, arguments);

            this._$buttonsContainer.appendTo($itemElement);
        },

        _disablePositioning: function() {
            this.callBase.apply(this, arguments);

            this._$buttonsContainer.detach();
        },

        _animatePrepareDeleteReady: function() {
            return this._animateToPositions(this._getPositions(1));
        },

        _animateForgetDeleteReady: function($itemElement) {
            this._cacheItemData($itemElement);

            return this._animateToPositions(this._getPositions(0));
        },

        _animateToPositions: function(positions) {
            var that = this,

                currentPosition = this._getCurrentPositions(),
                durationTimePart = Math.min(Math.abs(currentPosition.content - positions.content) / this._cachedButtonWidth, 1);

            return fx.animate(this._$cachedContent, {
                from: currentPosition,
                to: positions,
                easing: SLIDE_MENU_ANIMATION_EASING,
                duration: SLIDE_MENU_ANIMATION_DURATION * durationTimePart,
                strategy: 'frame',
                draw: function(positions) {
                    that._setPositions(positions);
                }
            });
        },

        dispose: function() {
            if(this._menu) {
                this._menu.$element().remove();
            }
            if(this._$buttonsContainer) {
                this._$buttonsContainer.remove();
            }

            this.callBase.apply(this, arguments);
        }

    }).include(EditDecoratorMenuHelperMixin)
);
