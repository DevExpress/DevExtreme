/* eslint-disable @typescript-eslint/method-signature-style */
import positionUtils from '@js/common/core/animation/position';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getOuterHeight,
  getOuterWidth, setOuterHeight, setOuterWidth,
} from '@js/core/utils/size';
import EditorFactoryMixin from '@js/ui/shared/ui.editor_factory_mixin';
import type {
  ColumnsResizerViewController,
} from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { ValidatingController } from '@ts/grids/grid_core/validating/m_validating';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { EditingController } from '../editing/m_editing';
import type { ViewController } from '../m_modules';
import modules from '../m_modules';
import type { Module, ModuleType } from '../m_types';
import gridCoreUtils from '../m_utils';
import type { RowsView } from '../views/m_rows_view';

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
  createEditor(...args: any[]): any;

  _getRevertTooltipsSelector(): string;

}

const ViewControllerWithMixin: ModuleType<ViewController & EditorFactoryMixinType> = EditorFactoryMixin(modules.ViewController) as any;

export class EditorFactory extends ViewControllerWithMixin {
  private _isFocusOverlay: any;

  private _updateFocusTimeoutID: any;

  private _$focusedElement: any;

  private _focusTimeoutID: any;

  public focused: any;

  protected _$focusOverlay: any;

  private _updateFocusHandler: any;

  protected _editingController!: EditingController;

  protected _rowsView!: RowsView;

  protected _columnsController!: ColumnsController;

  protected _columnsResizerController!: ColumnsResizerViewController;

  protected _keyboardNavigationController!: KeyboardNavigationController;

  protected _validatingController!: ValidatingController;

  private _subscribedContainerRoot!: Node;

  public init() {
    this.createAction('onEditorPreparing', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });
    this.createAction('onEditorPrepared', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });

    this._columnsResizerController = this.getController('columnsResizer');
    this._editingController = this.getController('editing');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._columnsController = this.getController('columns');
    this._validatingController = this.getController('validating');
    this._rowsView = this.getView('rowsView');

    this._updateFocusHandler = this._updateFocusHandler || this.createAction(this._updateFocus.bind(this));

    this._subscribedContainerRoot = this._getContainerRoot();
    eventsEngine.on(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);

    this._attachContainerEventHandlers();
  }

  public dispose() {
    clearTimeout(this._focusTimeoutID);
    clearTimeout(this._updateFocusTimeoutID);
    eventsEngine.off(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
  }

  private _getFocusedElement($dataGridElement) {
    const rowSelector = this.option('focusedRowEnabled') ? 'tr[tabindex]:focus' : 'tr[tabindex]:not(.dx-data-row):focus';
    const focusedElementSelector = [
      'td[tabindex]:focus',
      `${rowSelector}`,
      'input:focus',
      'button:focus',
      'textarea:focus',
      'div[tabindex]:focus',
      '.dx-lookup-field:focus',
      '.dx-checkbox:focus',
      '.dx-switch:focus',
      '.dx-dropdownbutton .dx-buttongroup:focus',
      '.dx-adaptive-item-text:focus'].join(',');

    // T181706
    const $focusedElement = $dataGridElement.find(focusedElementSelector);

    return this.elementIsInsideGrid($focusedElement) && $focusedElement;
  }

  /**
   * @extended: adaptivity
   */
  protected _getFocusCellSelector() {
    return '.dx-row > td';
  }

  private _updateFocusCore() {
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

  /**
   * @extended: adaptivity
   */
  protected _needHideBorder($element) {
    const rowsViewElement = this._rowsView.element();
    const isRowsView = $element.closest(rowsViewElement).length > 0;
    const isEditing = this._editingController.isEditing();

    return $element.hasClass(EDITOR_INLINE_BLOCK) || (isRowsView && !isEditing);
  }

  private _updateFocus(e) {
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

  protected updateFocusOverlaySize($element, position): void {
    $element.hide();

    const location = positionUtils.calculate($element, extend({ collision: 'fit' }, position));

    if (location.h.oversize > 0) {
      setOuterWidth($element, getOuterWidth($element) - location.h.oversize);
    }

    if (location.v.oversize > 0) {
      setOuterHeight($element, getOuterHeight($element) - location.v.oversize);
    }

    $element.show();
  }

  protected callbackNames() {
    return ['focused'];
  }

  protected getFocusOverlayContainer($focusedElement: dxElementWrapper): dxElementWrapper {
    return $focusedElement.closest(`.${this.addWidgetPrefix(CONTENT_CLASS)}`);
  }

  protected getFocusOverlaySize($element: dxElementWrapper): { width: number; height: number } {
    const elementRect = getBoundingRect($element.get(0));

    return {
      width: elementRect.right - elementRect.left + 1,
      height: elementRect.bottom - elementRect.top + 1,
    };
  }

  protected updateFocusOverlay($element: dxElementWrapper, isHideBorder = false): void {
    if (isHideBorder) {
      this._$focusOverlay.addClass(DX_HIDDEN);
    } else if ($element.length) {
      // align "right bottom" for Mozilla
      const align = browser.mozilla ? 'right bottom' : 'left top';
      const isFocusedCellInvalid = $element.hasClass(this.addWidgetPrefix(CELL_INVALID_CLASS));
      const isFocusedCellModified = $element.hasClass(CELL_MODIFIED_CLASS) && !isFocusedCellInvalid;
      const $content = this.getFocusOverlayContainer($element);
      const focusOverlaySize = this.getFocusOverlaySize($element);

      this._$focusOverlay
        .removeClass(DX_HIDDEN)
        .toggleClass(FOCUSED_CELL_INVALID_CLASS, isFocusedCellInvalid)
        .toggleClass(FOCUSED_CELL_MODIFIED_CLASS, isFocusedCellModified)
        .appendTo($content);

      setOuterHeight(this._$focusOverlay, focusOverlaySize.height);
      setOuterWidth(this._$focusOverlay, focusOverlaySize.width);

      const focusOverlayPosition = {
        precise: true,
        my: align,
        at: align,
        of: $element,
        boundary: $content.length && $content,
      };

      this.updateFocusOverlaySize(this._$focusOverlay, focusOverlayPosition);
      positionUtils.setup(this._$focusOverlay, focusOverlayPosition);

      this._$focusOverlay.css('visibility', 'visible'); // for ios
    }
  }

  /**
   * @extended: focus
   */
  protected renderFocusOverlay($element, isHideBorder) {
    if (!gridCoreUtils.isElementInCurrentGrid(this, $element)) {
      return;
    }

    if (!this._$focusOverlay) {
      this._$focusOverlay = $('<div>').addClass(this.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
    }

    this.updateFocusOverlay($element, isHideBorder);
  }

  /**
   * @extended: validating
   */
  public focus($element?, isHideBorder?) {
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

  public refocus() {
    const $focus = this.focus();
    this.focus($focus);
  }

  public resize() {
    const $focusedElement = this._$focusedElement;

    if ($focusedElement) {
      this.focus($focusedElement);
    }
  }

  /**
   * @extended: validating
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public loseFocus(skipValidator?) {
    this._$focusedElement && this._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
    this._$focusedElement = null;
    this._$focusOverlay && this._$focusOverlay.addClass(DX_HIDDEN);
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

  private _attachContainerEventHandlers() {
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

  public getFocusOverlay() {
    return this._$focusOverlay;
  }

  public hasOverlayElements(): boolean {
    return !!this._$focusOverlay?.length && !this._$focusOverlay.hasClass(DX_HIDDEN);
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
