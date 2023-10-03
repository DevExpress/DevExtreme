import positionUtils from '@js/animation/position';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getOuterHeight,
  getOuterWidth, setOuterHeight, setOuterWidth,
} from '@js/core/utils/size';
import { name as clickEventName } from '@js/events/click';
import eventsEngine from '@js/events/core/events_engine';
import pointerEvents from '@js/events/pointer';
import { addNamespace, normalizeKeyName } from '@js/events/utils/index';
import EditorFactoryMixin from '@js/ui/shared/ui.editor_factory_mixin';

import modules from '../m_modules';
import { Module, ModuleType, ViewController } from '../m_types';
import gridCoreUtils from '../m_utils';

const EDITOR_INLINE_BLOCK = 'dx-editor-inline-block';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const CELL_MODIFIED_CLASS = 'dx-cell-modified';
const CELL_INVALID_CLASS = 'invalid';
const FOCUSED_CELL_MODIFIED_CLASS = 'dx-focused-cell-modified';
const FOCUSED_CELL_INVALID_CLASS = 'dx-focused-cell-invalid';
const FOCUS_OVERLAY_CLASS = 'focus-overlay';
const CONTENT_CLASS = 'content';
const FOCUSED_ELEMENT_CLASS = 'dx-focused';
const ROW_CLASS = 'dx-row';
const MODULE_NAMESPACE = 'dxDataGridEditorFactory';
const UPDATE_FOCUS_EVENTS = addNamespace([pointerEvents.down, 'focusin', clickEventName].join(' '), MODULE_NAMESPACE);
const DX_HIDDEN = 'dx-hidden';

interface EditorFactoryMixinType {
  createEditor: (...args: any[]) => any;

  _getRevertTooltipsSelector: () => string;

}

const ViewControllerWithMixin: ModuleType<ViewController & EditorFactoryMixinType> = modules.ViewController.inherit(EditorFactoryMixin);

export class EditorFactory extends ViewControllerWithMixin {
  _isFocusOverlay: any;

  _updateFocusTimeoutID: any;

  _$focusedElement: any;

  _focusTimeoutID: any;

  focused: any;

  _$focusOverlay: any;

  _updateFocusHandler: any;

  private _subscribedContainerRoot!: Node;

  _getFocusedElement($dataGridElement) {
    const rowSelector = this.option('focusedRowEnabled') ? 'tr[tabindex]:focus' : 'tr[tabindex]:not(.dx-data-row):focus';
    const focusedElementSelector = `td[tabindex]:focus, ${rowSelector}, input:focus, textarea:focus, .dx-lookup-field:focus, .dx-checkbox:focus, .dx-switch:focus, .dx-dropdownbutton .dx-buttongroup:focus, .dx-adaptive-item-text:focus`;

    // T181706
    const $focusedElement = $dataGridElement.find(focusedElementSelector);

    return this.elementIsInsideGrid($focusedElement) && $focusedElement;
  }

  _getFocusCellSelector() {
    return '.dx-row > td';
  }

  _updateFocusCore() {
    const $dataGridElement = this.component && this.component.$element();

    if ($dataGridElement) {
      // this selector is specific to IE
      let $focus = this._getFocusedElement($dataGridElement);

      if ($focus && $focus.length) {
        let isHideBorder;

        if (!$focus.hasClass(CELL_FOCUS_DISABLED_CLASS) && !$focus.hasClass(ROW_CLASS)) {
          const $focusCell = $focus.closest(`${this._getFocusCellSelector()}, .${CELL_FOCUS_DISABLED_CLASS}`);

          if ($focusCell.get(0) !== $focus.get(0)) {
            isHideBorder = this._needHideBorder($focusCell);
            $focus = $focusCell;
          }
        }

        if ($focus.length && !$focus.hasClass(CELL_FOCUS_DISABLED_CLASS)) {
          this.focus($focus, isHideBorder);
          return;
        }
      }
    }

    this.loseFocus();
  }

  _needHideBorder($element) {
    return $element.hasClass(EDITOR_INLINE_BLOCK);
  }

  _updateFocus(e) {
    const that = this;
    const isFocusOverlay = e && e.event && $(e.event.target).hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));

    that._isFocusOverlay = that._isFocusOverlay || isFocusOverlay;

    clearTimeout(that._updateFocusTimeoutID);

    that._updateFocusTimeoutID = setTimeout(() => {
      delete that._updateFocusTimeoutID;
      if (!that._isFocusOverlay) {
        that._updateFocusCore();
      }
      that._isFocusOverlay = false;
    });
  }

  _updateFocusOverlaySize($element, position) {
    $element.hide();

    // @ts-expect-error
    const location = positionUtils.calculate($element, extend({ collision: 'fit' }, position));

    if (location.h.oversize > 0) {
      setOuterWidth($element, getOuterWidth($element) - location.h.oversize);
    }

    if (location.v.oversize > 0) {
      setOuterHeight($element, getOuterHeight($element) - location.v.oversize);
    }

    $element.show();
  }

  callbackNames() {
    return ['focused'];
  }

  focus($element?, isHideBorder?) {
    const that = this;

    if ($element === undefined) {
      return that._$focusedElement;
    } if ($element) {
      // To prevent overlay flicking
      if (!$element.is(that._$focusedElement)) {
        // TODO: this code should be before timeout else focus is not will move to adaptive form by shift + tab key
        that._$focusedElement && that._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
      }
      that._$focusedElement = $element;

      clearTimeout(that._focusTimeoutID);
      that._focusTimeoutID = setTimeout(() => {
        delete that._focusTimeoutID;

        that.renderFocusOverlay($element, isHideBorder);

        $element.addClass(FOCUSED_ELEMENT_CLASS);
        that.focused.fire($element);
      });
    }
  }

  refocus() {
    const $focus = this.focus();
    this.focus($focus);
  }

  renderFocusOverlay($element, isHideBorder) {
    const that = this;

    if (!gridCoreUtils.isElementInCurrentGrid(this, $element)) {
      return;
    }

    if (!that._$focusOverlay) {
      that._$focusOverlay = $('<div>').addClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
    }

    if (isHideBorder) {
      that._$focusOverlay.addClass(DX_HIDDEN);
    } else if ($element.length) {
      // align "right bottom" for Mozilla
      const align = browser.mozilla ? 'right bottom' : 'left top';
      const $content = $element.closest(`.${that.addWidgetPrefix(CONTENT_CLASS)}`);
      const elemCoord = getBoundingRect($element.get(0));
      const isFocusedCellInvalid = $element.hasClass(this.addWidgetPrefix(CELL_INVALID_CLASS));
      const isFocusedCellModified = $element.hasClass(CELL_MODIFIED_CLASS) && !isFocusedCellInvalid;

      that._$focusOverlay
        .removeClass(DX_HIDDEN)
        .toggleClass(FOCUSED_CELL_INVALID_CLASS, isFocusedCellInvalid)
        .toggleClass(FOCUSED_CELL_MODIFIED_CLASS, isFocusedCellModified)
        .appendTo($content);
      setOuterHeight(that._$focusOverlay, elemCoord.bottom - elemCoord.top + 1);
      setOuterWidth(that._$focusOverlay, elemCoord.right - elemCoord.left + 1);

      const focusOverlayPosition = {
        precise: true,
        my: align,
        at: align,
        of: $element,
        boundary: $content.length && $content,
      };

      that._updateFocusOverlaySize(that._$focusOverlay, focusOverlayPosition);
      // @ts-expect-error
      positionUtils.setup(that._$focusOverlay, focusOverlayPosition);

      that._$focusOverlay.css('visibility', 'visible'); // for ios
    }
  }

  resize() {
    const $focusedElement = this._$focusedElement;

    if ($focusedElement) {
      this.focus($focusedElement);
    }
  }

  loseFocus() {
    this._$focusedElement && this._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
    this._$focusedElement = null;
    this._$focusOverlay && this._$focusOverlay.addClass(DX_HIDDEN);
  }

  init() {
    this.createAction('onEditorPreparing', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });
    this.createAction('onEditorPrepared', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });

    this._updateFocusHandler = this._updateFocusHandler || this.createAction(this._updateFocus.bind(this));

    this._subscribedContainerRoot = this._getContainerRoot();
    eventsEngine.on(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);

    this._attachContainerEventHandlers();
  }

  private _getContainerRoot(): Node {
    const $container = this.component?.$element();
    // @ts-expect-error
    const root = domAdapter.getRootNode($container?.get(0));

    // @ts-expect-error
    // NOTE: this condition is for the 'Row - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)'
    // testcafe test. The detail grid is created inside document_fragment_node but it is not shadow dom
    // eslint-disable-next-line no-undef
    if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !root.host) {
      return domAdapter.getDocument();
    }

    return root;
  }

  _attachContainerEventHandlers() {
    const that = this;
    const $container = that.component && that.component.$element();

    if ($container) {
      // T179518
      eventsEngine.on($container, addNamespace('keydown', MODULE_NAMESPACE), (e) => {
        if (normalizeKeyName(e) === 'tab') {
          that._updateFocusHandler(e);
        }
      });
    }
  }

  dispose() {
    clearTimeout(this._focusTimeoutID);
    clearTimeout(this._updateFocusTimeoutID);
    eventsEngine.off(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
  }
}

export const editorFactoryModule: Module = {
  defaultOptions() {
    return {

    };
  },
  controllers: {
    editorFactory: EditorFactory,
  },
};
