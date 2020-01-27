const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const window = require('../core/utils/window').getWindow();
const support = require('../core/utils/support');
const commonUtils = require('../core/utils/common');
const domUtils = require('../core/utils/dom');
const each = require('../core/utils/iterator').each;
const extend = require('../core/utils/extend').extend;
const inkRipple = require('./widget/utils.ink_ripple');
const messageLocalization = require('../localization/message');
const devices = require('../core/devices');
const registerComponent = require('../core/component_registrator');
const eventUtils = require('../events/utils');
const DropDownList = require('./drop_down_editor/ui.drop_down_list');
const themes = require('./themes');
const clickEvent = require('../events/click');
const Popover = require('./popover');
const TextBox = require('./text_box');
const ChildDefaultTemplate = require('../core/templates/child_default_template').ChildDefaultTemplate;
const translator = require('../animation/translator');

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

const POPUP_OPTION_MAP = {
    'popupWidth': 'width',
    'popupHeight': 'height'
};


const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';

const MATERIAL_LOOKUP_LIST_ITEMS_COUNT = 4;
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
            title: '',

            titleTemplate: 'title',

            onTitleRendered: null,

            placeholder: messageLocalization.format('Select'),

            searchPlaceholder: messageLocalization.format('Search'),

            searchEnabled: true,

            cleanSearchOnOpening: true,

            fullScreen: false,

            showCancelButton: true,


            showClearButton: false,

            clearButtonText: messageLocalization.format('Clear'),

            applyButtonText: messageLocalization.format('OK'),

            popupWidth: function() { return $(window).width() * 0.8; },

            popupHeight: function() { return $(window).height() * 0.8; },

            shading: true,

            closeOnOutsideClick: false,

            position: undefined,

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

            showPopupTitle: true,

            focusStateEnabled: false,


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

            _scrollToSelectedItemEnabled: false,
            useHiddenSubmitElement: true
        });
    },

    _defaultOptionsRules: function() {
        const themeName = themes.current();

        return this.callBase().concat([
            {
                device: function() {
                    return !support.nativeScrolling;
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
                    popupHeight: 'auto'
                }
            },
            {
                device: { platform: 'ios', phone: true },
                options: {
                    fullScreen: true
                }
            },
            {
                device: { platform: 'ios', tablet: true },
                options: {
                    popupWidth: function() { return Math.min($(window).width(), $(window).height()) * 0.4; },

                    popupHeight: 'auto',

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
                    return themes.isMaterial(themeName);
                },
                options: {

                    usePopover: false,

                    closeOnOutsideClick: true,

                    popupWidth: (function() { return $(this.element()).outerWidth(); }).bind(this),
                    popupHeight: (function() { return this._getPopupHeight(MATERIAL_LOOKUP_LIST_ITEMS_COUNT); }).bind(this),

                    searchEnabled: false,

                    showCancelButton: false,

                    showPopupTitle: false,

                    position: {
                        my: 'left top',
                        at: 'left top',
                        of: this.element()
                    },

                    _scrollToSelectedItemEnabled: true
                }
            }
        ]);
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

    _fireContentReadyAction: commonUtils.noop, // TODO: why not symmetric to other dropdowns?

    _popupWrapperClass: function() {
        return '';
    },

    _renderInput: function() {
        const fieldClickAction = this._createAction((function() {
            this._toggleOpenState();
        }).bind(this));

        this._$field = $('<div>').addClass(LOOKUP_FIELD_CLASS);
        eventsEngine.on(this._$field, eventUtils.addNamespace(clickEvent.name, this.NAME), function(e) {
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
        this._inkRipple = inkRipple.render();
    },

    _toggleOpenState: function() {
        this.callBase();

        if(!this.option('fullScreen') && this.option('_scrollToSelectedItemEnabled')) {
            this._setPopupPosition();
        }
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

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

        this._updateField(this.option('displayValue') || this.option('placeholder'));
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
            container: domUtils.getPublicElement(this._$field)
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

        if(this.option('fullScreen') && this.option('_scrollToSelectedItemEnabled')) {
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

    _setPopupPosition: function() {
        const selectedIndex = this._list.option('selectedIndex');
        const flipped = this._popup._$wrapper.hasClass(LOOKUP_POPOVER_FLIP_VERTICAL_CLASS);
        if(selectedIndex === -1 || flipped) return;

        const selectedListItem = $(this._list.element()).find('.' + LIST_ITEM_SELECTED_CLASS);

        if(selectedListItem.offset().top < 0 || this._list.scrollTop() !== selectedListItem.position().top) {
            this._scrollToSelectedItem();
        }

        const differenceOfHeights = (selectedListItem.height() - $(this.element()).height()) / 2;
        const popupContentParent = $(this._popup.content()).parent();
        const differenceOfOffsets = selectedListItem.offset().top - popupContentParent.offset().top;
        const lookupTop = $(this.element()).offset().top;
        let popupOffsetY = differenceOfHeights;

        if(lookupTop > differenceOfOffsets) {
            popupOffsetY += differenceOfOffsets;
        } else {
            this._scrollToSelectedItem();
        }

        const position = translator.locate(popupContentParent);

        translator.move(popupContentParent, {
            top: position.top - popupOffsetY
        });
    },

    _getPopupHeight: function(listItemsCount) {
        return (this._list && this._list.itemElements()) ?
            (this._list.itemElements().height() * listItemsCount) +
            MATERIAL_LOOKUP_LIST_PADDING * 2 +
            (this._$searchWrapper ? this._$searchWrapper.outerHeight() : 0) +
            (this._popup._$bottom ? this._popup._$bottom.outerHeight() : 0) +
            (this._popup._$title ? this._popup._$title.outerHeight() : 0) :
            'auto';
    },

    _renderPopup: function() {
        if(this.option('usePopover') && !this.option('fullScreen')) {
            this._renderPopover();
        } else {
            this.callBase();
        }

        this._$popup.addClass(LOOKUP_POPUP_CLASS);
        this._popup._wrapper().addClass(LOOKUP_POPUP_WRAPPER_CLASS);
    },

    _popupOptionMap: function(optionName) {
        return POPUP_OPTION_MAP[optionName] || optionName;
    },

    _renderPopover: function() {
        this._popup = this._createComponent(this._$popup, Popover, extend(this._popupConfig(), {
            showEvent: null,
            hideEvent: null,
            target: this.$element(),
            fullScreen: false,
            shading: false,
            closeOnTargetScroll: true,
            width: this._isInitialOptionValue('popupWidth') ? (function() { return this.$element().outerWidth(); }).bind(this) : this._popupConfig().width
        }));

        this._popup.on({
            'showing': this._popupShowingHandler.bind(this),
            'shown': this._popupShownHandler.bind(this),
            'hiding': this._popupHidingHandler.bind(this),
            'hidden': this._popupHiddenHandler.bind(this)
        });

        this._setPopupContentId(this._popup.$content());

        this._popup.option('onContentReady', this._contentReadyHandler.bind(this));
        this._contentReadyHandler();
    },

    _popupHidingHandler: function() {
        this.callBase();
        this.option('focusStateEnabled') && this.focus();
    },

    _popupHiddenHandler: function() {
        this.callBase();

        if(this.option('_scrollToSelectedItemEnabled')) {
            translator.resetPosition($(this._popup.content()).parent());
        }
    },

    _preventFocusOnPopup: commonUtils.noop,

    _popupConfig: function() {
        const result = extend(this.callBase(), {
            showTitle: this.option('showPopupTitle'),
            title: this.option('title'),
            titleTemplate: this._getTemplateByOption('titleTemplate'),
            onTitleRendered: this.option('onTitleRendered'),

            toolbarItems: this._getPopupToolbarItems(),

            fullScreen: this.option('fullScreen'),
            shading: this.option('shading'),
            closeOnTargetScroll: false,
            closeOnOutsideClick: this.option('closeOnOutsideClick'),
            onPositioned: null
        });

        delete result.animation;
        delete result.position;

        result.maxHeight = function() { return $(window).height(); };

        each(['position', 'animation', 'popupWidth', 'popupHeight'], (function(_, optionName) {
            if(this.option(optionName) !== undefined) {
                result[this._popupOptionMap(optionName)] = this.option(optionName);
            }
        }).bind(this));

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
                onInitialized: function(e) {
                    e.component.registerKeyHandler('escape', this.close.bind(this));
                }.bind(this),
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
            this._updatePopupHeight();
        }
    },

    _dimensionChanged: function() {
        if(this.option('usePopover') && !this.option('popupWidth')) {
            this.option('popupWidth', this.$element().width());
        }

        this.callBase();
    },

    _updatePopupDimensions: function() {
        this._updatePopupHeight();
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
        this._selectListItem(e.itemData, $itemElement);
    },

    _registerSearchKeyHandlers: function() {
        this._searchBox.registerKeyHandler('escape', this.close.bind(this));
        this._searchBox.registerKeyHandler('enter', this._selectListItemHandler.bind(this));
        this._searchBox.registerKeyHandler('space', this._selectListItemHandler.bind(this));
        this._searchBox.registerKeyHandler('end', commonUtils.noop);
        this._searchBox.registerKeyHandler('home', commonUtils.noop);
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

    _setAriaTargetForList: commonUtils.noop,

    _renderList: function() {
        this.callBase();

        this._list.registerKeyHandler('escape', (function() {
            this.close();
        }).bind(this));
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
            onScroll: this.option('onScroll'),
            onPullRefresh: this.option('onPullRefresh'),
            onPageLoading: this.option('onPageLoading'),
            pageLoadMode: this.option('pageLoadMode'),
            nextButtonText: this.option('nextButtonText'),
            indicateLoading: this.option('searchEnabled'),
            onSelectionChanged: this._getSelectionChangedHandler()
        });
    },

    _getSelectionChangedHandler: function() {
        return this.option('showSelectionControls') ? this._selectionChangeHandler.bind(this) : commonUtils.noop;
    },

    _listContentReadyHandler: function() {
        this.callBase.apply(this, arguments);
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
        return this.callBase().always((function() {
            this._refreshSelected();
        }).bind(this));
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

    _optionChanged: function(args) {
        const name = args.name;
        const value = args.value;

        switch(name) {
            case 'dataSource':
                this.callBase.apply(this, arguments);
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
                this.callBase.apply(this, arguments);
                break;
            case 'title':
            case 'titleTemplate':
            case 'onTitleRendered':
            case 'shading':
            case 'animation':
            case 'position':
            case 'closeOnOutsideClick':
                this._setPopupOption(name);
                break;
            case 'fullScreen':
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
                this.callBase.apply(this, arguments);
                break;
            case 'popupWidth':
                this._setPopupOption('popupWidth', value === 'auto' ? this.initialOption('popupWidth') : value);
                break;
            case 'popupHeight':
                this._setPopupOption('popupHeight', value === 'auto' ? this.initialOption('popupHeight') : value);
                break;
            case 'pullRefreshEnabled':
            case 'useNativeScrolling':
            case 'pullingDownText':
            case 'pulledDownText':
            case 'refreshingText':
            case 'pageLoadingText':
            case 'onScroll':
            case 'onPullRefresh':
            case 'onPageLoading':
            case 'nextButtonText':
            case 'grouped':
            case 'groupTemplate':
                this._setListOption(name);
                break;
            case 'pageLoadMode':
                this._setListOption('pageLoadMode', this.option('pageLoadMode'));
                break;
            case 'cleanSearchOnOpening':
            case '_scrollToSelectedItemEnabled':
                break;
            default:
                this.callBase.apply(this, arguments);
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

module.exports = Lookup;
