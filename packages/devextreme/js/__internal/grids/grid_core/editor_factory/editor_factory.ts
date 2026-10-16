/* eslint-disable @typescript-eslint/method-signature-style */
import positionUtils from '@js/common/core/animation/position';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { Callback } from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getOuterHeight,
  getOuterWidth, setOuterHeight, setOuterWidth,
} from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import EditorFactoryMixin from '@js/ui/shared/ui.editor_factory_mixin';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type {
  ColumnsResizerViewController,
} from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type { ValidatingController } from '@ts/grids/grid_core/validating/m_validating';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';

import type { ColumnsController } from '../columns_controller/columns_controller';
import { CELL_FOCUS_DISABLED_CLASS, CELL_MODIFIED_CLASS, FOCUS_OVERLAY_CLASS } from '../editing/const';
import type { EditingController } from '../editing/m_editing';
import { CLASSES as KEYBOARD_NAVIGATION_CLASSES } from '../keyboard_navigation/const';
import { isDataRow } from '../keyboard_navigation/utils';
import type { ViewController } from '../modules/modules';
import modules from '../modules/modules';
import type { Module, ModuleType } from '../types';
import gridCoreUtils from '../utils';
import { INVALIDATE_CLASS } from '../validating/const';
import type { RowsView } from '../views/rows_view';
import { CLASSES, MODULE_NAMESPACE, UPDATE_FOCUS_EVENTS } from './const';

interface EditorFactoryMixinType {
  createEditor($container: dxElementWrapper, options: object): void;

  _getRevertTooltipsSelector(): string;

}

const ViewControllerWithMixin: ModuleType<ViewController & EditorFactoryMixinType> = (
  EditorFactoryMixin(modules.ViewController)
);

export class EditorFactory extends ViewControllerWithMixin {
  private _isFocusOverlay?: boolean;

  private _updateFocusTimeoutID?: ReturnType<typeof setTimeout>;

  private _$focusedElement?: dxElementWrapper | null;

  private _focusTimeoutID?: ReturnType<typeof setTimeout>;

  public focused!: Callback<[dxElementWrapper]>;

  protected _$focusOverlay?: dxElementWrapper;

  private _updateFocusHandler!: (e: DxEvent) => void;

  protected _editingController!: EditingController;

  protected _rowsView!: RowsView;

  protected _columnsController!: ColumnsController;

  protected _columnsResizerController!: ColumnsResizerViewController;

  protected _validatingController!: ValidatingController;

  protected _columnHeadersView!: ColumnHeadersView;

  private _subscribedContainerRoot!: Node;

  public init(): void {
    this.createAction('onEditorPreparing', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });
    this.createAction('onEditorPrepared', { excludeValidators: ['disabled', 'readOnly'], category: 'rendering' });

    this._columnsResizerController = this.getController('columnsResizer');
    this._editingController = this.getController('editing');
    this._columnsController = this.getController('columns');
    this._validatingController = this.getController('validating');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._rowsView = this.getView('rowsView');

    this._updateFocusHandler ??= this.createAction(this._updateFocus.bind(this));

    this._subscribedContainerRoot = this._getContainerRoot();
    eventsEngine.on(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);

    this._attachContainerEventHandlers();
  }

  public dispose(): void {
    clearTimeout(this._focusTimeoutID);
    clearTimeout(this._updateFocusTimeoutID);
    eventsEngine.off(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
  }

  private _getFocusedElement($dataGridElement: dxElementWrapper): dxElementWrapper | false {
    const rowSelector = this.option('focusedRowEnabled') ? 'tr[tabindex]:focus' : `tr[tabindex]:not(.${VIEW_CLASSES.dataRow}):focus`;
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
  protected _getFocusCellSelector(): string {
    return `.${VIEW_CLASSES.row} > td`;
  }

  private _updateFocusCore(): void {
    const $dataGridElement = this.component?.$element();
    let $focus = $dataGridElement && this._getFocusedElement($dataGridElement);

    if ($focus && $focus.length) {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the nested if
      let isHideBorder: boolean | undefined;

      if (!$focus.hasClass(CELL_FOCUS_DISABLED_CLASS) && !$focus.hasClass(VIEW_CLASSES.row)) {
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

    this.loseFocus();
  }

  /**
   * @extended: adaptivity
   */
  protected _needHideBorder($element: dxElementWrapper): boolean {
    const rowsViewElement = this._rowsView.element();
    const isRowsView = !!rowsViewElement && $element.closest(rowsViewElement).length > 0;
    const isEditing = this._editingController.isEditing();

    return $element.hasClass(CLASSES.editorInlineBlock) || (isRowsView && !isEditing);
  }

  private _updateFocus(e: { event?: DxEvent }): void {
    const isFocusOverlay = e?.event
      && $(e.event.target).hasClass(this.addWidgetPrefix(FOCUS_OVERLAY_CLASS));

    this._isFocusOverlay = !!this._isFocusOverlay || isFocusOverlay;

    clearTimeout(this._updateFocusTimeoutID);

    this._updateFocusTimeoutID = setTimeout(() => {
      delete this._updateFocusTimeoutID;
      if (!this._isFocusOverlay) {
        this._updateFocusCore();
      }
      this._isFocusOverlay = false;
    });
  }

  protected updateFocusOverlaySize($element: dxElementWrapper, position: object): void {
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

  protected callbackNames(): string[] {
    return ['focused'];
  }

  protected getFocusOverlayContainer($focusedElement: dxElementWrapper): dxElementWrapper {
    return $focusedElement.closest(`.${this.addWidgetPrefix(VIEW_CLASSES.content)}`);
  }

  protected getFocusOverlaySize($element: dxElementWrapper): { width: number; height: number } {
    const elementRect = getBoundingRect($element.get(0));

    return {
      width: elementRect.right - elementRect.left + 1,
      height: elementRect.bottom - elementRect.top + 1,
    };
  }

  protected updateFocusOverlay($element: dxElementWrapper, isHideBorder = false): void {
    // @ts-expect-error renderFocusOverlay creates the focus overlay first
    const $focusOverlay: dxElementWrapper = this._$focusOverlay;

    if (isHideBorder || isDataRow($element)) {
      $focusOverlay.addClass(CLASSES.hidden);
    } else if ($element.length) {
      const align = browser.mozilla ? 'right bottom' : 'left top';
      const isFocusedCellInvalid = $element.hasClass(this.addWidgetPrefix(INVALIDATE_CLASS));
      const isFocusedCellModified = $element.hasClass(CELL_MODIFIED_CLASS) && !isFocusedCellInvalid;
      const $content = this.getFocusOverlayContainer($element);
      const focusOverlaySize = this.getFocusOverlaySize($element);

      $focusOverlay
        .removeClass(CLASSES.hidden)
        .toggleClass(CLASSES.focusedCellInvalid, isFocusedCellInvalid)
        .toggleClass(CLASSES.focusedCellModified, isFocusedCellModified)
        .appendTo($content);

      setOuterHeight($focusOverlay, focusOverlaySize.height);
      setOuterWidth($focusOverlay, focusOverlaySize.width);

      const focusOverlayPosition = {
        precise: true,
        my: align,
        at: align,
        of: $element,
        boundary: $content.length && $content,
      };

      this.updateFocusOverlaySize($focusOverlay, focusOverlayPosition);
      positionUtils.setup($focusOverlay, focusOverlayPosition);

      $focusOverlay.css('visibility', 'visible'); // for ios
    }
  }

  /**
   * @extended: focus
   */
  protected renderFocusOverlay($element: dxElementWrapper, isHideBorder?: boolean): void {
    if (!gridCoreUtils.isElementInCurrentGrid(this, $element)) {
      return;
    }

    this._$focusOverlay ??= $('<div>').addClass(this.addWidgetPrefix(FOCUS_OVERLAY_CLASS));

    this.updateFocusOverlay($element, isHideBorder);
  }

  /**
   * @extended: validating
   */
  public focus(
    $element?: dxElementWrapper | null,
    isHideBorder?: boolean,
  ): dxElementWrapper | null | undefined {
    if ($element === undefined) {
      return this._$focusedElement;
    } if ($element) {
      // To prevent overlay flicking
      // @ts-expect-error is() is typed without null and undefined
      if (!$element.is(this._$focusedElement)) {
        // TODO: this code should be before timeout
        // else focus is not will move to adaptive form by shift + tab key
        this._$focusedElement?.removeClass(KEYBOARD_NAVIGATION_CLASSES.focused);
      }
      this._$focusedElement = $element;

      clearTimeout(this._focusTimeoutID);
      this._focusTimeoutID = setTimeout(() => {
        delete this._focusTimeoutID;

        this.renderFocusOverlay($element, isHideBorder);

        $element.addClass(KEYBOARD_NAVIGATION_CLASSES.focused);
        this.focused.fire($element);
      });
    }

    return undefined;
  }

  public refocus(): void {
    const $focus = this.focus();
    this.focus($focus);
  }

  public resize(): void {
    const $focusedElement = this._$focusedElement;

    if ($focusedElement) {
      this.focus($focusedElement);
    }
  }

  /**
   * @extended: validating
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  public loseFocus(skipValidator?: boolean): void {
    this._$focusedElement?.removeClass(KEYBOARD_NAVIGATION_CLASSES.focused);
    this._$focusedElement = null;
    this._$focusOverlay?.addClass(CLASSES.hidden);
  }

  private _getContainerRoot(): Node {
    const $container = this.component?.$element();
    // @ts-expect-error the grid element exists once the component is initialized
    const root = domAdapter.getRootNode($container?.get(0));

    // a grid created inside a plain document fragment (not a shadow root) listens on the document
    if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !('host' in root)) {
      return domAdapter.getDocument();
    }

    return root;
  }

  private _attachContainerEventHandlers(): void {
    const $container = this.component?.$element();

    if ($container) {
      // T179518
      eventsEngine.on($container, addNamespace('keydown', MODULE_NAMESPACE), (e) => {
        if (normalizeKeyName(e) === 'tab') {
          this._updateFocusHandler(e);
        }
      });
    }
  }

  public getFocusOverlay(): dxElementWrapper | undefined {
    return this._$focusOverlay;
  }

  public hasOverlayElements(): boolean {
    return !!this._$focusOverlay?.length && !this._$focusOverlay.hasClass(CLASSES.hidden);
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
