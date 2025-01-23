import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { Properties } from '@js/ui/radio_group';
import type { EditorProperties, UnresolvedEvents } from '@ts/ui/editor/editor';
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

  private _areRadiosCreated!: DeferredObj<unknown>;

  private _$submitElement!: dxElementWrapper;

  _dataSourceOptions() {
    return { paginate: false };
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

  // @ts-expect-error
  _fireContentReadyAction(force: boolean): void {
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

    // @ts-expect-error
    return extend(defaultOptions, extend(DataExpressionMixin._dataExpressionDefaultOptions(), {
      hoverStateEnabled: true,
      activeStateEnabled: true,
      layout: 'vertical',
    }));
  }

  _getItemValue(item) {
    // @ts-expect-error
    return this._valueGetter ? this._valueGetter(item) : item.text;
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$submitElement;
  }

  _init(): void {
    super._init();

    this._activeStateUnit = `.${RADIO_BUTTON_CLASS}`;
    this._feedbackHideTimeout = RADIO_FEEDBACK_HIDE_TIMEOUT;
    // @ts-expect-error
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

  _itemClickHandler({ itemElement, event, itemData }): void {
    // @ts-expect-error
    if (this.itemElements().is(itemElement)) {
      const newValue = this._getItemValue(itemData);

      if (newValue !== this.option('value')) {
        this._saveValueChangeEvent(event);
        this.option('value', newValue);
      }
    }
  }

  _getSelectedItemKeys(value = this.option('value')) {
    // @ts-expect-error
    const isNullSelectable = this.option('valueExpr') !== 'this';
    const shouldSelectValue = isNullSelectable && value === null || isDefined(value);

    return shouldSelectValue ? [value] : [];
  }

  _setSelection(currentValue): void {
    // @ts-expect-error
    const value = this._unwrappedValue(currentValue);
    this._setCollectionWidgetOption('selectedItemKeys', this._getSelectedItemKeys(value));
  }

  _renderValidationState(): void {
    super._renderValidationState();

    // @ts-expect-error
    this._validationMessage?.$content().attr('role', 'alert');
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;
    // @ts-expect-error
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
        // @ts-expect-error
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
    } = this.option();
    this._createComponent($radios, RadioCollection, {
      onInitialized: ({ component }) => {
        this._radios = component;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onContentReady: (e) => {
        this._fireContentReadyAction(true);
      },
      // @ts-expect-error
      onItemClick: this._itemClickHandler.bind(this),
      displayExpr,
      accessKey,
      // @ts-expect-error
      dataSource: this._dataSource,
      focusStateEnabled,
      itemTemplate,
      // @ts-expect-error
      keyExpr: this._getCollectionKeyExpr(),
      noDataText: '',
      scrollingEnabled: false,
      selectByClick: false,
      selectionMode: 'single',
      selectedItemKeys: this._getSelectedItemKeys(),
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
    extend(this._optionsByReference, { value: true });
  }

  _setSubmitValue(value?: unknown): void {
    value = value ?? this.option('value');
    // @ts-expect-error
    const submitValue = this.option('valueExpr') === 'this'
      // @ts-expect-error
      ? this._displayGetter(value)
      : value;

    this._$submitElement.val(submitValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setCollectionWidgetOption(name: string, value: unknown): void {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._areRadiosCreated.done(this._setWidgetOption.bind(this, '_radios', arguments));
  }

  _updateItemsSize(): void {
    const { layout } = this.option();

    if (layout === 'horizontal') {
      this.itemElements()?.css('height', 'auto');
    } else {
      // @ts-expect-error
      const itemsCount = this.option('items').length;

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
// @ts-expect-error
RadioGroup.include(DataExpressionMixin);

registerComponent('dxRadioGroup', RadioGroup);

export default RadioGroup;
