import type { PositionConfig } from '@js/common/core/animation';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { isDefined, isObject } from '@js/core/utils/type';
import type { Properties } from '@js/ui/drop_down_box';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { Properties as PopupProperties } from '@js/ui/popup';
import { grep } from '@ts/core/utils/m_common';
import { tabbable } from '@ts/core/utils/m_selectors';
import type { OptionChanged } from '@ts/core/widget/types';
import DropDownEditor from '@ts/ui/drop_down_editor/drop_down_editor';
import type { PositioningEvent } from '@ts/ui/overlay/overlay';
import { getElementMaxHeightByWindow } from '@ts/ui/overlay/utils';

const { getActiveElement } = domAdapter;

const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
const ANONYMOUS_TEMPLATE_NAME = 'content';

interface ItemWithKey { itemKey: unknown; itemDisplayValue: unknown }

export interface DropDownBoxProperties extends Omit<Properties,
'onClosed' | 'onOpened'
| 'onCopy' | 'onCut' | 'onEnterKey'
| 'onFocusIn' | 'onFocusOut'
| 'onInput' | 'onKeyDown'
| 'onKeyUp' | 'onPaste'
| 'onValueChanged'
| 'validationMessagePosition'
| 'onContentReady' | 'onDisposing'
| 'onOptionChanged' | 'onInitialized'> {
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
        const { opened } = this.option();
        if (!opened) {
          return;
        }

        const $tabbableElements = this._getTabbableElements();
        const $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();

        if ($focusableElement) {
          // @ts-expect-error should be added on EventsEngine level
          eventsEngine.trigger($focusableElement, 'focus');
        }

        e.preventDefault();
      },
    };
  }

  _getTabbableElements(): dxElementWrapper {
    // @ts-expect-error filter callback overload should be added on dxElementWrapper level
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
    // @ts-expect-error DataExpressionMixin must be typed
    this._initDataExpressions();
    this.$element().addClass(DROP_DOWN_BOX_CLASS);

    super._initMarkup();
  }

  _setSubmitValue(): void {
    const { value } = this.option();
    const submitValue = this._shouldUseDisplayValue(value)
    // @ts-expect-error DataExpressionMixin must be typed
      ? this._displayGetter(value)
      : value;

    this._getSubmitElement().val(submitValue);
  }

  _shouldUseDisplayValue(value: unknown): boolean {
    const { valueExpr } = this.option();

    return valueExpr === 'this' && isObject(value);
  }

  _sortValuesByKeysOrder(orderedKeys: unknown[], values: ItemWithKey[]): unknown[] {
    const sortedValues = values.sort(
      (a, b) => orderedKeys.indexOf(a.itemKey) - orderedKeys.indexOf(b.itemKey),
    );

    return sortedValues.map((x) => x.itemDisplayValue);
  }

  _renderInputValue({ renderOnly }: { renderOnly?: boolean } = {}): DeferredObj<unknown> {
    // @ts-expect-error DataExpressionMixin must be typed
    this._rejectValueLoading();
    const values: ItemWithKey[] = [];
    // @ts-expect-error DataExpressionMixin must be typed
    if (!this._dataSource) {
      super._renderInputValue({ renderOnly, value: values });

      return Deferred().resolve();
    }
    // @ts-expect-error DataExpressionMixin must be typed
    const rawValue = this._getCurrentValue() ?? [];
    const keys: unknown[] = Array.isArray(rawValue) ? rawValue : [rawValue];

    const itemLoadDeferreds = map(keys, (key) => {
      const deferred = Deferred();
      this
        ._loadItem(key)
        .always((item) => {
          // @ts-expect-error DataExpressionMixin must be typed
          const displayValue = this._displayGetter(item);
          const { acceptCustomValue } = this.option();
          if (isDefined(displayValue)) {
            values.push({ itemKey: key, itemDisplayValue: displayValue });
          } else if (acceptCustomValue) {
            values.push({ itemKey: key, itemDisplayValue: key });
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

  _loadItem(value: unknown): DeferredObj<unknown> {
    const deferred = Deferred();
    const selectedItem = grep(
      this.option('items') || [],
      // @ts-expect-error DataExpressionMixin must be typed
      (item) => this._isValueEquals(this._valueGetter(item), value) as boolean,
      false,
    )[0];

    if (selectedItem !== undefined) {
      deferred.resolve(selectedItem);
    } else {
      // @ts-expect-error DataExpressionMixin must be typed
      this._loadValue(value)
        .done((item) => {
          deferred.resolve(item);
        })
        .fail((args) => {
          if (args?.shouldSkipCallback) {
            return;
          }

          if (this.option('acceptCustomValue')) {
            deferred.resolve(value);
          } else {
            deferred.reject();
          }
        });
    }
    return deferred;
  }

  _popupTabHandler(e: KeyboardEvent): void {
    if (normalizeKeyName(e) !== 'tab') return;

    const $firstTabbable = this._getTabbableElements().first().get(0);
    const $lastTabbable = this._getTabbableElements().last().get(0);
    const $target = e.target;
    const moveBackward = !!($target === $firstTabbable && e.shiftKey);
    const moveForward = !!($target === $lastTabbable && !e.shiftKey);

    if (moveBackward || moveForward) {
      this.close();
      // @ts-expect-error should be added on EventsEngine level
      eventsEngine.trigger(this._input(), 'focus');

      if (moveBackward) {
        e.preventDefault();
      }
    }
  }

  _renderPopupContent(): void {
    const { contentTemplate: optionContentTemplate } = this.option();
    if (optionContentTemplate === ANONYMOUS_TEMPLATE_NAME) {
      return;
    }

    const contentTemplate = this._getTemplateByOption('contentTemplate');

    if (!(contentTemplate && optionContentTemplate)) {
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
    return !!(devices.real() as unknown as { mac?: boolean }).mac; // T845484
  }

  _isNestedElementActive(): boolean {
    const activeElement = getActiveElement();
    return !!(activeElement && this._popup?.$content()?.get(0)?.contains(activeElement));
  }

  _shouldHideOnParentScroll(): boolean {
    return devices.real().deviceType === 'desktop' && this._canShowVirtualKeyboard() && this._isNestedElementActive();
  }

  _popupHiddenHandler(): void {
    super._popupHiddenHandler();
    this._popupPosition = undefined;
  }

  _popupPositionedHandler(e: Partial<PositioningEvent>): void {
    super._popupPositionedHandler(e);
    this._popupPosition = e.position;
  }

  _getDefaultPopupPosition(isRtlEnabled?: boolean): PositionConfig {
    const { my, at } = super._getDefaultPopupPosition(isRtlEnabled);

    return {
      my,
      at,
      // @ts-expect-error Should be updated on PositionConfig level
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
      // @ts-expect-error hideOnParentScroll public overlay.d.ts needs fix
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
    // @ts-expect-error should be added on EventsEngine level
    eventsEngine.trigger($firstElement, 'focus');
  }

  _setCollectionWidgetOption(): void {}

  _shouldLogFieldTemplateDeprecationWarning(): boolean {
    return true;
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    // @ts-expect-error DataExpressionMixin must be typed
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

// @ts-expect-error DataExpressionMixin is not typed
DropDownBox.include(DataExpressionMixin);

registerComponent('dxDropDownBox', DropDownBox);

export default DropDownBox;
