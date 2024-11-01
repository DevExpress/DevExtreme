import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { name as clickEventName } from '@js/events/click';
import eventsEngine from '@js/events/core/events_engine';
import { addNamespace } from '@js/events/utils/index';
import messageLocalization from '@js/localization/message';
import CheckBox from '@js/ui/check_box';
import RadioButton from '@js/ui/radio_group/radio_button';
import errors from '@js/ui/widget/ui.errors';

import EditDecorator from './m_list.edit.decorator';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

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

    _init() {
      this.callBase.apply(this, arguments);

      const selectionMode = this._list.option('selectionMode');

      this._singleStrategy = selectionMode === 'single';
      this._containerClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CONTAINER_CLASS : SELECT_CHECKBOX_CONTAINER_CLASS;
      this._controlClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CLASS : SELECT_CHECKBOX_CLASS;

      this._controlWidget = this._singleStrategy ? RadioButton : CheckBox;

      this._list.$element().addClass(SELECT_DECORATOR_ENABLED_CLASS);
    },

    beforeBag(config) {
      const { $itemElement } = config;
      const $container = config.$container.addClass(this._containerClass);

      const $control = $('<div>')
        .addClass(this._controlClass)
        .appendTo($container);
      // eslint-disable-next-line no-new
      new this._controlWidget($control, extend(this._commonOptions(), {
        value: this._isSelected($itemElement),
        elementAttr: { 'aria-label': messageLocalization.format('CheckState') },
        focusStateEnabled: false,
        hoverStateEnabled: false,
        onValueChanged: function (e) {
          e.event && this._list._saveSelectionChangeEvent(e.event);
          this._processCheckedState($itemElement, e.value);
          e.event && e.event.stopPropagation();
        }.bind(this),
      }));
    },

    modifyElement(config) {
      this.callBase.apply(this, arguments);

      const { $itemElement } = config;
      const control = this._controlWidget.getInstance($itemElement.find(`.${this._controlClass}`));

      eventsEngine.on($itemElement, 'stateChanged', (e, state) => {
        control.option('value', state);
      });
    },

    _updateSelectAllState() {
      if (!this._$selectAll) {
        return;
      }

      this._selectAllCheckBox.option('value', this._list.isSelectAll());
    },

    afterRender() {
      if (this._list.option('selectionMode') !== 'all') {
        return;
      }

      if (!this._$selectAll) {
        this._renderSelectAll();
      } else {
        this._updateSelectAllState();
      }
    },

    handleKeyboardEvents(currentFocusedIndex, moveFocusUp) {
      const moveFocusDown = !moveFocusUp;
      const list = this._list;
      const $selectAll = this._$selectAll;
      const lastItemIndex = list._getLastItemIndex();
      const isFocusOutOfList = moveFocusUp && currentFocusedIndex === 0
                || moveFocusDown && currentFocusedIndex === lastItemIndex;
      const hasSelectAllItem = !!$selectAll;

      if (hasSelectAllItem && isFocusOutOfList) {
        list.option('focusedElement', $selectAll);
        list.scrollToItem(list.option('focusedElement'));

        return true;
      }

      return false;
    },
    // @ts-expect-error
    handleEnterPressing(e) {
      if (this._$selectAll && this._$selectAll.hasClass(FOCUSED_STATE_CLASS)) {
        e.target = this._$selectAll.get(0);
        this._list._saveSelectionChangeEvent(e);
        this._selectAllCheckBox.option('value', !this._selectAllCheckBox.option('value'));
        return true;
      }
    },

    _renderSelectAll() {
      const $selectAll = this._$selectAll = $('<div>').addClass(SELECT_DECORATOR_SELECT_ALL_CLASS);
      const list = this._list;
      const downArrowHandler = list._supportedKeys().downArrow.bind(list);

      this._selectAllCheckBox = list._createComponent(
        $('<div>')
          .addClass(SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS)
          .appendTo($selectAll),
        CheckBox,
        {
          elementAttr: { 'aria-label': 'Select All' },
          focusStateEnabled: false,
          hoverStateEnabled: false,
        },
      );

      this._selectAllCheckBox.registerKeyHandler('downArrow', downArrowHandler);

      $('<div>').addClass(SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS)
        .text(this._list.option('selectAllText'))
        .appendTo($selectAll);

      this._list.itemsContainer().prepend($selectAll);

      this._updateSelectAllState();
      this._attachSelectAllHandler();
    },

    _attachSelectAllHandler() {
      this._selectAllCheckBox.option('onValueChanged', this._selectAllHandler.bind(this));

      eventsEngine.off(this._$selectAll, CLICK_EVENT_NAME);
      eventsEngine.on(this._$selectAll, CLICK_EVENT_NAME, this._selectAllClickHandler.bind(this));
    },

    _selectAllHandler(e) {
      e.event && e.event.stopPropagation();

      const isSelectedAll = this._selectAllCheckBox.option('value');

      e.event && this._list._saveSelectionChangeEvent(e.event);
      if (isSelectedAll === true) {
        this._selectAllItems();
      } else if (isSelectedAll === false) {
        this._unselectAllItems();
      }

      this._list._createActionByOption('onSelectAllValueChanged')({ value: isSelectedAll });
    },

    _checkSelectAllCapability() {
      const list = this._list;
      const dataController = list._dataController;

      if (list.option('selectAllMode') === 'allPages' && list.option('grouped') && !dataController.group()) {
        errors.log('W1010');
        return false;
      }
      return true;
    },

    _selectAllItems() {
      if (!this._checkSelectAllCapability()) return;

      this._list._selection.selectAll(this._list.option('selectAllMode') === 'page');
    },

    _unselectAllItems() {
      if (!this._checkSelectAllCapability()) return;

      this._list._selection.deselectAll(this._list.option('selectAllMode') === 'page');
    },

    _selectAllClickHandler(e) {
      this._list._saveSelectionChangeEvent(e);
      this._selectAllCheckBox.option('value', !this._selectAllCheckBox.option('value'));
    },

    _isSelected($itemElement) {
      return this._list.isItemSelected($itemElement);
    },

    _processCheckedState($itemElement, checked) {
      if (checked) {
        this._list.selectItem($itemElement);
      } else {
        this._list.unselectItem($itemElement);
      }
    },

    dispose() {
      this._disposeSelectAll();
      this._list.$element().removeClass(SELECT_DECORATOR_ENABLED_CLASS);
      this.callBase.apply(this, arguments);
    },

    _disposeSelectAll() {
      if (this._$selectAll) {
        this._$selectAll.remove();
        this._$selectAll = null;
      }
    },
  }),
);
