import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred, type DeferredObj } from '@js/core/utils/deferred';
import type { DxEvent } from '@js/events';
import type { ValueChangedEvent as CheckBoxValueChangedEvent } from '@js/ui/check_box';
import CheckBox from '@js/ui/check_box';
import errors from '@js/ui/widget/ui.errors';
import type Editor from '@ts/ui/editor/editor';
import type { BagConfig } from '@ts/ui/list/list.edit.decorator';
import EditDecorator from '@ts/ui/list/list.edit.decorator';
import { register as registerDecorator } from '@ts/ui/list/list.edit.decorator_registry';
import RadioButton from '@ts/ui/radio_group/m_radio_button';

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

class EditDecoratorSelection extends EditDecorator {
  _$selectAll?: dxElementWrapper | null;

  _singleStrategy?: boolean;

  _containerClass!: string;

  _controlClass!: string;

  _controlWidget!: typeof RadioButton | typeof CheckBox;

  _selectAllCheckBox?: CheckBox;

  _init(): void {
    super._init();

    const { selectionMode } = this._list.option();

    this._singleStrategy = selectionMode === 'single';
    this._containerClass = this._singleStrategy
      ? SELECT_RADIO_BUTTON_CONTAINER_CLASS
      : SELECT_CHECKBOX_CONTAINER_CLASS;
    this._controlClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CLASS : SELECT_CHECKBOX_CLASS;

    this._controlWidget = this._singleStrategy ? RadioButton : CheckBox;

    this._list.$element().addClass(SELECT_DECORATOR_ENABLED_CLASS);
  }

  beforeBag(config: BagConfig): void {
    const { $itemElement } = config;
    const $container = config.$container.addClass(this._containerClass);

    const $control = $('<div>')
      .addClass(this._controlClass)
      .appendTo($container);
    // eslint-disable-next-line no-new
    new this._controlWidget($control.get(0), {
      ...this._commonOptions(),
      value: this._isSelected($itemElement.get(0)),
      elementAttr: { 'aria-label': messageLocalization.format('CheckState') },
      focusStateEnabled: false,
      hoverStateEnabled: false,
      onValueChanged: (e): void => {
        const { value, component, event } = e;
        const isUiClick = !!event;
        if (isUiClick) {
          (component as Editor)._valueChangeEventInstance = undefined;
          component.option('value', !value);
        }
      },
    });
  }

  modifyElement(config: BagConfig): void {
    super.modifyElement(config);

    const { $itemElement } = config;
    const control = this._controlWidget.getInstance($itemElement.find(`.${this._controlClass}`).get(0));

    eventsEngine.on($itemElement, 'stateChanged', (_e: DxEvent, state: boolean): void => {
      control.option('value', state);
    });
  }

  _updateSelectAllState(): void {
    if (!this._$selectAll) {
      return;
    }

    this._selectAllCheckBox?.option('value', this._list.isSelectAll());
  }

  afterRender(): void {
    const { selectionMode } = this._list.option();

    if (selectionMode !== 'all') {
      return;
    }

    if (!this._$selectAll) {
      this._renderSelectAll();
    } else {
      this._updateSelectAllState();
    }
  }

  handleKeyboardEvents(currentFocusedIndex: number, moveFocusUp: boolean | undefined): boolean {
    const moveFocusDown = !moveFocusUp;
    const list = this._list;
    const $selectAll = this._$selectAll;
    const lastItemIndex = list._getLastItemIndex();
    const isFocusOutOfList = (moveFocusUp && currentFocusedIndex === 0)
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || (moveFocusDown && currentFocusedIndex === lastItemIndex);
    const hasSelectAllItem = !!$selectAll;

    if (hasSelectAllItem && isFocusOutOfList) {
      list.option('focusedElement', getPublicElement($selectAll));

      const { focusedElement } = list.option();

      if (focusedElement) {
        list.scrollToItem(focusedElement);
      }

      return true;
    }

    return false;
  }

  handleEnterPressing(e: DxEvent<KeyboardEvent>): boolean {
    if (this._$selectAll?.hasClass(FOCUSED_STATE_CLASS)) {
      e.target = this._$selectAll.get(0);
      this._selectAllHandler(e);
      return true;
    }
    return false;
  }

  _renderSelectAll(): void {
    this._$selectAll = $('<div>').addClass(SELECT_DECORATOR_SELECT_ALL_CLASS);

    const downArrowHandler = this._list._supportedKeys().downArrow.bind(this._list);

    const selectAllCheckBoxElement = $('<div>')
      .addClass(SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS)
      .appendTo(this._$selectAll);

    this._selectAllCheckBox = this._list._createComponent(
      selectAllCheckBoxElement,
      CheckBox,
      {
        elementAttr: { 'aria-label': messageLocalization.format('dxList-selectAll') },
        focusStateEnabled: false,
        hoverStateEnabled: false,
      },
    );

    this._selectAllCheckBox.registerKeyHandler('downArrow', downArrowHandler);

    const { selectAllText = '' } = this._list.option();

    $('<div>').addClass(SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS)
      .text(selectAllText)
      .appendTo(this._$selectAll);

    this._list.itemsContainer().prepend(this._$selectAll);

    this._updateSelectAllState();
    this._updateSelectAllAriaLabel();
    this._attachSelectAllHandler();
  }

  _attachSelectAllHandler(): void {
    this._selectAllCheckBox?.option('onValueChanged', (e: CheckBoxValueChangedEvent): void => {
      const { value, component, event } = e;
      const isUiClick = !!event;
      if (isUiClick) {
        // @ts-expect-error ts-error
        component._setOptionWithoutOptionChange('value', !value);
        return;
      }

      this._updateSelectAllAriaLabel();
      this._list._createActionByOption('onSelectAllValueChanged')({ value });
    });

    eventsEngine.off(this._$selectAll, CLICK_EVENT_NAME);
    eventsEngine.on(this._$selectAll, CLICK_EVENT_NAME, (e) => {
      this._selectAllHandler(e);
    });
  }

  _updateSelectAllAriaLabel(): void {
    if (!this._$selectAll) {
      return;
    }

    const { value } = this._selectAllCheckBox?.option() ?? {};

    const indeterminate = value === undefined;
    const checkedState = value ? 'checked' : 'notChecked';

    const stateVariableName = indeterminate ? 'indeterminate' : checkedState;

    const label = `${messageLocalization.format('dxList-selectAll')}, ${messageLocalization.format(`dxList-selectAll-${stateVariableName}`)}`;
    // @ts-expect-error ts-error
    this._$selectAll.attr({ 'aria-label': label });
  }

  _selectAllHandler(event: DxEvent<KeyboardEvent>): DeferredObj<unknown> {
    event.stopPropagation();
    event.preventDefault(); // to prevent scrolling on space key press
    this._list._saveSelectionChangeEvent(event);

    const { value } = this._selectAllCheckBox?.option() ?? {};

    const selectionDeferred = value ? this._unselectAllItems() : this._selectAllItems();

    this._list.option('focusedElement', getPublicElement($(this._$selectAll)));

    return selectionDeferred;
  }

  _checkSelectAllCapability(): boolean {
    const list = this._list;
    const dataController = list._dataController;

    const { selectAllMode, grouped } = list.option();

    if (selectAllMode === 'allPages' && grouped && !dataController.group()) {
      errors.log('W1010');
      return false;
    }
    return true;
  }

  _selectAllItems(): DeferredObj<unknown> {
    if (!this._checkSelectAllCapability()) return Deferred().resolve();

    const { selectAllMode } = this._list.option();

    return this._list._selection.selectAll(selectAllMode === 'page');
  }

  _unselectAllItems(): DeferredObj<unknown> {
    if (!this._checkSelectAllCapability()) return Deferred().resolve();

    const { selectAllMode } = this._list.option();

    return this._list._selection.deselectAll(selectAllMode === 'page');
  }

  _isSelected(itemElement: Element): boolean {
    return this._list.isItemSelected(itemElement);
  }

  dispose(): void {
    this._disposeSelectAll();
    this._list.$element().removeClass(SELECT_DECORATOR_ENABLED_CLASS);
    super.dispose();
  }

  _disposeSelectAll(): void {
    if (this._$selectAll) {
      this._$selectAll.remove();
      this._$selectAll = null;
    }
  }
}

registerDecorator(
  'selection',
  'default',
  EditDecoratorSelection,
);
