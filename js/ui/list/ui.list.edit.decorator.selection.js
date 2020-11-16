import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { name as clickEventName } from '../../events/click';
import { extend } from '../../core/utils/extend';
import errors from '../widget/ui.errors';
import CheckBox from '../check_box';
import RadioButton from '../radio_group/radio_button';
import { addNamespace } from '../../events/utils/index';
import { register as registerDecorator } from './ui.list.edit.decorator_registry';
import EditDecorator from './ui.list.edit.decorator';


const SELECT_DECORATOR_ENABLED_CLASS = 'dx-list-select-decorator-enabled';

const SELECT_DECORATOR_SELECT_ALL_CLASS = 'dx-list-select-all';
const SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS = 'dx-list-select-all-checkbox';
const SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS = 'dx-list-select-all-label';

const SELECT_CHECKBOX_CONTAINER_CLASS = 'dx-list-select-checkbox-container';
const SELECT_CHECKBOX_CLASS = 'dx-list-select-checkbox';

const SELECT_RADIO_BUTTON_CONTAINER_CLASS = 'dx-list-select-radiobutton-container';
const SELECT_RADIO_BUTTON_CLASS = 'dx-list-select-radiobutton';

const FOCUSED_STATE_CLASS = 'dx-state-focused';

const CLICK_EVENT_NAME = addNamespace(clickEventName, 'dxListEditDecorator');

registerDecorator(
    'selection',
    'default',
    EditDecorator.inherit({

        _init: function() {
            this.callBase.apply(this, arguments);

            const selectionMode = this._list.option('selectionMode');

            this._singleStrategy = selectionMode === 'single';
            this._containerClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CONTAINER_CLASS : SELECT_CHECKBOX_CONTAINER_CLASS;
            this._controlClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CLASS : SELECT_CHECKBOX_CLASS;

            this._controlWidget = this._singleStrategy ? RadioButton : CheckBox;

            this._list.$element().addClass(SELECT_DECORATOR_ENABLED_CLASS);
        },

        beforeBag: function(config) {
            const $itemElement = config.$itemElement;
            const $container = config.$container.addClass(this._containerClass);

            const $control = $('<div>')
                .addClass(this._controlClass)
                .appendTo($container);
            new this._controlWidget($control, extend(this._commonOptions(), {
                value: this._isSelected($itemElement),
                focusStateEnabled: false,
                hoverStateEnabled: false,
                onValueChanged: (function(e) {
                    e.event && this._list._saveSelectionChangeEvent(e.event);
                    this._processCheckedState($itemElement, e.value);
                    e.event && e.event.stopPropagation();
                }).bind(this)
            }));
        },

        modifyElement: function(config) {
            this.callBase.apply(this, arguments);

            const $itemElement = config.$itemElement;
            const control = this._controlWidget.getInstance($itemElement.find('.' + this._controlClass));

            eventsEngine.on($itemElement, 'stateChanged', (function(e, state) {
                control.option('value', state);
            }).bind(this));
        },

        _updateSelectAllState: function() {
            if(!this._$selectAll) {
                return;
            }

            this._selectAllCheckBox.option('value', this._list.isSelectAll());
        },

        afterRender: function() {
            if(this._list.option('selectionMode') !== 'all') {
                return;
            }

            if(!this._$selectAll) {
                this._renderSelectAll();
            } else {
                this._updateSelectAllState();
            }
        },

        handleKeyboardEvents: function(currentFocusedIndex, moveFocusUp) {
            const moveFocusDown = !moveFocusUp;
            const list = this._list;
            const $selectAll = this._$selectAll;
            const lastItemIndex = list._getLastItemIndex();
            const isFocusOutOfList = moveFocusUp && currentFocusedIndex === 0 ||
                moveFocusDown && currentFocusedIndex === lastItemIndex;
            const hasSelectAllItem = !!$selectAll;

            if(hasSelectAllItem && isFocusOutOfList) {
                list.option('focusedElement', $selectAll);
                list.scrollToItem(list.option('focusedElement'));

                return true;
            }

            return false;
        },

        handleEnterPressing: function() {
            if(this._$selectAll && this._$selectAll.hasClass(FOCUSED_STATE_CLASS)) {
                this._selectAllCheckBox.option('value', !this._selectAllCheckBox.option('value'));
                return true;
            }
        },

        _renderSelectAll: function() {
            const $selectAll = this._$selectAll = $('<div>').addClass(SELECT_DECORATOR_SELECT_ALL_CLASS);
            const list = this._list;
            const downArrowHandler = list._supportedKeys().downArrow.bind(list);

            this._selectAllCheckBox = list._createComponent(
                $('<div>')
                    .addClass(SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS)
                    .appendTo($selectAll),
                CheckBox, {
                    focusStateEnabled: false,
                    hoverStateEnabled: false
                }
            );

            this._selectAllCheckBox.registerKeyHandler('downArrow', downArrowHandler);

            $('<div>').addClass(SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS)
                .text(this._list.option('selectAllText'))
                .appendTo($selectAll);

            this._list.itemsContainer().prepend($selectAll);

            this._updateSelectAllState();
            this._attachSelectAllHandler();
        },

        _attachSelectAllHandler: function() {
            this._selectAllCheckBox.option('onValueChanged', this._selectAllHandler.bind(this));

            eventsEngine.off(this._$selectAll, CLICK_EVENT_NAME);
            eventsEngine.on(this._$selectAll, CLICK_EVENT_NAME, this._selectAllClickHandler.bind(this));
        },

        _selectAllHandler: function(e) {
            e.event && e.event.stopPropagation();

            const isSelectedAll = this._selectAllCheckBox.option('value');

            const result = this._list._createActionByOption('onSelectAllValueChanged')({ value: isSelectedAll });
            if(result === false) {
                return;
            }

            e.event && this._list._saveSelectionChangeEvent(e.event);
            if(isSelectedAll === true) {
                this._selectAllItems();
            } else if(isSelectedAll === false) {
                this._unselectAllItems();
            }
        },

        _checkSelectAllCapability: function() {
            const list = this._list;
            const dataSource = list.getDataSource();

            if(list.option('selectAllMode') === 'allPages' && list.option('grouped') && (!dataSource || !dataSource.group())) {
                errors.log('W1010');
                return false;
            }
            return true;
        },

        _selectAllItems: function() {
            if(!this._checkSelectAllCapability()) return;

            this._list._selection.selectAll(this._list.option('selectAllMode') === 'page');
        },

        _unselectAllItems: function() {
            if(!this._checkSelectAllCapability()) return;

            this._list._selection.deselectAll(this._list.option('selectAllMode') === 'page');
        },

        _selectAllClickHandler: function(e) {
            this._list._saveSelectionChangeEvent(e);
            this._selectAllCheckBox.option('value', !this._selectAllCheckBox.option('value'));
        },

        _isSelected: function($itemElement) {
            return this._list.isItemSelected($itemElement);
        },

        _processCheckedState: function($itemElement, checked) {
            if(checked) {
                this._list.selectItem($itemElement);
            } else {
                this._list.unselectItem($itemElement);
            }
        },

        dispose: function() {
            this._disposeSelectAll();
            this._list.$element().removeClass(SELECT_DECORATOR_ENABLED_CLASS);
            this.callBase.apply(this, arguments);
        },

        _disposeSelectAll: function() {
            if(this._$selectAll) {
                this._$selectAll.remove();
                this._$selectAll = null;
            }
        }
    })
);
