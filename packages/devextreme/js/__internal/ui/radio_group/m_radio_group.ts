import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { ItemInfo, NativeEventInfo } from '@js/events';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { Properties } from '@js/ui/radio_group';
import type { OptionChanged } from '@ts/core/widget/types';
import type { EditorProperties, UnresolvedEvents, ValueChangedEvent } from '@ts/ui/editor/editor';
import Editor from '@ts/ui/editor/editor';

import RadioCollection from './m_radio_collection';

const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_GROUP_HORIZONTAL_CLASS = 'dx-radiogroup-horizontal';
const RADIO_GROUP_VERTICAL_CLASS = 'dx-radiogroup-vertical';
const RADIO_GROUP_CLASS = 'dx-radiogroup';

const RADIO_FEEDBACK_HIDE_TIMEOUT = 100;

interface RadioGroupProperties extends Properties,
  Omit<EditorProperties<RadioGroup>, UnresolvedEvents> {}

class RadioGroup extends Editor<RadioGroupProperties> {
  private _radios?: RadioCollection;

  private _areRadiosCreated!: DeferredObj<void>;

  private _$submitElement!: dxElementWrapper;

  _dataSourceOptions(): { paginate: boolean } {
    return { paginate: false };
  }

  protected _activeStateUnit(): string {
    return `.${RADIO_BUTTON_CLASS}`;
  }

  protected _feedbackHideTimeout(): number {
    return RADIO_FEEDBACK_HIDE_TIMEOUT;
  }

  _defaultOptionsRules(): DefaultOptionsRule<RadioGroupProperties>[] {
    const defaultOptionsRules = super._defaultOptionsRules();

    return defaultOptionsRules.concat([{
      device: { tablet: true },
      options: {
        layout: 'horizontal',
      },
    }, {
      device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
      options: {
        focusStateEnabled: true,
      },
    }]);
  }

  // @ts-expect-error widget.ts _fireContentReadyAction should accept an optional `force` parameter
  _fireContentReadyAction(force: boolean): void {
    if (!force) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    super._fireContentReadyAction();
  }

  _focusTarget(): dxElementWrapper {
    return this.$element();
  }

  _getAriaTarget(): dxElementWrapper {
    return this.$element();
  }

  _getDefaultOptions(): RadioGroupProperties {
    return {
      ...super._getDefaultOptions(),
      // @ts-expect-error DataExpressionMixin should expose _dataExpressionDefaultOptions as a
      // typed static method
      ...DataExpressionMixin._dataExpressionDefaultOptions(),
      hoverStateEnabled: true,
      activeStateEnabled: true,
      layout: 'vertical',
    } as RadioGroupProperties;
  }

  _getItemValue(item: ItemLike): unknown {
    // @ts-expect-error valueGetter is injected by DataExpressionMixin
    return this._valueGetter ? this._valueGetter(item) : item.text;
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$submitElement;
  }

  _init(): void {
    super._init();

    // @ts-expect-error _initDataExpressions is injected by DataExpressionMixin
    this._initDataExpressions();
  }

  _initMarkup(): void {
    $(this.element()).addClass(RADIO_GROUP_CLASS);
    this._renderSubmitElement();
    this.setAria('role', 'radiogroup');
    this._renderRadios();
    this._renderLayout();
    super._initMarkup();
  }

  _itemClickHandler({ itemElement, event, itemData }:
    NativeEventInfo<RadioCollection, MouseEvent | PointerEvent> & ItemInfo): void {
    if (this.itemElements()?.is($(itemElement))) {
      const { value } = this.option();
      const newValue = this._getItemValue(itemData);

      if (newValue !== value) {
        this._saveValueChangeEvent(event as unknown as ValueChangedEvent);
        this.option('value', newValue);
      }
    }
  }

  _getSelectedItemKeys(value: unknown): unknown[] {
    const { valueExpr } = this.option();
    const isNullSelectable = valueExpr !== 'this';
    const shouldSelectValue = (isNullSelectable && value === null) || isDefined(value);

    return shouldSelectValue ? [value] : [];
  }

  _setSelection(currentValue: unknown): void {
    // @ts-expect-error _unwrappedValue is injected by DataExpressionMixin
    const value = this._unwrappedValue(currentValue);
    this._setCollectionWidgetOption('selectedItemKeys', this._getSelectedItemKeys(value));
  }

  _renderValidationState(): void {
    super._renderValidationState();

    // @ts-expect-error
    this._validationMessage?.$content().attr('role', 'alert');
  }

  _optionChanged(args: OptionChanged<RadioGroupProperties>): void {
    const { name, value } = args;
    // @ts-expect-error _dataExpressionOptionChanged is injected by DataExpressionMixin
    this._dataExpressionOptionChanged(args);

    switch (name) {
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
        // @ts-expect-error _getCollectionKeyExpr is injected by DataExpressionMixin
        this._setCollectionWidgetOption('keyExpr', this._getCollectionKeyExpr());
        break;
      case 'value':
        this._setSelection(value);
        this._setSubmitValue(value);
        super._optionChanged(args);
        break;
      case 'items':
        this._setSelection(this.option().value);
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

  _render(): void {
    super._render();
    this._updateItemsSize();
  }

  _renderLayout(): void {
    const { layout } = this.option();
    const $element = $(this.element());

    $element.toggleClass(RADIO_GROUP_VERTICAL_CLASS, layout === 'vertical');
    $element.toggleClass(RADIO_GROUP_HORIZONTAL_CLASS, layout === 'horizontal');
  }

  _renderRadios(): void {
    this._areRadiosCreated = Deferred();
    const $radios = $('<div>').appendTo(this.$element());
    const {
      displayExpr,
      accessKey,
      focusStateEnabled,
      itemTemplate,
      tabIndex,
      value,
    } = this.option();
    this._createComponent($radios, RadioCollection, {
      onInitialized: ({ component }) => {
        this._radios = component;
      },
      onContentReady: () => {
        this._fireContentReadyAction(true);
      },
      onItemClick: this._itemClickHandler.bind(this),
      displayExpr,
      accessKey,
      // @ts-expect-error _dataSource is injected by DataExpressionMixin
      dataSource: this._dataSource,
      focusStateEnabled,
      itemTemplate,
      // @ts-expect-error _getCollectionKeyExpr is injected by DataExpressionMixin
      keyExpr: this._getCollectionKeyExpr(),
      noDataText: '',
      // @ts-expect-error scrollingEnabled is absent from CollectionWidgetProperties
      scrollingEnabled: false,
      selectByClick: false,
      selectionMode: 'single',
      selectedItemKeys: this._getSelectedItemKeys(value),
      tabIndex,
    });
    this._areRadiosCreated.resolve();
  }

  _renderSubmitElement(): void {
    this._$submitElement = $('<input>')
      .attr('type', 'hidden')
      .appendTo(this.$element());

    this._setSubmitValue();
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();
    this._optionsByReference = { ...this._optionsByReference, value: true };
  }

  _setSubmitValue(value?: unknown): void {
    const { valueExpr, value: optionValue } = this.option();
    const resolvedValue = value ?? optionValue;

    const submitValue = valueExpr === 'this'
      // @ts-expect-error _displayGetter is injected by DataExpressionMixin
      ? this._displayGetter(resolvedValue)
      : resolvedValue;

    this._$submitElement.val(submitValue as string | number | undefined);
  }

  _setCollectionWidgetOption(...args: [string, unknown]): void {
    // @ts-expect-error widget._setWidgetOption args should be typed as ArrayLike<unknown>
    this._areRadiosCreated.done(this._setWidgetOption.bind(this, '_radios', args));
  }

  _updateItemsSize(): void {
    const { layout, items } = this.option();

    if (layout === 'horizontal') {
      this.itemElements()?.css('height', 'auto');
    } else {
      const itemsCount = (items ?? []).length;

      this.itemElements()?.css('height', `${100 / itemsCount}%`);
    }
  }

  focus(): void {
    this._radios?.focus();
  }

  itemElements(): dxElementWrapper | undefined {
    return this._radios?._itemElements();
  }
}
// @ts-expect-error Widget base class should define a typed static include() method
RadioGroup.include(DataExpressionMixin);

registerComponent('dxRadioGroup', RadioGroup);

export default RadioGroup;
