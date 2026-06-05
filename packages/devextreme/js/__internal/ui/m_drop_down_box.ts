import type { PositionConfig } from '@js/common/core/animation';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error ts-error
import { grep } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { isDefined, isObject } from '@js/core/utils/type';
import type { Properties } from '@js/ui/drop_down_box';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { Properties as PopupProperties } from '@js/ui/popup';
import { tabbable } from '@ts/core/utils/m_selectors';
import DropDownEditor from '@ts/ui/drop_down_editor/drop_down_editor';
import { getElementMaxHeightByWindow } from '@ts/ui/overlay/utils';

const { getActiveElement } = domAdapter;

const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
const ANONYMOUS_TEMPLATE_NAME = 'content';

export interface DropDownBoxProperties extends Omit<Properties,
'onClosed' | 'onOpened'
| 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'
| 'onValueChanged' | 'validationMessagePosition' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
}

class DropDownBox<
  TProperties extends DropDownBoxProperties = DropDownBoxProperties,
> extends DropDownEditor<TProperties> {
  _popupPosition?: PositionConfig;

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | void> {
    return {
      ...super._supportedKeys(),
      tab(e): void {
        if (!this.option('opened')) {
          return;
        }

        const $tabbableElements = this._getTabbableElements();
        const $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();

        if ($focusableElement) {
          // @ts-expect-error ts-error
          eventsEngine.trigger($focusableElement, 'focus');
        }

        e.preventDefault();
      },
    };
  }

  _getTabbableElements() {
    // @ts-expect-error ts-error
    return this._getElements().filter(tabbable);
  }

  _getElements(): dxElementWrapper {
    return $(this.content()).find('*');
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      acceptCustomValue: false,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      openOnFieldClick: true,
      displayValueFormatter(value): string {
        return Array.isArray(value) ? value.join(', ') : value;
      },
      useHiddenSubmitElement: true,
    };
  }

  _getAnonymousTemplateName(): string {
    return ANONYMOUS_TEMPLATE_NAME;
  }

  _initTemplates(): void {
    super._initTemplates();
  }

  _initMarkup(): void {
    // @ts-expect-error ts-error
    this._initDataExpressions();
    this.$element().addClass(DROP_DOWN_BOX_CLASS);

    super._initMarkup();
  }

  _setSubmitValue(): void {
    const value = this.option('value');
    const submitValue = this._shouldUseDisplayValue(value)
      // @ts-expect-error ts-error
      ? this._displayGetter(value)
      : value;

    this._getSubmitElement().val(submitValue);
  }

  _shouldUseDisplayValue(value): boolean {
    // @ts-expect-error ts-error
    return this.option('valueExpr') === 'this' && isObject(value);
  }

  _sortValuesByKeysOrder(orderedKeys, values) {
    const sortedValues = values.sort((a, b) => orderedKeys.indexOf(a.itemKey) - orderedKeys.indexOf(b.itemKey));

    return sortedValues.map((x) => x.itemDisplayValue);
  }

  _renderInputValue({ renderOnly }: { renderOnly?: boolean } = {}) {
    // @ts-expect-error ts-error
    this._rejectValueLoading();
    const values = [];
    // @ts-expect-error ts-error
    if (!this._dataSource) {
      super._renderInputValue({ renderOnly, value: values });

      return Deferred().resolve();
    }
    // @ts-expect-error ts-error
    const currentValue = this._getCurrentValue();
    let keys = currentValue ?? [];

    keys = Array.isArray(keys) ? keys : [keys];

    const itemLoadDeferreds = map(keys, (key) => {
      const deferred = Deferred();
      this
        ._loadItem(key)
        .always((item) => {
          // @ts-expect-error ts-error
          const displayValue = this._displayGetter(item);
          if (isDefined(displayValue)) {
            values.push({ itemKey: key, itemDisplayValue: displayValue } as never);
          } else if (this.option('acceptCustomValue')) {
            values.push({ itemKey: key, itemDisplayValue: key } as never);
          }
          deferred.resolve();
        });
      return deferred;
    });

    const callBase = super._renderInputValue.bind(this);
    return when
      .apply(this, itemLoadDeferreds)
      .always(() => {
        const orderedValues = this._sortValuesByKeysOrder(keys, values);
        this.option('displayValue', orderedValues);
        callBase({
          renderOnly,
          value: values.length && orderedValues,
        });
      });
  }

  _loadItem(value): DeferredObj<unknown> {
    const deferred = Deferred();
    const that = this;
    // @ts-expect-error ts-error
    const selectedItem = grep(this.option('items') || [], (item) => this._isValueEquals(this._valueGetter(item), value))[0];

    if (selectedItem !== undefined) {
      deferred.resolve(selectedItem);
    } else {
      // @ts-expect-error ts-error
      this._loadValue(value)
        .done((item) => {
          deferred.resolve(item);
        })
        .fail((args) => {
          if (args?.shouldSkipCallback) {
            return;
          }

          if (that.option('acceptCustomValue')) {
            deferred.resolve(value);
          } else {
            deferred.reject();
          }
        });
    }
    // @ts-expect-error
    return deferred.promise();
  }

  _popupTabHandler(e): void {
    if (normalizeKeyName(e) !== 'tab') return;

    const $firstTabbable = this._getTabbableElements().first().get(0);
    const $lastTabbable = this._getTabbableElements().last().get(0);
    const $target = e.target;
    const moveBackward = !!($target === $firstTabbable && e.shiftKey);
    const moveForward = !!($target === $lastTabbable && !e.shiftKey);

    if (moveBackward || moveForward) {
      this.close();
      // @ts-expect-error ts-error
      eventsEngine.trigger(this._input(), 'focus');

      if (moveBackward) {
        e.preventDefault();
      }
    }
  }

  _renderPopupContent(): void {
    // @ts-expect-error ts-error
    if (this.option('contentTemplate') === ANONYMOUS_TEMPLATE_NAME) {
      return;
    }

    const contentTemplate = this._getTemplateByOption('contentTemplate');

    if (!(contentTemplate && this.option('contentTemplate'))) {
      return;
    }

    const $popupContent = this._popup?.$content();

    if (!$popupContent) {
      return;
    }

    const templateData = {
      value: this._fieldRenderData(),
      component: this,
    };

    $popupContent.empty();

    contentTemplate.render({
      container: getPublicElement($popupContent),
      model: templateData,
    });
  }

  _canShowVirtualKeyboard(): boolean {
    // @ts-expect-error ts-error
    return devices.real().mac; // T845484
  }

  _isNestedElementActive(): boolean {
    const activeElement = getActiveElement();
    // @ts-expect-error ts-error
    return activeElement && this._popup.$content().get(0).contains(activeElement);
  }

  _shouldHideOnParentScroll(): boolean {
    return devices.real().deviceType === 'desktop' && this._canShowVirtualKeyboard() && this._isNestedElementActive();
  }

  _popupHiddenHandler(): void {
    super._popupHiddenHandler();
    this._popupPosition = undefined;
  }

  _popupPositionedHandler(e): void {
    super._popupPositionedHandler(e);
    this._popupPosition = e.position;
  }

  _getDefaultPopupPosition(isRtlEnabled?: boolean): PositionConfig {
    const { my, at } = super._getDefaultPopupPosition(isRtlEnabled);

    return {
      my,
      at,
      // @ts-expect-error ts-error
      offset: { v: -1 },
      collision: 'flipfit',
    };
  }

  _popupConfig(): PopupProperties {
    const { focusStateEnabled } = this.option();

    return {
      ...super._popupConfig(),
      tabIndex: -1,
      dragEnabled: false,
      focusStateEnabled,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      // @ts-expect-error ts-error
      hideOnParentScroll: this._shouldHideOnParentScroll.bind(this),
      position: extend(this.option('popupPosition'), {
        of: this.$element(),
      }),
      _ignoreFunctionValueDeprecation: true,
      // @ts-expect-error maxHeight must remain a function because the overlay reevaluates
      // it whenever it recalculates content dimensions, and it depends
      // on this._popupPosition?.v.location, which is updated after each repositioning.
      maxHeight: (): number | undefined => {
        // @ts-expect-error typificatipn of this._popupPosition
        const popupLocation = this._popupPosition?.v.location;

        return getElementMaxHeightByWindow(this.$element(), popupLocation);
      },
    };
  }

  _popupShownHandler(): void {
    super._popupShownHandler();
    const $firstElement = this._getTabbableElements().first();
    // @ts-expect-error ts-error
    eventsEngine.trigger($firstElement, 'focus');
  }

  // eslint-disable-next-line class-methods-use-this
  _setCollectionWidgetOption(): void {}

  // eslint-disable-next-line class-methods-use-this
  _shouldLogFieldTemplateDeprecationWarning(): boolean {
    return true;
  }

  _optionChanged(args) {
    // @ts-expect-error ts-error
    this._dataExpressionOptionChanged(args);
    switch (args.name) {
      case 'dataSource':
        this._renderInputValue();
        break;
      case 'displayValue':
        this.option('text', args.value);
        break;
      case 'displayExpr':
        this._renderValue();
        break;
      case 'contentTemplate':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

// @ts-expect-error ts-error
DropDownBox.include(DataExpressionMixin);

registerComponent('dxDropDownBox', DropDownBox);

export default DropDownBox;
