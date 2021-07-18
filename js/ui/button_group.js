import $ from '../core/renderer';
import Widget from './widget/ui.widget';
import ButtonCollection from '../ui/button_group/button_collection';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { isDefined } from '../core/utils/type';

// STYLE buttonGroup

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_WRAPPER_CLASS = BUTTON_GROUP_CLASS + '-wrapper';
const BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + '-item';
const BUTTON_GROUP_ITEM_HAS_WIDTH = BUTTON_GROUP_ITEM_CLASS + '-has-width';

const ButtonGroup = Widget.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            hoverStateEnabled: true,
            focusStateEnabled: true,
            selectionMode: 'single',
            selectedItems: [],
            selectedItemKeys: [],
            stylingMode: 'contained',
            keyExpr: 'text',
            items: [],
            buttonTemplate: 'content',
            onSelectionChanged: null,
            onItemClick: null
        });
    },

    _init() {
        this.callBase();
        this._createItemClickAction();
    },

    _createItemClickAction() {
        this._itemClickAction = this._createActionByOption('onItemClick');
    },

    _initMarkup() {
        this.setAria('role', 'group');
        this.$element().addClass(BUTTON_GROUP_CLASS);
        this._renderButtons();
        this._syncSelectionOptions();
        this.callBase();
    },

    _fireSelectionChangeEvent: function(addedItems, removedItems) {
        this._createActionByOption('onSelectionChanged', {
            excludeValidators: ['disabled', 'readOnly']
        })({ addedItems: addedItems, removedItems: removedItems });
    },

    _renderButtons() {
        const $buttons = $('<div>')
            .addClass(BUTTON_GROUP_WRAPPER_CLASS)
            .appendTo(this.$element());

        const selectedItems = this.option('selectedItems');

        const options = {
            selectionMode: this.option('selectionMode'),
            items: this.option('items'),
            keyExpr: this.option('keyExpr'),
            buttonTemplate: this.option('buttonTemplate'),
            scrollingEnabled: false,
            selectedItemKeys: this.option('selectedItemKeys'),
            focusStateEnabled: this.option('focusStateEnabled'),
            hoverStateEnabled: this.option('hoverStateEnabled'),
            activeStateEnabled: this.option('activeStateEnabled'),
            stylingMode: this.option('stylingMode'),
            accessKey: this.option('accessKey'),
            tabIndex: this.option('tabIndex'),
            noDataText: '',
            selectionRequired: false,
            onItemRendered: e => {
                const width = this.option('width');
                isDefined(width) && $(e.itemElement).addClass(BUTTON_GROUP_ITEM_HAS_WIDTH);
            },
            onSelectionChanged: e => {
                this._syncSelectionOptions();
                this._fireSelectionChangeEvent(e.addedItems, e.removedItems);
            },
            onItemClick: e => {
                this._itemClickAction(e);
            }
        };

        if(isDefined(selectedItems) && selectedItems.length) {
            options.selectedItems = selectedItems;
        }
        this._buttonsCollection = this._createComponent($buttons, ButtonCollection, options);
    },

    _syncSelectionOptions() {
        this._setOptionWithoutOptionChange('selectedItems', this._buttonsCollection.option('selectedItems'));
        this._setOptionWithoutOptionChange('selectedItemKeys', this._buttonsCollection.option('selectedItemKeys'));
    },

    _optionChanged(args) {
        switch(args.name) {
            case 'stylingMode':
            case 'selectionMode':
            case 'keyExpr':
            case 'buttonTemplate':
            case 'items':
            case 'activeStateEnabled':
            case 'focusStateEnabled':
            case 'hoverStateEnabled':
            case 'tabIndex':
                this._invalidate();
                break;
            case 'selectedItemKeys':
            case 'selectedItems':
                this._buttonsCollection.option(args.name, args.value);
                break;
            case 'onItemClick':
                this._createItemClickAction();
                break;
            case 'onSelectionChanged':
                break;
            case 'width':
                this.callBase(args);
                this
                    ._buttonsCollection
                    .itemElements()
                    .toggleClass(BUTTON_GROUP_ITEM_HAS_WIDTH, !!args.value);
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent('dxButtonGroup', ButtonGroup);

export default ButtonGroup;
