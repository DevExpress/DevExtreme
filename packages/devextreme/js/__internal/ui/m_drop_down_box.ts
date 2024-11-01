import eventsEngine from '@js/common/core/events/core/events_engine';
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
// @ts-expect-error
import { grep, noop } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { isDefined, isObject } from '@js/core/utils/type';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import { tabbable } from '@js/ui/widget/selectors';
import DropDownEditor from '@ts/ui/drop_down_editor/m_drop_down_editor';
import { getElementMaxHeightByWindow } from '@ts/ui/overlay/m_utils';

const { getActiveElement } = domAdapter;

const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
const ANONYMOUS_TEMPLATE_NAME = 'content';

const realDevice = devices.real();

const DropDownBox = (DropDownEditor as any).inherit({
  _supportedKeys() {
    return extend({}, this.callBase(), {
      tab(e) {
        if (!this.option('opened')) {
          return;
        }

        const $tabbableElements = this._getTabbableElements();
        const $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();

        // @ts-expect-error
        $focusableElement && eventsEngine.trigger($focusableElement, 'focus');
        e.preventDefault();
      },
    });
  },

  /// #DEBUG
  _realDevice: realDevice,
  /// #ENDDEBUG

  _getTabbableElements() {
    return this._getElements().filter(tabbable);
  },

  _getElements() {
    return $(this.content()).find('*');
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {

      acceptCustomValue: false,

      contentTemplate: ANONYMOUS_TEMPLATE_NAME,

      openOnFieldClick: true,

      displayValueFormatter(value) {
        return Array.isArray(value) ? value.join(', ') : value;
      },
      useHiddenSubmitElement: true,
    });
  },

  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },

  _initTemplates() {
    this.callBase();
  },

  _initMarkup() {
    this._initDataExpressions();
    this.$element().addClass(DROP_DOWN_BOX_CLASS);

    this.callBase();
  },

  _setSubmitValue() {
    const value = this.option('value');
    const submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

    this._getSubmitElement().val(submitValue);
  },

  _shouldUseDisplayValue(value) {
    return this.option('valueExpr') === 'this' && isObject(value);
  },

  _sortValuesByKeysOrder(orderedKeys, values) {
    const sortedValues = values.sort((a, b) => orderedKeys.indexOf(a.itemKey) - orderedKeys.indexOf(b.itemKey));

    return sortedValues.map((x) => x.itemDisplayValue);
  },

  _renderInputValue() {
    this._rejectValueLoading();
    const values = [];

    if (!this._dataSource) {
      this.callBase(values);

      return Deferred().resolve();
    }

    const currentValue = this._getCurrentValue();
    let keys = currentValue ?? [];

    keys = Array.isArray(keys) ? keys : [keys];

    const itemLoadDeferreds = map(keys, (key) => {
      const deferred = Deferred();
      this
        ._loadItem(key)
        .always((item) => {
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

    const callBase = this.callBase.bind(this);
    return when
      .apply(this, itemLoadDeferreds)
      .always(() => {
        const orderedValues = this._sortValuesByKeysOrder(keys, values);
        this.option('displayValue', orderedValues);
        callBase(values.length && orderedValues);
      });
  },

  _loadItem(value) {
    const deferred = Deferred();
    const that = this;

    const selectedItem = grep(this.option('items') || [], (item) => this._isValueEquals(this._valueGetter(item), value))[0];

    if (selectedItem !== undefined) {
      deferred.resolve(selectedItem);
    } else {
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

    return deferred.promise();
  },

  _popupTabHandler(e) {
    if (normalizeKeyName(e) !== 'tab') return;

    const $firstTabbable = this._getTabbableElements().first().get(0);
    const $lastTabbable = this._getTabbableElements().last().get(0);
    const $target = e.target;
    const moveBackward = !!($target === $firstTabbable && e.shiftKey);
    const moveForward = !!($target === $lastTabbable && !e.shiftKey);

    if (moveBackward || moveForward) {
      this.close();
      // @ts-expect-error
      eventsEngine.trigger(this._input(), 'focus');

      if (moveBackward) {
        e.preventDefault();
      }
    }
  },

  _renderPopupContent() {
    if (this.option('contentTemplate') === ANONYMOUS_TEMPLATE_NAME) {
      return;
    }

    const contentTemplate = this._getTemplateByOption('contentTemplate');

    if (!(contentTemplate && this.option('contentTemplate'))) {
      return;
    }

    const $popupContent = this._popup.$content();
    const templateData = {
      value: this._fieldRenderData(),
      component: this,
    };

    $popupContent.empty();

    contentTemplate.render({
      container: getPublicElement($popupContent),
      model: templateData,
    });
  },

  _canShowVirtualKeyboard() {
    // @ts-expect-error
    return realDevice.mac; // T845484
  },

  _isNestedElementActive() {
    const activeElement = getActiveElement();
    return activeElement && this._popup.$content().get(0).contains(activeElement);
  },

  _shouldHideOnParentScroll() {
    return realDevice.deviceType === 'desktop' && this._canShowVirtualKeyboard() && this._isNestedElementActive();
  },

  _popupHiddenHandler() {
    this.callBase();
    this._popupPosition = undefined;
  },

  _popupPositionedHandler(e) {
    this.callBase(e);
    this._popupPosition = e.position;
  },

  _getDefaultPopupPosition(isRtlEnabled) {
    const { my, at } = this.callBase(isRtlEnabled);

    return {
      my,
      at,
      offset: { v: -1 },
      collision: 'flipfit',
    };
  },

  _popupConfig() {
    const { focusStateEnabled } = this.option();

    return extend(this.callBase(), {
      tabIndex: -1,
      dragEnabled: false,
      focusStateEnabled,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      hideOnParentScroll: this._shouldHideOnParentScroll.bind(this),
      position: extend(this.option('popupPosition'), {
        of: this.$element(),
      }),
      _ignoreFunctionValueDeprecation: true,
      maxHeight: function () {
        const popupLocation = this._popupPosition?.v.location;

        return getElementMaxHeightByWindow(this.$element(), popupLocation);
      }.bind(this),
    });
  },

  _popupShownHandler() {
    this.callBase();
    const $firstElement = this._getTabbableElements().first();
    // @ts-expect-error
    eventsEngine.trigger($firstElement, 'focus');
  },

  _setCollectionWidgetOption: noop,

  _optionChanged(args) {
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
        this.callBase(args);
    }
  },
}).include(DataExpressionMixin);

registerComponent('dxDropDownBox', DropDownBox);

export default DropDownBox;
