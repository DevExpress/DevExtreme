import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { getWindow } from '../core/utils/window';
const window = getWindow();
import { nativeScrolling } from '../core/utils/support';
import { noop } from '../core/utils/common';
import { getPublicElement } from '../core/element';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import { render } from './widget/utils.ink_ripple';
import messageLocalization from '../localization/message';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import { addNamespace } from '../events/utils/index';
import DropDownList from './drop_down_editor/ui.drop_down_list';
import { current, isMaterial } from './themes';
import { name as clickEventName } from '../events/click';
import Popover from './popover';
import TextBox from './text_box';
import { ChildDefaultTemplate } from '../core/templates/child_default_template';
import { locate, move, resetPosition } from '../animation/translator';
import { isDefined } from '../core/utils/type';
import { getElementWidth } from './drop_down_editor/utils';

// STYLE lookup

const LOOKUP_CLASS = 'dx-lookup';
const LOOKUP_SEARCH_CLASS = 'dx-lookup-search';
const LOOKUP_SEARCH_WRAPPER_CLASS = 'dx-lookup-search-wrapper';
const LOOKUP_FIELD_CLASS = 'dx-lookup-field';
const LOOKUP_ARROW_CLASS = 'dx-lookup-arrow';
const LOOKUP_FIELD_WRAPPER_CLASS = 'dx-lookup-field-wrapper';
const LOOKUP_POPUP_CLASS = 'dx-lookup-popup';
const LOOKUP_POPUP_WRAPPER_CLASS = 'dx-lookup-popup-wrapper';
const LOOKUP_POPUP_SEARCH_CLASS = 'dx-lookup-popup-search';
const LOOKUP_POPOVER_MODE = 'dx-lookup-popover-mode';
const LOOKUP_EMPTY_CLASS = 'dx-lookup-empty';
const LOOKUP_POPOVER_FLIP_VERTICAL_CLASS = 'dx-popover-flipped-vertical';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const GROUP_LIST_HEADER_CLASS = 'dx-list-group-header';

const MATERIAL_LOOKUP_LIST_ITEMS_COUNT = 5;
const MATERIAL_LOOKUP_LIST_PADDING = 8;


const Lookup = DropDownList.inherit({
    _supportedKeys: function() {
        return extend(this.callBase(), {
            space: function(e) {
                e.preventDefault();
                this._validatedOpening();
            },
            enter: function() {
                this._validatedOpening();
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            placeholder: messageLocalization.format('Select'),

            searchPlaceholder: messageLocalization.format('Search'),

            searchEnabled: true,

            cleanSearchOnOpening: true,

            showCancelButton: true,


            showClearButton: false,

            clearButtonText: messageLocalization.format('Clear'),

            applyButtonText: messageLocalization.format('OK'),

            pullRefreshEnabled: false,

            useNativeScrolling: true,

            pullingDownText: messageLocalization.format('dxList-pullingDownText'),

            pulledDownText: messageLocalization.format('dxList-pulledDownText'),

            refreshingText: messageLocalization.format('dxList-refreshingText'),

            pageLoadingText: messageLocalization.format('dxList-pageLoadingText'),

            onScroll: null,

            onPullRefresh: null,

            onPageLoading: null,

            pageLoadMode: 'scrollBottom',

            nextButtonText: messageLocalization.format('dxList-nextButtonText'),

            grouped: false,

            groupTemplate: 'group',

            usePopover: false,

            /**
             * @name dxLookupOptions.dropDownButtonTemplate
             * @hidden
             */

            /**
             * @name dxLookupOptions.openOnFieldClick
             * @hidden
             */

            /**
             * @name dxLookupOptions.showDropDownButton
             * @hidden
             */
            showDropDownButton: false,


            focusStateEnabled: false,

            animation: {
                /**
                * @name dxLookupOptions.animation.show
                * @type animationConfig
                * @default undefined
                */
                /**
                * @name dxLookupOptions.animation.hide
                * @type animationConfig
                * @default undefined
                */
            },

            dropDownOptions: {
                showTitle: true,

                width: function() { return $(window).width() * 0.8; },

                height: function() { return $(window).height() * 0.8; },

                shading: true,

                closeOnOutsideClick: false,

                position: undefined,

                animation: {},

                title: '',

                titleTemplate: 'title',

                onTitleRendered: null,

                fullScreen: false
            },

            /**
            * @name dxLookupOptions.acceptCustomValue
            * @hidden
            */
            /**
            * @name dxLookupOptions.readOnly
            * @hidden
            */
            /**
            * @name dxLookupOptions.onFocusIn
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onFocusOut
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onKeyDown
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onKeyPress
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onKeyUp
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onChange
            * @action
            * @hidden
            */
            /**
            * @name dxLookupOptions.onInput
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onCut
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onCopy
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onPaste
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.onEnterKey
            * @hidden
            * @action
            */
            /**
            * @name dxLookupOptions.maxLength
            * @hidden
            */
            /**
            * @name dxLookupOptions.spellcheck
            * @hidden
            */
            /**
            * @name dxLookupOptions.buttons
            * @hidden
            */

            dropDownCentered: false,

            _scrollToSelectedItemEnabled: false,
            useHiddenSubmitElement: true
        });
    },

    _defaultOptionsRules: function() {
        const themeName = current();

        return this.callBase().concat([
            {
                device: function() {
                    return !nativeScrolling;
                },
                options: {
                    useNativeScrolling: false
                }
            },
            {
                device: function(device) {
                    return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
                },
                options: {
                    usePopover: true,

                    dropDownOptions: {
                        height: 'auto'
                    }
                }
            },
            {
                device: { platform: 'ios', phone: true },
                options: {
                    dropDownOptions: {
                        fullScreen: true
                    }
                }
            },
            {
                device: { platform: 'ios', tablet: true },
                options: {
                    dropDownOptions: {
                        width: function() { return Math.min($(window).width(), $(window).height()) * 0.4; },
                        height: 'auto'
                    },

                    usePopover: true,
                    useInkRipple: false
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return isMaterial(themeName);
                },
                options: {

                    usePopover: false,

                    searchEnabled: false,

                    showCancelButton: false,

                    dropDownCentered: true,

                    _scrollToSelectedItemEnabled: true,

                    dropDownOptions: {
                        closeOnOutsideClick: true,

                        width: () => getElementWidth(this.$element()),
                        height: (function() { return this._getPopupHeight(); }).bind(this),
                        showTitle: false,

                        shading: false
                    }
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this._initActions();
    },

    _initActions() {
        this.callBase();

        this._initScrollAction();
        this._initPageLoadingAction();
        this._initPullRefreshAction();
    },

    _initPageLoadingAction: function() {
        this._pageLoadingAction = this._createActionByOption('onPageLoading');
    },

    _initPullRefreshAction: function() {
        this._pullRefreshAction = this._createActionByOption('onPullRefresh');
    },

    _initScrollAction: function() {
        this._scrollAction = this._createActionByOption('onScroll');
    },

    _scrollHandler: function(e) {
        this._scrollAction(e);
    },

    _pullRefreshHandler: function(e) {
        this._pullRefreshAction(e);
    },

    _pageLoadingHandler: function(e) {
        this._pageLoadingAction(e);
    },

    _initTemplates: function() {
        this.callBase();
        this._templateManager.addDefaultTemplates({
            group: new ChildDefaultTemplate('group'),
            title: new ChildDefaultTemplate('title'),
        });
    },

    _initMarkup: function() {
        this.$element()
            .addClass(LOOKUP_CLASS)
            .toggleClass(LOOKUP_POPOVER_MODE, this.option('usePopover'));
        this.callBase();
    },

    _inputWrapper: function() {
        return this.$element().find('.' + LOOKUP_FIELD_WRAPPER_CLASS);
    },

    _dataSourceOptions: function() {
        return extend(this.callBase(), {
            paginate: true
        });
    },

    _fireContentReadyAction: noop, // TODO: why not symmetric to other dropdowns?

    _popupWrapperClass: function() {
        return '';
    },

    _renderInput: function() {
        const fieldClickAction = this._createAction(() => {
            this._toggleOpenState();
        });

        this._$field = $('<div>').addClass(LOOKUP_FIELD_CLASS);
        eventsEngine.on(this._$field, addNamespace(clickEventName, this.NAME), e => {
            fieldClickAction({ event: e });
        });

        const $arrow = $('<div>').addClass(LOOKUP_ARROW_CLASS);

        this._$fieldWrapper = $('<div>').addClass(LOOKUP_FIELD_WRAPPER_CLASS)
            .append(this._$field)
            .append($arrow)
            .appendTo(this.$element());

        this.option('useInkRipple') && this._renderInkRipple();
    },

    _getInputContainer() {
        return this._$fieldWrapper;
    },

    _renderInkRipple: function() {
        this._inkRipple = render();
    },

    _toggleOpenState: function() {
        this.callBase();

        if(!this.option('dropDownOptions.fullScreen') && this.option('_scrollToSelectedItemEnabled')) {
            this._setPopupPosition();
        }
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase(...arguments);

        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: this._inputWrapper(),
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _renderField: function() {
        const fieldTemplate = this._getTemplateByOption('fieldTemplate');

        if(fieldTemplate && this.option('fieldTemplate')) {
            this._renderFieldTemplate(fieldTemplate);
            return;
        }

        const displayValue = this.option('displayValue');
        this._updateField(isDefined(displayValue) && String(displayValue) || this.option('placeholder'));
        this.$element().toggleClass(LOOKUP_EMPTY_CLASS, !this.option('selectedItem'));
    },

    _renderDisplayText: function(text) {
        if(this._input().length) {
            this.callBase(text);
        } else {
            this._updateField(text);
        }
    },

    _updateField: function(text) {
        this._$field.text(text);
    },

    _renderFieldTemplate: function(template) {
        this._$field.empty();
        const data = this._fieldRenderData();
        template.render({
            model: data,
            container: getPublicElement(this._$field)
        });
    },

    _fieldRenderData: function() {
        return this.option('selectedItem');
    },

    _popupShowingHandler: function() {
        this.callBase.apply(this, arguments);

        if(this.option('cleanSearchOnOpening')) {
            if(this.option('searchEnabled') && this._searchBox.option('value')) {
                this._searchBox.option('value', '');
                this._searchCanceled();
            }
            this._list && this._list.option('focusedElement', null);
        }

        if(this.option('dropDownOptions.fullScreen') && this.option('_scrollToSelectedItemEnabled')) {
            this._popup.option('position').of = $(window);
        }
    },

    _scrollToSelectedItem: function() {
        const selectedIndex = this._list.option('selectedIndex');
        const listItems = this._list.option('items');
        const itemsCount = listItems.length;

        if(itemsCount !== 0) {
            if(this._list.option('grouped')) {
                this._list.scrollToItem({ group: itemsCount - 1, item: listItems[itemsCount - 1].items.length - 1 });
            } else {
                this._list.scrollToItem(itemsCount - 1);
            }

            this._list.scrollToItem(selectedIndex);
        }
    },

    _getDifferenceOffsets: function(selectedListItem) {
        return selectedListItem.offset().top - $(this.element()).offset().top;
    },

    _isCenteringEnabled(index, count) {
        return 1 < index && index < (count - 2);
    },

    _getPopupOffset: function() {
        const listItemsCount = this._listItemElements().length;

        if(listItemsCount === 0) return;

        const selectedListItem = $(this._list.element()).find('.' + LIST_ITEM_SELECTED_CLASS);
        const selectedIndex = this._listItemElements().index(selectedListItem);
        const differenceOfHeights = (selectedListItem.height() - $(this.element()).height()) / 2;
        const lookupOffset = $(this._list.element()).offset().top;
        const dropDownHeightOption = this.option('dropDownOptions.height');
        const popupHeight = (typeof dropDownHeightOption === 'function') ? dropDownHeightOption() : dropDownHeightOption;
        const windowHeight = $(window).height();

        let offsetTop = 0;

        if(selectedIndex !== -1) {
            if(this._isCenteringEnabled(selectedIndex, listItemsCount)) {
                this._scrollToSelectedItem();

                const scrollOffsetTop = (popupHeight - selectedListItem.height()) / 2 - this._getDifferenceOffsets(selectedListItem);

                this._list.scrollTo(this._list.scrollTop() + MATERIAL_LOOKUP_LIST_PADDING / 2 - scrollOffsetTop);

                offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);

                if(lookupOffset < offsetTop && selectedIndex !== (listItemsCount - 3)) {
                    this._list.scrollTo(this._list.scrollTop() + this._getDifferenceOffsets(selectedListItem) / 2);

                    offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
                }
            } else if(selectedIndex <= 1) {
                this._list.scrollTo(0);

                offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
            } else if(selectedIndex >= (listItemsCount - 2)) {
                this._scrollToSelectedItem();

                offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
            }

            if(lookupOffset < offsetTop) {
                this._scrollToSelectedItem();
                offsetTop = differenceOfHeights + MATERIAL_LOOKUP_LIST_PADDING;
            }
        }

        const offsetBottom = popupHeight - offsetTop - $(this.element()).height();

        if(windowHeight - lookupOffset < offsetBottom) {
            this._list.scrollTo(this._list.scrollTop() + differenceOfHeights - offsetBottom);
            offsetTop = popupHeight - $(this.element()).height() - MATERIAL_LOOKUP_LIST_PADDING;
        }

        return offsetTop;
    },

    _setPopupPosition: function() {
        if(!this.option('dropDownCentered')) return;

        const flipped = this._popup._$wrapper.hasClass(LOOKUP_POPOVER_FLIP_VERTICAL_CLASS);
        if(flipped) return;

        const popupContentParent = $(this._popup.content()).parent();
        const popupOffset = this._getPopupOffset();

        const position = locate(popupContentParent);

        move(popupContentParent, {
            top: position.top - popupOffset
        });
    },


    _listItemGroupedElements: function() {
        const groups = this._list._itemContainer().children();
        const items = [];

        groups.each((_, group) => {
            items.push($(group).find('.' + GROUP_LIST_HEADER_CLASS)[0]);

            const groupedItems = $(group).find('.' + LIST_ITEM_CLASS);
            groupedItems.each((_, item) => {
                items.push(item);
            });
        });

        return $(items);
    },

    _calculateListHeight: function(grouped) {
        const listItems = grouped ? this._listItemGroupedElements() : this._listItemElements();
        const selectedListItem = $('.' + LIST_ITEM_SELECTED_CLASS);
        const selectedIndex = listItems.index(selectedListItem);
        let listHeight = 0;
        let requireListItems = [];

        if(listItems.length === 0) {
            listHeight += MATERIAL_LOOKUP_LIST_PADDING;
        } else if(listItems.length < MATERIAL_LOOKUP_LIST_ITEMS_COUNT) {
            listItems.each((_, item) => {
                listHeight += $(item).outerHeight();
            });
        } else {
            if(selectedIndex <= 1) {
                requireListItems = listItems.slice(0, MATERIAL_LOOKUP_LIST_ITEMS_COUNT);
            } else if(this._isCenteringEnabled(selectedIndex, listItems.length)) {
                requireListItems = listItems.slice(selectedIndex - 2, selectedIndex + 3);
            } else {
                requireListItems = listItems.slice(listItems.length - MATERIAL_LOOKUP_LIST_ITEMS_COUNT, listItems.length);
            }

            requireListItems.each((_, item) => {
                listHeight += $(item).outerHeight();
            });
        }

        return listHeight + (grouped ? MATERIAL_LOOKUP_LIST_PADDING : MATERIAL_LOOKUP_LIST_PADDING * 2);
    },

    _getPopupHeight: function() {
        if(this._list && this._list.itemElements()) {
            return this._calculateListHeight(this.option('grouped')) +
                (this._$searchWrapper ? this._$searchWrapper.outerHeight() : 0) +
                (this._popup._$bottom ? this._popup._$bottom.outerHeight() : 0) +
                (this._popup._$title ? this._popup._$title.outerHeight() : 0);
        } else {
            return 'auto';
        }
    },

    _renderPopup: function() {
        if(this.option('usePopover') && !this.option('dropDownOptions.fullScreen')) {
            if(this.option('_scrollToSelectedItemEnabled')) {
                this.callBase();
            } else {
                this._renderPopover();
            }
        } else {
            this.callBase();
        }

        this._$popup.addClass(LOOKUP_POPUP_CLASS);
        this._popup._wrapper().addClass(LOOKUP_POPUP_WRAPPER_CLASS);
    },

    _renderPopover: function() {
        this._popup = this._createComponent(this._$popup, Popover, extend(this._popupConfig(),
            this._options.cache('dropDownOptions'), {
                showEvent: null,
                hideEvent: null,
                target: this.$element(),
                _fixedPosition: false,
                fullScreen: false,
                shading: false,
                closeOnTargetScroll: true,
                width: this._isInitialOptionValue('dropDownOptions.width')
                    ? (function() { return this.$element().outerWidth(); }).bind(this)
                    : this._popupConfig().width
            }));

        this._popup.on({
            'showing': this._popupShowingHandler.bind(this),
            'shown': this._popupShownHandler.bind(this),
            'hiding': this._popupHidingHandler.bind(this),
            'hidden': this._popupHiddenHandler.bind(this),
            'contentReady': this._contentReadyHandler.bind(this)
        });

        if(this.option('_scrollToSelectedItemEnabled')) this._popup._$arrow.remove();

        this._setPopupContentId(this._popup.$content());

        this._contentReadyHandler();
    },

    _popupHidingHandler: function() {
        this.callBase();
        this.option('focusStateEnabled') && this.focus();
    },

    _popupHiddenHandler: function() {
        this.callBase();

        if(this.option('_scrollToSelectedItemEnabled')) {
            resetPosition($(this._popup.content()).parent());
        }
    },

    _preventFocusOnPopup: noop,

    _popupConfig: function() {
        const result = extend(this.callBase(), {

            toolbarItems: this._getPopupToolbarItems(),

            closeOnTargetScroll: false,
            onPositioned: null,

            maxHeight: function() { return $(window).height(); },

            showTitle: this.option('dropDownOptions.showTitle'),
            title: this.option('dropDownOptions.title'),
            titleTemplate: this._getTemplateByOption('dropDownOptions.titleTemplate'),
            onTitleRendered: this.option('dropDownOptions.onTitleRendered'),
            fullScreen: this.option('dropDownOptions.fullScreen'),
            shading: this.option('dropDownOptions.shading'),
            closeOnOutsideClick: this.option('dropDownOptions.closeOnOutsideClick'),
        });

        delete result.animation;
        delete result.position;

        if(this.option('_scrollToSelectedItemEnabled')) {
            result.position = this.option('dropDownCentered') ? {
                my: 'left top',
                at: 'left top',
                of: this.element()
            } : {
                my: 'left top',
                at: 'left bottom',
                of: this.element()
            };
        }

        each(['position', 'animation', 'width', 'height'], (_, optionName) => {
            const popupOptionValue = this.option(`dropDownOptions.${ optionName }`);
            if(popupOptionValue !== undefined) {
                result[optionName] = popupOptionValue;
            }
        });

        return result;
    },

    _getPopupToolbarItems: function() {
        const buttonsConfig = this.option('applyValueMode') === 'useButtons'
            ? this._popupToolbarItemsConfig()
            : [];

        const cancelButton = this._getCancelButtonConfig();
        if(cancelButton) {
            buttonsConfig.push(cancelButton);
        }

        const clearButton = this._getClearButtonConfig();
        if(clearButton) {
            buttonsConfig.push(clearButton);
        }

        return this._applyButtonsLocation(buttonsConfig);
    },

    _popupToolbarItemsConfig: function() {
        return [
            {
                shortcut: 'done',
                options: {
                    onClick: this._applyButtonHandler.bind(this),
                    text: this.option('applyButtonText')
                }
            }
        ];
    },

    _getCancelButtonConfig: function() {
        return this.option('showCancelButton') ? {
            shortcut: 'cancel',
            onClick: this._cancelButtonHandler.bind(this),
            options: {
                onInitialized: e => {
                    e.component.registerKeyHandler('escape', this.close.bind(this));
                },
                text: this.option('cancelButtonText')
            }
        } : null;
    },

    _getClearButtonConfig: function() {
        return this.option('showClearButton') ? {
            shortcut: 'clear',
            onClick: this._resetValue.bind(this),
            options: { text: this.option('clearButtonText') }
        } : null;
    },

    _applyButtonHandler: function() {
        this.option('value', this._valueGetter(this._currentSelectedItem()));
        this.callBase();
    },

    _cancelButtonHandler: function() {
        this._refreshSelected();
        this.callBase();
    },

    _refreshPopupVisibility: function() {
        if(this.option('opened')) {
            this._updatePopupDimensions();
        }
    },

    _dimensionChanged: function() {
        if(this.option('usePopover') && !this.option('dropDownOptions.width')) {
            this.option('dropDownOptions.width', this.$element().width());
        }

        this._popup && this._updatePopupDimensions();
    },

    _input: function() {
        return this._$searchBox || this.callBase();
    },

    _renderPopupContent: function() {
        this.callBase();
        this._renderSearch();
    },

    _renderSearch: function() {
        const isSearchEnabled = this.option('searchEnabled');

        this._toggleSearchClass(isSearchEnabled);

        if(isSearchEnabled) {
            const $searchWrapper = this._$searchWrapper = $('<div>').addClass(LOOKUP_SEARCH_WRAPPER_CLASS);

            const $searchBox = this._$searchBox = $('<div>').addClass(LOOKUP_SEARCH_CLASS)
                .appendTo($searchWrapper);

            const currentDevice = devices.current();
            const searchMode = currentDevice.android && currentDevice.version[0] >= 5 ? 'text' : 'search';

            let isKeyboardListeningEnabled = false;

            this._searchBox = this._createComponent($searchBox, TextBox, {
                onDisposing: () => isKeyboardListeningEnabled = false,
                onFocusIn: () => isKeyboardListeningEnabled = true,
                onFocusOut: () => isKeyboardListeningEnabled = false,
                onKeyboardHandled: opts => isKeyboardListeningEnabled && this._list._keyboardHandler(opts),
                mode: searchMode,
                showClearButton: true,
                valueChangeEvent: this.option('valueChangeEvent'),
                onValueChanged: this._searchHandler.bind(this)
            });

            this._registerSearchKeyHandlers();

            $searchWrapper.insertBefore(this._$list);

            this._setSearchPlaceholder();
        }
    },

    _removeSearch: function() {
        this._$searchWrapper && this._$searchWrapper.remove();
        delete this._$searchWrapper;

        this._$searchBox && this._$searchBox.remove();
        delete this._$searchBox;
        delete this._searchBox;
    },

    _selectListItemHandler: function(e) {
        const $itemElement = $(this._list.option('focusedElement'));

        if(!$itemElement.length) {
            return;
        }

        e.preventDefault();
        this._saveValueChangeEvent(e);
        this._selectListItem(e.itemData, $itemElement);
    },

    _registerSearchKeyHandlers: function() {
        this._searchBox.registerKeyHandler('escape', this.close.bind(this));
        this._searchBox.registerKeyHandler('enter', this._selectListItemHandler.bind(this));
        this._searchBox.registerKeyHandler('space', this._selectListItemHandler.bind(this));
        this._searchBox.registerKeyHandler('end', noop);
        this._searchBox.registerKeyHandler('home', noop);
    },

    _toggleSearchClass: function(isSearchEnabled) {
        if(this._popup) {
            this._popup._wrapper().toggleClass(LOOKUP_POPUP_SEARCH_CLASS, isSearchEnabled);
        }
    },

    _setSearchPlaceholder: function() {
        if(!this._$searchBox) {
            return;
        }

        const minSearchLength = this.option('minSearchLength');
        let placeholder = this.option('searchPlaceholder');

        if(minSearchLength && placeholder === messageLocalization.format('Search')) {
            placeholder = messageLocalization.getFormatter('dxLookup-searchPlaceholder')(minSearchLength);
        }

        this._searchBox.option('placeholder', placeholder);
    },

    _setAriaTargetForList: noop,

    _renderList: function() {
        this.callBase();

        this._list.registerKeyHandler('escape', () => {
            this.close();
        });
    },

    _listConfig: function() {
        return extend(this.callBase(), {
            tabIndex: 0,
            grouped: this.option('grouped'),
            groupTemplate: this._getTemplateByOption('groupTemplate'),
            pullRefreshEnabled: this.option('pullRefreshEnabled'),
            useNativeScrolling: this.option('useNativeScrolling'),
            pullingDownText: this.option('pullingDownText'),
            pulledDownText: this.option('pulledDownText'),
            refreshingText: this.option('refreshingText'),
            pageLoadingText: this.option('pageLoadingText'),
            onScroll: this._scrollHandler.bind(this),
            onPullRefresh: this._pullRefreshHandler.bind(this),
            onPageLoading: this._pageLoadingHandler.bind(this),
            pageLoadMode: this.option('pageLoadMode'),
            nextButtonText: this.option('nextButtonText'),
            indicateLoading: this.option('searchEnabled'),
            onSelectionChanged: this._getSelectionChangedHandler()
        });
    },

    _getSelectionChangedHandler: function() {
        return this.option('showSelectionControls') ? this._selectionChangeHandler.bind(this) : noop;
    },

    _listContentReadyHandler: function() {
        this.callBase(...arguments);
        this._refreshSelected();
    },

    _setFocusPolicy: function() {
        if(!this.option('focusStateEnabled')) {
            return;
        }

        if(this.option('searchEnabled')) {
            this._searchBox.focus();
        } else {
            eventsEngine.trigger(this._$list, 'focus');
        }
    },

    _focusTarget: function() {
        return this._$field;
    },

    _keyboardEventBindingTarget: function() {
        return this._$field;
    },

    _listItemClickHandler: function(e) {
        this._saveValueChangeEvent(e.event);
        this._selectListItem(e.itemData, e.event.currentTarget);
    },

    _selectListItem: function(itemData, target) {
        this._list.selectItem(target);

        if(this.option('applyValueMode') === 'instantly') {
            this._applyButtonHandler();
        }
    },

    _currentSelectedItem: function() {
        return this.option('grouped')
            ? this._list.option('selectedItems[0]').items[0]
            : this._list.option('selectedItems[0]');
    },

    _resetValue: function(e) {
        this._saveValueChangeEvent(e.event);
        this.option('value', null);
        this.option('opened', false);
    },

    _searchValue: function() {
        return this.option('searchEnabled') && this._searchBox ? this._searchBox.option('value') : '';
    },

    _renderInputValue: function() {
        return this.callBase().always(() => {
            this._refreshSelected();
        });
    },

    _renderPlaceholder: function() {
        if(this.$element().find('.' + TEXTEDITOR_INPUT_CLASS).length === 0) {
            return;
        }

        this.callBase();
    },

    _clean: function() {
        this._$fieldWrapper.remove();
        this._$searchBox = null;
        delete this._inkRipple;
        this.callBase();
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            'title': { since: '20.1', alias: 'dropDownOptions.title' },
            'titleTemplate': { since: '20.1', alias: 'dropDownOptions.titleTemplate' },
            'onTitleRendered': { since: '20.1', alias: 'dropDownOptions.onTitleRendered' },
            'fullScreen': { since: '20.1', alias: 'dropDownOptions.fullScreen' },
            'popupWidth': { since: '20.1', alias: 'dropDownOptions.width' },
            'popupHeight': { since: '20.1', alias: 'dropDownOptions.height' },
            'shading': { since: '20.1', alias: 'dropDownOptions.shading' },
            'closeOnOutsideClick': { since: '20.1', alias: 'dropDownOptions.closeOnOutsideClick' },
            'position': { since: '20.1', alias: 'dropDownOptions.position' },
            'animation': { since: '20.1', alias: 'dropDownOptions.animation' }
        });
    },

    _optionChanged: function(args) {
        const name = args.name;
        const value = args.value;

        switch(name) {
            case 'dataSource':
                this.callBase(...arguments);
                this._renderField();
                break;
            case 'searchEnabled':
                if(this._popup) {
                    this._removeSearch();
                    this._renderSearch();
                }
                break;
            case 'searchPlaceholder':
                this._setSearchPlaceholder();
                break;
            case 'minSearchLength':
                this._setSearchPlaceholder();
                this.callBase(...arguments);
                break;
            case 'title':
            case 'titleTemplate':
            case 'onTitleRendered':
            case 'shading':
            case 'animation':
            case 'position':
            case 'closeOnOutsideClick':
            case 'fullScreen':
                this._setPopupOption(name, value);
                break;
            case 'usePopover':
            case 'placeholder':
                this._invalidate();
                break;
            case 'clearButtonText':
            case 'showClearButton':
            case 'showCancelButton':
                this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
                break;
            case 'applyValueMode':
                this.callBase(...arguments);
                break;
            case 'popupWidth':
                this._setPopupOption('width', value === 'auto' ? this.initialOption('dropDownOptions').width : value);
                break;
            case 'popupHeight':
                this._setPopupOption('height', value === 'auto' ? this.initialOption('dropDownOptions').height : value);
                break;
            case 'onPageLoading':
                this._initPageLoadingAction();
                break;
            case 'onPullRefresh':
                this._initPullRefreshAction();
                break;
            case 'pullRefreshEnabled':
            case 'useNativeScrolling':
            case 'pullingDownText':
            case 'pulledDownText':
            case 'refreshingText':
            case 'pageLoadingText':
            case 'nextButtonText':
            case 'grouped':
            case 'groupTemplate':
                this._setListOption(name);
                break;
            case 'onScroll':
                this._initScrollAction();
                break;
            case 'pageLoadMode':
                this._setListOption('pageLoadMode', this.option('pageLoadMode'));
                break;
            case 'cleanSearchOnOpening':
            case '_scrollToSelectedItemEnabled':
                break;
            case 'dropDownCentered':
                if(this.option('_scrollToSelectedItemEnabled')) {
                    this.option('dropDownOptions.position', undefined);
                    this._renderPopup();
                }
                break;
            default:
                this.callBase(...arguments);
        }
    },

    focus: function() {
        this.option('opened') ? this._setFocusPolicy() : eventsEngine.trigger(this._focusTarget(), 'focus');
    },

    field: function() {
        return this._$field;
    }

    /**
    * @name dxLookupMethods.getButton
    * @publicName getButton(name)
    * @hidden
    */
});

registerComponent('dxLookup', Lookup);

export default Lookup;
