import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import devices from '../../core/devices';
import { deferRender } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import * as inkRipple from '../widget/utils.ink_ripple';
import registerComponent from '../../core/component_registrator';
import CollectionWidget from '../collection/ui.collection_widget.edit';
import DataExpressionMixin from '../editor/ui.data_expression';
import Editor from '../editor/editor';
import { Deferred } from '../../core/utils/deferred';

// STYLE radioGroup

const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_GROUP_HORIZONTAL_CLASS = 'dx-radiogroup-horizontal';
const RADIO_GROUP_VERTICAL_CLASS = 'dx-radiogroup-vertical';
const RADIO_VALUE_CONTAINER_CLASS = 'dx-radio-value-container';
const RADIO_GROUP_CLASS = 'dx-radiogroup';

const RADIO_FEEDBACK_HIDE_TIMEOUT = 100;

class RadioCollection extends CollectionWidget {
    _focusTarget() {
        return this.$element().parent();
    }

    _nullValueSelectionSupported() {
        return true;
    }

    _getDefaultOptions() {
        const defaultOptions = super._getDefaultOptions();

        return extend(defaultOptions, DataExpressionMixin._dataExpressionDefaultOptions(), {
            _itemAttributes: { role: 'radio' }
        });
    }

    _initMarkup() {
        super._initMarkup();

        deferRender(() => {
            this.itemElements().addClass(RADIO_BUTTON_CLASS);
        });
    }

    _keyboardEventBindingTarget() {
        return this._focusTarget();
    }

    _postprocessRenderItem(args) {
        const { itemData: { html }, itemElement } = args;

        if(!html) {
            const $radio = $('<div>').addClass(RADIO_BUTTON_ICON_CLASS);

            $('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo($radio);

            const $radioContainer = $('<div>').append($radio).addClass(RADIO_VALUE_CONTAINER_CLASS);

            $(itemElement).prepend($radioContainer);
        }

        super._postprocessRenderItem(args);
    }

    _processSelectableItem($itemElement, isSelected) {
        super._processSelectableItem($itemElement, isSelected);

        $itemElement
            .toggleClass(RADIO_BUTTON_CHECKED_CLASS, isSelected)
            .find(`.${RADIO_BUTTON_ICON_CLASS}`)
            .first()
            .toggleClass(RADIO_BUTTON_ICON_CHECKED_CLASS, isSelected);

        this.setAria('checked', isSelected, $itemElement);
    }

    _refreshContent() {
        this._prepareContent();
        this._renderContent();
    }

    _supportedKeys() {
        const parent = super._supportedKeys();

        return extend({}, parent, {
            enter: function(e) {
                e.preventDefault();

                return parent.enter.apply(this, arguments);
            },

            space: function(e) {
                e.preventDefault();

                return parent.space.apply(this, arguments);
            }
        });
    }

    _itemElements() {
        return this._itemContainer().children(this._itemSelector());
    }
}

class RadioGroup extends Editor {
    _clean() {
        delete this._inkRipple;
        super._clean();
    }

    _dataSourceOptions() {
        return { paginate: false };
    }

    _defaultOptionsRules() {
        const defaultOptionsRules = super._defaultOptionsRules();

        return defaultOptionsRules.concat([{
            device: { tablet: true },
            options: {
                layout: 'horizontal'
            }
        }, {
            device: () => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
            options: {
                focusStateEnabled: true
            }
        }]);
    }

    _fireContentReadyAction(force) {
        force && super._fireContentReadyAction();
    }

    _focusTarget() {
        return this.$element();
    }

    _getAriaTarget() {
        return this.$element();
    }

    _getDefaultOptions() {
        const defaultOptions = super._getDefaultOptions();

        return extend(defaultOptions, extend(DataExpressionMixin._dataExpressionDefaultOptions(), {

            hoverStateEnabled: true,

            activeStateEnabled: true,

            layout: 'vertical',

            useInkRipple: false


        }));
    }

    _getItemValue(item) {
        return this._valueGetter ? this._valueGetter(item) : item.text;
    }

    _getSubmitElement() {
        return this._$submitElement;
    }

    _init() {
        super._init();
        this._activeStateUnit = `.${RADIO_BUTTON_CLASS}`;
        this._feedbackHideTimeout = RADIO_FEEDBACK_HIDE_TIMEOUT;
        this._initDataExpressions();
    }

    _initMarkup() {
        this.$element().addClass(RADIO_GROUP_CLASS);
        this._renderSubmitElement();
        this.setAria('role', 'radiogroup');
        this._renderRadios();
        this.option('useInkRipple') && this._renderInkRipple();
        this._renderLayout();
        super._initMarkup();
    }

    _itemClickHandler({ itemElement, event, itemData }) {
        if(this.itemElements().is(itemElement)) {
            const newValue = this._getItemValue(itemData);

            if(newValue !== this.option('value')) {
                this._saveValueChangeEvent(event);
                this.option('value', newValue);
            }
        }
    }

    _setSelection(currentValue) {
        this._setCollectionWidgetOption('selectedItemKeys', [this._unwrappedValue(currentValue)]);
    }

    _optionChanged(args) {
        const { name, value } = args;

        this._dataExpressionOptionChanged(args);

        switch(name) {
            case 'useInkRipple':
            case 'dataSource':
                this._invalidate();
                break;
            case 'focusStateEnabled':
            case 'accessKey':
            case 'tabIndex':
                this._setCollectionWidgetOption(name, value);
                break;
            case 'disabled':
                super._optionChanged(args);
                this._setCollectionWidgetOption(name, value);
                break;
            case 'valueExpr':
                this._setCollectionWidgetOption('keyExpr', this._getCollectionKeyExpr());
                break;
            case 'value':
                this._setSelection(value);
                this._setSubmitValue(value);
                super._optionChanged(args);
                break;
            case 'items':
                this._setSelection(this.option('value'));
                break;
            case 'itemTemplate':
            case 'displayExpr':
                break;
            case 'layout':
                this._renderLayout();
                this._updateItemsSize();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _render() {
        super._render();
        this._updateItemsSize();
    }

    _renderInkRipple() {
        this._inkRipple = inkRipple.render({
            waveSizeCoefficient: 3.3,
            useHoldAnimation: false,
            isCentered: true
        });
    }

    _renderLayout() {
        const layout = this.option('layout');
        const $element = this.$element();

        $element.toggleClass(RADIO_GROUP_VERTICAL_CLASS, layout === 'vertical');
        $element.toggleClass(RADIO_GROUP_HORIZONTAL_CLASS, layout === 'horizontal');
    }

    _renderRadios() {
        this._areRadiosCreated = new Deferred();
        const $radios = $('<div>').appendTo(this.$element());
        const {
            value,
            displayExpr,
            accessKey,
            focusStateEnabled,
            itemTemplate,
            tabIndex,
            valueExpr
        } = this.option();
        const isNullSelectable = valueExpr !== 'this';

        this._createComponent($radios, RadioCollection, {
            onInitialized: ({ component }) => {
                this._radios = component;
            },
            onContentReady: (e) => {
                this._fireContentReadyAction(true);
            },
            onItemClick: this._itemClickHandler.bind(this),
            displayExpr,
            accessKey,
            dataSource: this._dataSource,
            focusStateEnabled,
            itemTemplate,
            keyExpr: this._getCollectionKeyExpr(),
            noDataText: '',
            scrollingEnabled: false,
            selectionByClick: false,
            selectionMode: 'single',
            selectedItemKeys: isNullSelectable || isDefined(value) ? [value] : [],
            tabIndex
        });
        this._areRadiosCreated.resolve();
    }

    _renderSubmitElement() {
        this._$submitElement = $('<input>')
            .attr('type', 'hidden')
            .appendTo(this.$element());

        this._setSubmitValue();
    }

    _setOptionsByReference() {
        super._setOptionsByReference();
        extend(this._optionsByReference, { value: true });
    }

    _setSubmitValue(value) {
        value = value || this.option('value');

        const submitValue = this.option('valueExpr') === 'this' ? this._displayGetter(value) : value;

        this._$submitElement.val(submitValue);
    }

    _setCollectionWidgetOption() {
        this._areRadiosCreated.done(this._setWidgetOption.bind(this, '_radios', arguments));
    }

    _toggleActiveState($element, value, e) {
        super._toggleActiveState($element, value, e);

        if(this._inkRipple) {
            const event = {
                element: $element.find(`.${RADIO_BUTTON_ICON_CLASS}`),
                event: e
            };

            value ? this._inkRipple.showWave(event) : this._inkRipple.hideWave(event);
        }
    }

    _updateItemsSize() {
        if(this.option('layout') === 'horizontal') {
            this.itemElements().css('height', 'auto');
        } else {
            const itemsCount = this.option('items').length;

            this.itemElements().css('height', 100 / itemsCount + '%');
        }
    }

    focus() {
        this._radios?.focus();
    }

    itemElements() {
        return this._radios?.itemElements();
    }
}

RadioGroup.include(DataExpressionMixin);

registerComponent('dxRadioGroup', RadioGroup);

export default RadioGroup;
