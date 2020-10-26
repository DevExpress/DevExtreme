import $ from '../core/renderer';
import Widget from './widget/ui.widget';
import { FunctionTemplate } from '../core/templates/function_template';
import registerComponent from '../core/component_registrator';
import ButtonGroup from './button_group';
import Popup from './popup';
import List from './list';
import { compileGetter } from '../core/utils/data';
import { getPublicElement } from '../core/element';
import { getImageContainer } from '../core/utils/icon';
import DataHelperMixin from '../data_helper';
import { DataSource } from '../data/data_source/data_source';
import ArrayStore from '../data/array_store';
import { Deferred } from '../core/utils/deferred';
import { extend } from '../core/utils/extend';
import { isPlainObject, isDefined } from '../core/utils/type';
import { ensureDefined } from '../core/utils/common';
import Guid from '../core/guid';
import { getElementWidth, getSizeValue } from './drop_down_editor/utils';
import messageLocalization from '../localization/message';

// STYLE dropDownButton

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_CONTENT = 'dx-dropdownbutton-content';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
const DROP_DOWN_BUTTON_HAS_ARROW_CLASS = 'dx-dropdownbutton-has-arrow';
const DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = 'dx-dropdownbutton-popup-wrapper';
const DX_BUTTON_TEXT_CLASS = 'dx-button-text';
const DX_ICON_RIGHT_CLASS = 'dx-icon-right';

const DropDownButton = Widget.inherit({

    _getDefaultOptions() {
        return extend(this.callBase(), {

            /**
             * @name dxDropDownButtonItem
             * @inherits dxListItem
             * @type object
             */
            /**
             * @name dxDropDownButtonItem.key
             * @hidden
             */
            /**
             * @name dxDropDownButtonItem.showChevron
             * @hidden
             */

            itemTemplate: 'item',

            keyExpr: 'this',

            displayExpr: 'this',

            selectedItem: null,

            selectedItemKey: null,

            stylingMode: 'outlined',

            deferRendering: true,

            noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),

            useSelectMode: false,

            splitButton: false,

            showArrowIcon: true,

            text: '',

            icon: undefined,

            onButtonClick: null,

            onSelectionChanged: null,

            onItemClick: null,

            opened: false,

            items: null,

            dataSource: null,

            focusStateEnabled: true,

            hoverStateEnabled: true,

            dropDownOptions: {},

            dropDownContentTemplate: 'content',

            wrapItemText: false,

            grouped: false,
            groupTemplate: 'group',
            buttonGroupOptions: {}
        });
    },

    _setOptionsByReference() {
        this.callBase();

        extend(this._optionsByReference, {
            selectedItem: true
        });
    },

    _init() {
        this.callBase();
        this._createItemClickAction();
        this._createActionClickAction();
        this._createSelectionChangedAction();
        this._initDataSource();
        this._compileKeyGetter();
        this._compileDisplayGetter();
        this._itemsToDataSource(this.option('items'));
        this._options.cache('buttonGroupOptions', this.option('buttonGroupOptions'));
        this._options.cache('dropDownOptions', this.option('dropDownOptions'));
    },

    _initTemplates() {
        this._templateManager.addDefaultTemplates({
            content: new FunctionTemplate((options) => {
                const $popupContent = $(options.container);
                const $listContainer = $('<div>').appendTo($popupContent);
                this._list = this._createComponent($listContainer, List, this._listOptions());

                this._list.registerKeyHandler('escape', this._escHandler.bind(this));
                this._list.registerKeyHandler('tab', this._escHandler.bind(this));
                this._list.registerKeyHandler('leftArrow', this._escHandler.bind(this));
                this._list.registerKeyHandler('rightArrow', this._escHandler.bind(this));
            })
        });
        this.callBase();
    },

    _itemsToDataSource: function(value) {
        if(!this._dataSource) {
            this._dataSource = new DataSource({
                store: new ArrayStore({
                    key: this._getKey(),
                    data: value
                }),
                pageSize: 0,
            });
        }
    },

    _getKey: function() {
        const keyExpr = this.option('keyExpr');
        const storeKey = this._dataSource?.key();

        return isDefined(storeKey) && (!isDefined(keyExpr) || keyExpr === 'this') ? storeKey : keyExpr;
    },

    _compileKeyGetter() {
        this._keyGetter = compileGetter(this._getKey());
    },

    _compileDisplayGetter() {
        this._displayGetter = compileGetter(this.option('displayExpr'));
    },

    _initMarkup() {
        this.callBase();
        this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
        this._renderButtonGroup();
        this._updateArrowClass();

        if(isDefined(this.option('selectedItemKey'))) {
            this._loadSelectedItem().done(this._updateActionButton.bind(this));
        }
    },

    _render() {
        if(!this.option('deferRendering') || this.option('opened')) {
            this._renderPopup();
        }

        this.callBase();
    },

    _renderContentImpl() {
        if(this._popup) {
            this._renderPopupContent();
        }

        return this.callBase();
    },

    _loadSelectedItem() {
        const d = new Deferred();

        if(this._list && this._lastSelectedItemData !== undefined) {
            const cachedResult = this.option('useSelectMode') ? this._list.option('selectedItem') : this._lastSelectedItemData;
            return d.resolve(cachedResult);
        }
        this._lastSelectedItemData = undefined;

        const selectedItemKey = this.option('selectedItemKey');
        this._loadSingle(this._getKey(), selectedItemKey)
            .done(d.resolve)
            .fail(() => {
                d.resolve(null);
            });

        return d.promise();
    },

    _createActionClickAction() {
        this._actionClickAction = this._createActionByOption('onButtonClick');
    },

    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
    },

    _createItemClickAction() {
        this._itemClickAction = this._createActionByOption('onItemClick');
    },

    _fireSelectionChangedAction({ previousValue, value }) {
        this._selectionChangedAction({
            item: value,
            previousItem: previousValue
        });
    },

    _fireItemClickAction({ event, itemElement, itemData }) {
        return this._itemClickAction({
            event,
            itemElement,
            itemData: this._actionItem || itemData
        });
    },

    _actionButtonConfig() {
        return {
            text: this.option('text'),
            icon: this.option('icon'),
            elementAttr: { class: DROP_DOWN_BUTTON_ACTION_CLASS }
        };
    },

    _getButtonGroupItems() {
        const items = [];
        items.push(this._actionButtonConfig());
        if(this.option('splitButton')) {
            items.push({
                icon: 'spindown',
                elementAttr: { class: DROP_DOWN_BUTTON_TOGGLE_CLASS }
            });
        }
        return items;
    },

    _buttonGroupItemClick({ event, itemData }) {
        const isActionButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_ACTION_CLASS;
        const isToggleButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_TOGGLE_CLASS;

        if(isToggleButton) {
            this.toggle();
        } else if(isActionButton) {
            this._actionClickAction({
                event,
                selectedItem: this.option('selectedItem')
            });

            if(!this.option('splitButton')) {
                this.toggle();
            }
        }
    },

    _buttonGroupOptions() {
        return extend({
            items: this._getButtonGroupItems(),
            focusStateEnabled: this.option('focusStateEnabled'),
            hoverStateEnabled: this.option('hoverStateEnabled'),
            onItemClick: this._buttonGroupItemClick.bind(this),
            width: '100%',
            height: '100%',
            stylingMode: this.option('stylingMode'),
            selectionMode: 'none',
            buttonTemplate: ({ text, icon }, buttonContent) => {
                if(this.option('splitButton') || !this.option('showArrowIcon')) {
                    return 'content';
                }

                const $firstIcon = getImageContainer(icon);
                const $textContainer = text ? $('<span>').text(text).addClass(DX_BUTTON_TEXT_CLASS) : undefined;
                const $secondIcon = getImageContainer('spindown').addClass(DX_ICON_RIGHT_CLASS);

                $(buttonContent).append($firstIcon, $textContainer, $secondIcon);
            }
        }, this._options.cache('buttonGroupOptions'));
    },

    _renderPopupContent() {
        const $content = this._popup.$content();
        const template = this._getTemplateByOption('dropDownContentTemplate');

        $content.empty();

        this._popupContentId = 'dx-' + new Guid();
        this.setAria('id', this._popupContentId, $content);

        return template.render({
            container: getPublicElement($content),
            model: this.option('items') || this._dataSource
        });
    },

    _popupOptions() {
        const horizontalAlignment = this.option('rtlEnabled') ? 'right' : 'left';
        return extend({
            dragEnabled: false,
            focusStateEnabled: false,
            deferRendering: this.option('deferRendering'),
            closeOnOutsideClick: (e) => {
                const $element = this.$element();
                const $buttonClicked = $(e.target).closest(`.${DROP_DOWN_BUTTON_CLASS}`);
                return !$buttonClicked.is($element);
            },
            showTitle: false,
            animation: {
                show: { type: 'fade', duration: 0, from: 0, to: 1 },
                hide: { type: 'fade', duration: 400, from: 1, to: 0 }
            },
            width: () => getElementWidth(this.$element()),
            height: 'auto',
            shading: false,
            position: {
                of: this.$element(),
                collision: 'flipfit',
                my: 'top ' + horizontalAlignment,
                at: 'bottom ' + horizontalAlignment
            }
        }, this._options.cache('dropDownOptions'), { visible: this.option('opened') });
    },

    _listOptions() {
        const selectedItemKey = this.option('selectedItemKey');
        const useSelectMode = this.option('useSelectMode');
        return {
            selectionMode: useSelectMode ? 'single' : 'none',
            wrapItemText: this.option('wrapItemText'),
            focusStateEnabled: this.option('focusStateEnabled'),
            hoverStateEnabled: this.option('hoverStateEnabled'),
            showItemDataTitle: true,
            onContentReady: () => this._fireContentReadyAction(),
            selectedItemKeys: selectedItemKey && useSelectMode ? [selectedItemKey] : [],
            grouped: this.option('grouped'),
            groupTemplate: this.option('groupTemplate'),
            keyExpr: this._getKey(),
            noDataText: this.option('noDataText'),
            displayExpr: this.option('displayExpr'),
            itemTemplate: this.option('itemTemplate'),
            items: this.option('items'),
            dataSource: this._dataSource,
            onItemClick: (e) => {
                if(!this.option('useSelectMode')) {
                    this._lastSelectedItemData = e.itemData;
                }
                this.option('selectedItemKey', this._keyGetter(e.itemData));
                const actionResult = this._fireItemClickAction(e);
                if(actionResult !== false) {
                    this.toggle(false);
                    this._buttonGroup.focus();
                }
            }
        };
    },

    _upDownKeyHandler() {
        if(this._popup && this._popup.option('visible') && this._list) {
            this._list.focus();
        } else {
            this.open();
        }
    },

    _escHandler() {
        this.close();
        this._buttonGroup.focus();
    },

    _renderPopup() {
        const $popup = $('<div>');
        this.$element().append($popup);
        this._popup = this._createComponent($popup, Popup, this._popupOptions());
        this._popup.$content().addClass(DROP_DOWN_BUTTON_CONTENT);
        this._popup._wrapper().addClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS);
        this._popup.on('hiding', this._popupHidingHandler.bind(this));
        this._popup.on('showing', this._popupShowingHandler.bind(this));
        this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
    },

    _popupHidingHandler() {
        this.option('opened', false);
        this.setAria({
            expanded: false,
            owns: undefined
        });
    },

    _popupOptionChanged: function(args) {
        const options = Widget.getOptionsFromContainer(args);

        this._setPopupOption(options);

        const optionsKeys = Object.keys(options);
        if(optionsKeys.indexOf('width') !== -1 || optionsKeys.indexOf('height') !== -1) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        const popupWidth = getSizeValue(this.option('dropDownOptions.width'));

        if(popupWidth === undefined) {
            this._setPopupOption('width', () => getElementWidth(this.$element()));
        }
    },

    _setPopupOption: function(optionName, value) {
        this._setWidgetOption('_popup', arguments);
    },

    _popupShowingHandler() {
        this.option('opened', true);
        this.setAria({
            expanded: true,
            owns: this._popupContentId
        });
    },

    _renderButtonGroup() {
        const $buttonGroup = (this._buttonGroup && this._buttonGroup.$element()) || $('<div>');
        if(!this._buttonGroup) {
            this.$element().append($buttonGroup);
        }

        this._buttonGroup = this._createComponent($buttonGroup, ButtonGroup, this._buttonGroupOptions());

        this._buttonGroup.registerKeyHandler('downArrow', this._upDownKeyHandler.bind(this));
        this._buttonGroup.registerKeyHandler('tab', this.close.bind(this));
        this._buttonGroup.registerKeyHandler('upArrow', this._upDownKeyHandler.bind(this));
        this._buttonGroup.registerKeyHandler('escape', this._escHandler.bind(this));

        this._bindInnerWidgetOptions(this._buttonGroup, 'buttonGroupOptions');
    },

    _updateArrowClass() {
        const hasArrow = this.option('splitButton') || this.option('showArrowIcon');
        this.$element().toggleClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS, hasArrow);
    },

    toggle(visible) {
        if(!this._popup) {
            this._renderPopup();
            this._renderContent();
        }
        return this._popup.toggle(visible);
    },

    open() {
        return this.toggle(true);
    },

    close() {
        return this.toggle(false);
    },

    _setListOption(name, value) {
        this._list && this._list.option(name, value);
    },

    _getDisplayValue(item) {
        const isPrimitiveItem = !isPlainObject(item);
        const displayValue = isPrimitiveItem ? item : this._displayGetter(item);
        return !isPlainObject(displayValue) ? String(ensureDefined(displayValue, '')) : '';
    },

    _updateActionButton(selectedItem) {
        if(this.option('useSelectMode')) {
            this.option({
                text: this._getDisplayValue(selectedItem),
                icon: isPlainObject(selectedItem) ? selectedItem.icon : undefined
            });
        }

        this._setOptionWithoutOptionChange('selectedItem', selectedItem);
        this._setOptionWithoutOptionChange('selectedItemKey', this._keyGetter(selectedItem));
    },

    _clean() {
        this._list && this._list.$element().remove();
        this._popup && this._popup.$element().remove();
    },

    _selectedItemKeyChanged(value) {
        this._setListOption('selectedItemKeys', this.option('useSelectMode') && isDefined(value) ? [value] : []);
        const previousItem = this.option('selectedItem');
        this._loadSelectedItem().done((selectedItem) => {
            this._updateActionButton(selectedItem);

            if(this._displayGetter(previousItem) !== this._displayGetter(selectedItem)) {
                this._fireSelectionChangedAction({
                    previousValue: previousItem,
                    value: selectedItem
                });
            }
        });
    },

    _actionButtonOptionChanged({ name, value }) {
        const newConfig = {};
        newConfig[name] = value;
        this._buttonGroup.option('items[0]', extend({}, this._actionButtonConfig(), newConfig));
        this._popup && this._popup.repaint();
    },

    _selectModeChanged(value) {
        if(value) {
            this._setListOption('selectionMode', 'single');
            const selectedItemKey = this.option('selectedItemKey');
            this._setListOption('selectedItemKeys', selectedItemKey ? [selectedItemKey] : []);
        } else {
            this._setListOption('selectionMode', 'none');
            this.option({
                'selectedItemKey': undefined,
                'selectedItem': undefined
            });
        }
    },

    _updateItemCollection(optionName) {
        const selectedItemKey = this.option('selectedItemKey');
        this._setListOption('selectedItem', null);
        this._setWidgetOption('_list', [optionName]);

        if(isDefined(selectedItemKey)) {
            this._loadSelectedItem()
                .done(selectedItem => {
                    this._setListOption('selectedItemKeys', [selectedItemKey]);
                    this._setListOption('selectedItem', selectedItem);
                }).fail(error => {
                    this._setListOption('selectedItemKeys', []);
                })
                .always(this._updateActionButton.bind(this));
        }
    },

    _updateDataSource: function(items = this._dataSource.items()) {
        this._dataSource = undefined;
        this._itemsToDataSource(items);
        this._updateKeyExpr();
    },

    _updateKeyExpr: function() {
        this._compileKeyGetter();
        this._setListOption('keyExpr', this._getKey());
    },

    _optionChanged(args) {
        const { name, value } = args;
        switch(name) {
            case 'useSelectMode':
                this._selectModeChanged(value);
                break;
            case 'splitButton':
                this._updateArrowClass();
                this._renderButtonGroup();
                break;
            case 'displayExpr':
                this._compileDisplayGetter();
                this._setListOption(name, value);
                this._updateActionButton(this.option('selectedItem'));
                break;
            case 'keyExpr':
                this._updateDataSource();
                break;
            case 'buttonGroupOptions':
                this._innerWidgetOptionChanged(this._buttonGroup, args);
                break;
            case 'dropDownOptions':
                if(args.fullName === 'dropDownOptions.visible') {
                    break;
                }
                if(args.value.visible !== undefined) {
                    delete args.value.visible;
                }
                this._popupOptionChanged(args);
                this._innerWidgetOptionChanged(this._popup, args);
                break;
            case 'opened':
                this.toggle(value);
                break;
            case 'focusStateEnabled':
            case 'hoverStateEnabled':
                this._setListOption(name, value);
                this._buttonGroup.option(name, value);
                this.callBase(args);
                break;
            case 'items':
                this._updateDataSource(this.option('items'));
                this._updateItemCollection(name);
                break;
            case 'dataSource':
                if(Array.isArray(value)) {
                    this._updateDataSource(this.option('dataSource'));
                } else {
                    this._initDataSource();
                    this._updateKeyExpr();
                }
                this._updateItemCollection(name);
                break;
            case 'icon':
            case 'text':
                this._actionButtonOptionChanged(args);
                break;
            case 'showArrowIcon':
                this._updateArrowClass();
                this._buttonGroup.repaint();
                this._popup && this._popup.repaint();
                break;
            case 'width':
            case 'height':
                this.callBase(args);
                this._popup?.repaint();
                break;
            case 'stylingMode':
                this._buttonGroup.option(name, value);
                break;
            case 'itemTemplate':
            case 'grouped':
            case 'noDataText':
            case 'groupTemplate':
            case 'wrapItemText':
                this._setListOption(name, value);
                break;
            case 'dropDownContentTemplate':
                this._renderContent();
                break;
            case 'selectedItemKey':
                this._selectedItemKeyChanged(value);
                break;
            case 'selectedItem':
                break;
            case 'onItemClick':
                this._createItemClickAction();
                break;
            case 'onButtonClick':
                this._createActionClickAction();
                break;
            case 'onSelectionChanged':
                this._createSelectionChangedAction();
                break;
            case 'deferRendering':
                this.toggle(this.option('opened'));
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataHelperMixin);

registerComponent('dxDropDownButton', DropDownButton);
export default DropDownButton;
