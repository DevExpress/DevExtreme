import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import { noop } from '../../core/utils/common';
import { isObject, isRenderer, isWindow, isFunction, isPlainObject, isDefined } from '../../core/utils/type';
import { contains } from '../../core/utils/dom';
import { getPublicElement } from '../../core/element';
import { each } from '../../core/utils/iterator';
import { inArray } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';
import fx from '../../animation/fx';
import animationPosition from '../../animation/position';
import devices from '../../core/devices';
import { addNamespace } from '../../events/utils/index';
import Overlay from '../overlay';
import MenuBase from './ui.menu_base';
import { Deferred } from '../../core/utils/deferred';

// STYLE contextMenu

const DX_MENU_CLASS = 'dx-menu';
const DX_MENU_ITEM_CLASS = DX_MENU_CLASS + '-item';
const DX_MENU_ITEM_EXPANDED_CLASS = DX_MENU_ITEM_CLASS + '-expanded';
const DX_MENU_PHONE_CLASS = 'dx-menu-phone-overlay';
const DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + '-items-container';
const DX_MENU_ITEM_WRAPPER_CLASS = DX_MENU_ITEM_CLASS + '-wrapper';
const DX_SUBMENU_CLASS = 'dx-submenu';
const DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
const DX_HAS_CONTEXT_MENU_CLASS = 'dx-has-context-menu';
const DX_STATE_DISABLED_CLASS = 'dx-state-disabled';
const DX_STATE_FOCUSED_CLASS = 'dx-state-focused';
const DX_STATE_HOVER_CLASS = 'dx-state-hover';

const FOCUS_UP = 'up';
const FOCUS_DOWN = 'down';
const FOCUS_LEFT = 'left';
const FOCUS_RIGHT = 'right';
const FOCUS_FIRST = 'first';
const FOCUS_LAST = 'last';

const ACTIONS = [
    'onShowing', 'onShown', 'onSubmenuCreated',
    'onHiding', 'onHidden', 'onPositioning', 'onLeftFirstItem',
    'onLeftLastItem', 'onCloseRootSubmenu', 'onExpandLastSubmenu'
];
const LOCAL_SUBMENU_DIRECTIONS = [FOCUS_UP, FOCUS_DOWN, FOCUS_FIRST, FOCUS_LAST];
const DEFAULT_SHOW_EVENT = 'dxcontextmenu';

class ContextMenu extends MenuBase {
    getShowEvent(showEventOption) {
        let result = null;

        if(isObject(showEventOption)) {
            if(showEventOption.name !== null) {
                result = showEventOption.name || DEFAULT_SHOW_EVENT;
            }
        } else {
            result = showEventOption;
        }

        return result;
    }

    getShowDelay(showEventOption) {
        return isObject(showEventOption) && showEventOption.delay;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxContextMenuOptions.showEvent.name
            * @type string
            * @default undefined
            */
            /**
            * @name dxContextMenuOptions.showEvent.delay
            * @type number
            * @default undefined
            */
            showEvent: DEFAULT_SHOW_EVENT,

            closeOnOutsideClick: true,

            position: {
                at: 'top left',
                my: 'top left'
            },

            onShowing: null,

            onShown: null,

            onSubmenuCreated: null,

            onHiding: null,

            onHidden: null,

            onPositioning: null,

            submenuDirection: 'auto',

            visible: false,

            target: undefined,

            /**
             * @name dxContextMenuOptions.itemHoldAction
             * @hidden
             */

            /**
            * @name dxContextMenuOptions.onItemReordered
            * @hidden
            */

            /**
            * @name dxContextMenuOptions.selectedItems
            * @hidden
            */
            /**
            * @name dxContextMenuItem
            * @inherits dxMenuBaseItem
            * @type object
            */

            onLeftFirstItem: null,
            onLeftLastItem: null,
            onCloseRootSubmenu: null,
            onExpandLastSubmenu: null
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([{
            device: () => !hasWindow(),
            options: {
                animation: null
            }
        }]);
    }

    _initActions() {
        this._actions = {};

        each(ACTIONS, (index, action) => {
            this._actions[action] = this._createActionByOption(action) || noop;
        });
    }

    _setOptionsByReference() {
        super._setOptionsByReference();

        extend(this._optionsByReference, {
            animation: true,
            selectedItem: true
        });
    }

    _focusInHandler() {}

    _itemContainer() {
        return this._overlay ? this._overlay.$content() : $();
    }

    _eventBindingTarget() {
        return this._itemContainer();
    }

    itemsContainer() {
        return this._overlay ? this._overlay.$content() : undefined;
    }

    _supportedKeys() {
        const selectItem = () => {
            const $item = $(this.option('focusedElement'));

            this.hide();

            if(!$item.length || !this._isSelectionEnabled()) {
                return;
            }

            this.selectItem($item[0]);
        };
        return extend(super._supportedKeys(), {
            space: selectItem,
            escape: this.hide
        });
    }

    _getActiveItem() {
        const $availableItems = this._getAvailableItems();

        const $focusedItem = $availableItems.filter(`.${DX_STATE_FOCUSED_CLASS}`);
        const $hoveredItem = $availableItems.filter(`.${DX_STATE_HOVER_CLASS}`);
        const $hoveredItemContainer = $hoveredItem.closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);

        if($hoveredItemContainer.find(`.${DX_MENU_ITEM_CLASS}`).index($focusedItem) >= 0) {
            return $focusedItem;
        }

        if($hoveredItem.length) {
            return $hoveredItem;
        }

        return super._getActiveItem();
    }

    _moveFocus(location) {
        const $items = this._getItemsByLocation(location);
        const $oldTarget = this._getActiveItem(true);
        const $hoveredItem = this.itemsContainer().find(`.${DX_STATE_HOVER_CLASS}`);
        const $focusedItem = $(this.option('focusedElement'));
        const $activeItemHighlighted = !!($focusedItem.length || $hoveredItem.length);
        let $newTarget;

        switch(location) {
            case FOCUS_UP:
                $newTarget = $activeItemHighlighted ? this._prevItem($items) : $oldTarget;
                this._setFocusedElement($newTarget);
                if($oldTarget.is($items.first())) {
                    this._actions.onLeftFirstItem($oldTarget);
                }
                break;
            case FOCUS_DOWN:
                $newTarget = $activeItemHighlighted ? this._nextItem($items) : $oldTarget;
                this._setFocusedElement($newTarget);
                if($oldTarget.is($items.last())) {
                    this._actions.onLeftLastItem($oldTarget);
                }
                break;
            case FOCUS_RIGHT:
                $newTarget = this.option('rtlEnabled') ? this._hideSubmenuHandler() : this._expandSubmenuHandler($items, location);
                this._setFocusedElement($newTarget);
                break;
            case FOCUS_LEFT:
                $newTarget = this.option('rtlEnabled') ? this._expandSubmenuHandler($items, location) : this._hideSubmenuHandler();
                this._setFocusedElement($newTarget);
                break;
            case FOCUS_FIRST:
                $newTarget = $items.first();
                this._setFocusedElement($newTarget);
                break;
            case FOCUS_LAST:
                $newTarget = $items.last();
                this._setFocusedElement($newTarget);
                break;
            default:
                return super._moveFocus(location);
        }
    }

    _setFocusedElement($element) {
        if($element && $element.length !== 0) {
            this.option('focusedElement', getPublicElement($element));
        }
    }

    _getItemsByLocation(location) {
        const $activeItem = this._getActiveItem(true);
        let $items;

        if(inArray(location, LOCAL_SUBMENU_DIRECTIONS) >= 0) {
            $items = $activeItem
                .closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`)
                .children()
                .children();
        }

        $items = this._getAvailableItems($items);

        return $items;
    }

    _getAriaTarget() {
        return this.$element();
    }

    _refreshActiveDescendant() {
        if(isDefined(this._overlay)) {
            const $target = this._overlay.$content();
            super._refreshActiveDescendant($target);
        }
    }

    _hideSubmenuHandler() {
        const $curItem = this._getActiveItem(true);
        const $parentItem = $curItem.parents(`.${DX_MENU_ITEM_EXPANDED_CLASS}`).first();

        if($parentItem.length) {
            this._hideSubmenusOnSameLevel($parentItem);
            this._hideSubmenu($curItem.closest(`.${DX_SUBMENU_CLASS}`));
            return $parentItem;
        }

        this._actions.onCloseRootSubmenu($curItem);
        return $curItem;
    }

    _expandSubmenuHandler($items, location) {
        const $curItem = this._getActiveItem(true);
        const itemData = this._getItemData($curItem);
        const node = this._dataAdapter.getNodeByItem(itemData);
        const isItemHasSubmenu = this._hasSubmenu(node);
        const $submenu = $curItem.children(`.${DX_SUBMENU_CLASS}`);

        if(isItemHasSubmenu && !$curItem.hasClass(DX_STATE_DISABLED_CLASS)) {
            if(!$submenu.length || $submenu.css('visibility') === 'hidden') {
                this._showSubmenu($curItem);
            }

            return this._nextItem(this._getItemsByLocation(location));
        }

        this._actions.onExpandLastSubmenu($curItem);
        return undefined;
    }

    _clean() {
        if(this._overlay) {
            this._overlay.$element().remove();
            this._overlay = null;
        }
        this._detachShowContextMenuEvents(this._getTarget());
        super._clean();
    }

    _initMarkup() {
        this.$element()
            .addClass(DX_HAS_CONTEXT_MENU_CLASS);

        super._initMarkup();
    }

    _render() {
        super._render();
        this._renderVisibility(this.option('visible'));
        this._addWidgetClass();
    }

    _renderContentImpl() {
        this._detachShowContextMenuEvents(this._getTarget());
        this._attachShowContextMenuEvents();
    }

    _attachKeyboardEvents() {
        !this._keyboardListenerId && this._focusTarget().length && super._attachKeyboardEvents();
    }

    _renderContextMenuOverlay() {
        if(this._overlay) {
            return;
        }

        const overlayOptions = this._getOverlayOptions();

        this._overlay = this._createComponent($('<div>').appendTo(this._$element), Overlay, overlayOptions);

        const $overlayContent = this._overlay.$content();
        $overlayContent.addClass(DX_CONTEXT_MENU_CLASS);

        this._addCustomCssClass($overlayContent);
        this._addPlatformDependentClass($overlayContent);
        this._attachContextMenuEvent();
    }

    _itemContextMenuHandler(e) {
        super._itemContextMenuHandler(e);
        e.stopPropagation();
    }

    _addPlatformDependentClass($element) {
        if(devices.current().phone) {
            $element.addClass(DX_MENU_PHONE_CLASS);
        }
    }

    _detachShowContextMenuEvents(target) {
        const showEvent = this.getShowEvent(this.option('showEvent'));

        if(!showEvent) {
            return;
        }

        const eventName = addNamespace(showEvent, this.NAME);

        if(this._showContextMenuEventHandler) {
            eventsEngine.off(domAdapter.getDocument(), eventName, target, this._showContextMenuEventHandler);
        } else {
            eventsEngine.off($(target), eventName);
        }
    }

    _attachShowContextMenuEvents() {
        const target = this._getTarget();
        const showEvent = this.getShowEvent(this.option('showEvent'));

        if(!showEvent) {
            return;
        }

        const eventName = addNamespace(showEvent, this.NAME);
        let contextMenuAction = this._createAction((e) => {
            const delay = this.getShowDelay(this.option('showEvent'));

            if(delay) {
                setTimeout(() => this._show(e.event), delay);
            } else {
                this._show(e.event);
            }
        }, { validatingTargetName: 'target' });

        const handler = e => contextMenuAction({ event: e, target: $(e.currentTarget) });

        contextMenuAction = this._createAction(contextMenuAction);

        if(isRenderer(target) || target.nodeType || isWindow(target)) {
            this._showContextMenuEventHandler = undefined;
            eventsEngine.on(target, eventName, handler);
        } else {
            this._showContextMenuEventHandler = handler;
            eventsEngine.on(domAdapter.getDocument(), eventName, target, this._showContextMenuEventHandler);
        }
    }

    _hoverEndHandler(e) {
        super._hoverEndHandler(e);
        e.stopPropagation();
    }

    _renderDimensions() {}

    _renderContainer($wrapper, submenuContainer) {
        const $holder = submenuContainer || this._itemContainer();

        $wrapper = $('<div>');

        $wrapper
            .appendTo($holder)
            .addClass(DX_SUBMENU_CLASS)
            .css('visibility', submenuContainer ? 'hidden' : 'visible');

        const $itemsContainer = super._renderContainer($wrapper);

        if(submenuContainer) {
            return $itemsContainer;
        }

        if(this.option('width')) {
            return $itemsContainer.css('minWidth', this.option('width'));
        }
        if(this.option('height')) {
            return $itemsContainer.css('minHeight', this.option('height'));
        }

        return $itemsContainer;
    }

    _renderSubmenuItems(node, $itemFrame) {
        this._renderItems(this._getChildNodes(node), $itemFrame);
        this._actions.onSubmenuCreated({
            itemElement: getPublicElement($itemFrame),
            itemData: node.internalFields.item,
            submenuElement: getPublicElement($itemFrame.children(`.${DX_SUBMENU_CLASS}`))
        });
    }

    _getOverlayOptions() {
        const position = this.option('position');

        const overlayOptions = {
            focusStateEnabled: this.option('focusStateEnabled'),
            animation: this.option('animation'),
            innerOverlay: true,
            closeOnOutsideClick: this._closeOnOutsideClickHandler.bind(this),
            propagateOutsideClick: true,
            closeOnTargetScroll: true,
            deferRendering: false,
            position: {
                at: position.at,
                my: position.my,
                of: this._getTarget(),
                collision: 'flipfit'
            },
            shading: false,
            showTitle: false,
            height: 'auto',
            width: 'auto',
            onShown: this._overlayShownActionHandler.bind(this),
            onHiding: this._overlayHidingActionHandler.bind(this),
            onHidden: this._overlayHiddenActionHandler.bind(this)
        };

        return overlayOptions;
    }

    _overlayShownActionHandler(arg) {
        this._actions.onShown(arg);
    }

    _overlayHidingActionHandler(arg) {
        this._actions.onHiding(arg);
        if(!arg.cancel) {
            this._hideAllShownSubmenus();
            this._setOptionWithoutOptionChange('visible', false);
        }
    }

    _overlayHiddenActionHandler(arg) {
        this._actions.onHidden(arg);
    }

    _closeOnOutsideClickHandler(e) {
        const closeOnOutsideClick = this.option('closeOnOutsideClick');

        if(isFunction(closeOnOutsideClick)) {
            return closeOnOutsideClick(e);
        }

        if(!closeOnOutsideClick) {
            return false;
        }

        if(domAdapter.isDocument(e.target)) {
            return true;
        }

        const $activeItemContainer = this._getActiveItemsContainer(e.target);
        const $itemContainers = this._getItemsContainers();
        const $clickedItem = this._searchActiveItem(e.target);
        const $rootItem = this.$element().parents(`.${DX_MENU_ITEM_CLASS}`);
        const isRootItemClicked = $clickedItem[0] === $rootItem[0] && $clickedItem.length && $rootItem.length;
        const isInnerOverlayClicked = this._isIncludeOverlay($activeItemContainer, $itemContainers) && $clickedItem.length;

        if(isInnerOverlayClicked || isRootItemClicked) {
            if(this._getShowSubmenuMode() === 'onClick') {
                this._hideAllShownChildSubmenus($clickedItem);
            }
            return false;
        }
        return true;
    }

    _getActiveItemsContainer(target) {
        return $(target).closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
    }

    _getItemsContainers() {
        return this._overlay._$content.find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
    }

    _searchActiveItem(target) {
        return $(target).closest(`.${DX_MENU_ITEM_CLASS}`).eq(0);
    }

    _isIncludeOverlay($activeOverlay, $allOverlays) {
        let isSame = false;

        each($allOverlays, (index, $overlay) => {
            if($activeOverlay.is($overlay) && !isSame) {
                isSame = true;
            }
        });

        return isSame;
    }

    _hideAllShownChildSubmenus($clickedItem) {
        const $submenuElements = $clickedItem.find(`.${DX_SUBMENU_CLASS}`);
        const shownSubmenus = extend([], this._shownSubmenus);

        if($submenuElements.length > 0) {
            each(shownSubmenus, (index, $submenu) => {
                const $context = this._searchActiveItem($submenu.context).parent();
                if($context.parent().is($clickedItem.parent().parent()) && !$context.is($clickedItem.parent())) {
                    this._hideSubmenu($submenu);
                }
            });
        }
    }

    _showSubmenu($item) {
        const node = this._dataAdapter.getNodeByItem(this._getItemData($item));

        this._hideSubmenusOnSameLevel($item);

        if(!this._hasSubmenu(node)) return;

        const $submenu = $item.children(`.${DX_SUBMENU_CLASS}`);
        const isSubmenuRendered = $submenu.length;

        super._showSubmenu($item);

        if(!isSubmenuRendered) {
            this._renderSubmenuItems(node, $item);
        }

        if(!this._isSubmenuVisible($submenu)) {
            this._drawSubmenu($item);
        }
    }

    _hideSubmenusOnSameLevel($item) {
        const $expandedItems = $item
            .parent(`.${DX_MENU_ITEM_WRAPPER_CLASS}`).siblings()
            .find(`.${DX_MENU_ITEM_EXPANDED_CLASS}`);

        if($expandedItems.length) {
            $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
            this._hideSubmenu($expandedItems.find(`.${DX_SUBMENU_CLASS}`));
        }
    }

    _hideSubmenuGroup($submenu) {
        if(this._isSubmenuVisible($submenu)) {
            this._hideSubmenuCore($submenu);
        }
    }

    _isSubmenuVisible($submenu) {
        return $submenu.css('visibility') === 'visible';
    }

    _drawSubmenu($itemElement) {
        const animation = this.option('animation') ? this.option('animation').show : {};
        const $submenu = $itemElement.children(`.${DX_SUBMENU_CLASS}`);
        const submenuPosition = this._getSubmenuPosition($itemElement);

        if(this._overlay && this._overlay.option('visible')) {
            if(!isDefined(this._shownSubmenus)) {
                this._shownSubmenus = [];
            }

            if(inArray($submenu, this._shownSubmenus)) {
                this._shownSubmenus.push($submenu);
            }

            if(animation) {
                fx.stop($submenu);
            }

            animationPosition.setup($submenu, submenuPosition);

            if(animation) {
                if(isPlainObject(animation.to)) {
                    animation.to.position = submenuPosition;
                }
                this._animate($submenu, animation);
            }
            $submenu.css('visibility', 'visible');
        }
    }

    _animate($container, options) {
        fx.animate($container, options);
    }

    _getSubmenuPosition($rootItem) {
        const submenuDirection = this.option('submenuDirection').toLowerCase();
        const $rootItemWrapper = $rootItem.parent(`.${DX_MENU_ITEM_WRAPPER_CLASS}`);
        const position = {
            collision: 'flip',
            of: $rootItemWrapper,
            offset: { h: 0, v: -1 }
        };

        switch(submenuDirection) {
            case 'left':
                position.at = 'left top';
                position.my = 'right top';
                break;
            case 'right':
                position.at = 'right top';
                position.my = 'left top';
                break;
            default:
                if(this.option('rtlEnabled')) {
                    position.at = 'left top';
                    position.my = 'right top';
                } else {
                    position.at = 'right top';
                    position.my = 'left top';
                }
                break;
        }

        return position;
    }

    // TODO: try to simplify it
    _updateSubmenuVisibilityOnClick(actionArgs) {
        if(!actionArgs.args.length) return;

        const itemData = actionArgs.args[0].itemData;
        const node = this._dataAdapter.getNodeByItem(itemData);

        if(!node) return;

        const $itemElement = $(actionArgs.args[0].itemElement);
        let $submenu = $itemElement.find(`.${DX_SUBMENU_CLASS}`);
        const shouldRenderSubmenu = this._hasSubmenu(node) && !$submenu.length;

        if(shouldRenderSubmenu) {
            this._renderSubmenuItems(node, $itemElement);
            $submenu = $itemElement.find(`.${DX_SUBMENU_CLASS}`);
        }

        if($itemElement.context === $submenu.context && $submenu.css('visibility') === 'visible') {
            return;
        }

        // T238943. Give the workaround with e.cancel and remove this hack
        const notCloseMenuOnItemClick = itemData && itemData.closeMenuOnClick === false;
        if(!itemData || itemData.disabled || notCloseMenuOnItemClick) {
            return;
        }

        this._updateSelectedItemOnClick(actionArgs);

        if($submenu.length === 0) {
            const $prevSubmenu = $($itemElement.parents(`.${DX_SUBMENU_CLASS}`)[0]);
            this._hideSubmenu($prevSubmenu);
            if(!actionArgs.canceled && this._overlay && this._overlay.option('visible')) {
                this.option('visible', false);
            }
        } else {
            if(this._shownSubmenus && this._shownSubmenus.length > 0) {
                if(this._shownSubmenus[0].is($submenu)) {
                    this._hideSubmenu($submenu); // close to parent?
                }
            }
            this._showSubmenu($itemElement);
        }

    }

    _hideSubmenu($curSubmenu) {
        const shownSubmenus = extend([], this._shownSubmenus);

        each(shownSubmenus, (index, $submenu) => {
            if($curSubmenu.is($submenu) || contains($curSubmenu[0], $submenu[0])) {
                $submenu.parent().removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
                this._hideSubmenuCore($submenu);
            }
        });
    }

    _hideSubmenuCore($submenu) {
        const index = inArray($submenu, this._shownSubmenus);
        const animation = this.option('animation') ? this.option('animation').hide : null;

        if(index >= 0) {
            this._shownSubmenus.splice(index, 1);
        }

        this._stopAnimate($submenu);
        animation && this._animate($submenu, animation);
        $submenu.css('visibility', 'hidden');
    }

    _stopAnimate($container) {
        fx.stop($container, true);
    }

    _hideAllShownSubmenus() {
        const shownSubmenus = extend([], this._shownSubmenus);
        const $expandedItems = this._overlay.$content().find(`.${DX_MENU_ITEM_EXPANDED_CLASS}`);

        $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);

        each(shownSubmenus, (_, $submenu) => {
            this._hideSubmenu($submenu);
        });
    }

    _visibilityChanged(visible) {
        if(visible) {
            this._renderContentImpl();
        }
    }

    _optionChanged(args) {
        if(inArray(args.name, ACTIONS) > -1) {
            this._initActions();
            return;
        }

        switch(args.name) {
            case 'visible':
                this._renderVisibility(args.value);
                break;
            case 'showEvent':
            case 'position':
            case 'submenuDirection':
                this._invalidate();
                break;
            case 'target':
                args.previousValue && this._detachShowContextMenuEvents(args.previousValue);
                this._invalidate();
                break;
            case 'closeOnOutsideClick':
                break;
            default:
                super._optionChanged(args);
        }
    }

    _renderVisibility(showing) {
        return showing ? this._show() : this._hide();
    }

    _toggleVisibility() {}

    _show(event) {
        const args = { jQEvent: event };
        let promise = new Deferred().reject().promise();

        this._actions.onShowing(args);

        if(args.cancel) {
            return promise;
        }

        const position = this._positionContextMenu(event);

        if(position) {
            if(!this._overlay) {
                this._renderContextMenuOverlay();
                this._overlay.$content().addClass(this._widgetClass());
                this._renderFocusState();
                this._attachHoverEvents();
                this._attachClickEvent();
                this._renderItems(this._dataAdapter.getRootNodes());
            }

            this._setOptionWithoutOptionChange('visible', true);
            this._overlay.option('position', position);
            promise = this._overlay.show();
            event && event.stopPropagation();

            this._setAriaAttributes();
        }

        return promise;
    }

    _setAriaAttributes() {
        this._overlayContentId = `dx-${new Guid()}`;

        this.setAria('owns', this._overlayContentId);
        this.setAria({ 'id': this._overlayContentId, 'role': 'menu' }, this._overlay.$content());
    }

    _cleanAriaAttributes() {
        this._overlay && this.setAria('id', null, this._overlay.$content());
        this.setAria('owns', undefined);
    }

    _getTarget() {
        return this.option('target') || this.option('position').of || $(domAdapter.getDocument());
    }

    _getContextMenuPosition() {
        return extend({}, this.option('position'), { of: this._getTarget() });
    }

    _positionContextMenu(jQEvent) {
        let position = this._getContextMenuPosition();
        const isInitialPosition = this._isInitialOptionValue('position');
        const positioningAction = this._createActionByOption('onPositioning', actionArgs);

        if(jQEvent && jQEvent.preventDefault && isInitialPosition) {
            position.of = jQEvent;
        }

        const actionArgs = {
            position: position,
            event: jQEvent
        };

        positioningAction(actionArgs);

        if(actionArgs.cancel) {
            position = null;
        } else {
            if(actionArgs.event) {
                actionArgs.event.cancel = true;
                jQEvent.preventDefault();
            }
        }

        return position;
    }

    _refresh() {
        if(!hasWindow()) {
            super._refresh();
        } else {
            if(this._overlay) {
                const lastPosition = this._overlay.option('position');
                super._refresh();
                this._overlay && this._overlay.option('position', lastPosition);
            } else {
                super._refresh();
            }
        }
    }

    _hide() {
        let promise;

        if(this._overlay) {
            promise = this._overlay.hide();
            this._setOptionWithoutOptionChange('visible', false);
        }

        this._cleanAriaAttributes();
        this.option('focusedElement', null);

        return promise || new Deferred().reject().promise();
    }

    toggle(showing) {
        const visible = this.option('visible');

        showing = showing === undefined ? !visible : showing;

        return this._renderVisibility(showing);
    }

    show() {
        return this.toggle(true);
    }

    hide() {
        return this.toggle(false);
    }
}

registerComponent('dxContextMenu', ContextMenu);

export default ContextMenu;
