/* eslint-disable max-classes-per-file */
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import ContextMenu from '@js/ui/context_menu';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';

import modules from '../modules/modules';

const CONTEXT_MENU = 'dx-context-menu';

const viewName = {
  columnHeadersView: 'header',
  rowsView: 'content',
  footerView: 'footer',
  headerPanel: 'toolbar',
};
const VIEW_NAMES = ['columnHeadersView', 'rowsView', 'footerView', 'headerPanel'] as const;

export class ContextMenuController extends modules.ViewController {
  public init() {
    this.createAction('onContextMenuPreparing');
  }

  public getContextMenuItems(dxEvent) {
    if (!dxEvent) {
      return false;
    }

    const that = this;
    const $targetElement = $(dxEvent.target);
    let menuItems;

    each(VIEW_NAMES, function () {
      const view = that.getView(this);

      if (!view) {
        return;
      }

      const $viewElement = view.element();
      const isTargetElementInsideView = $viewElement?.is($targetElement) || $viewElement?.find($targetElement).length;

      if (isTargetElementInsideView) {
        const isGroupRow = $targetElement.hasClass(VIEW_CLASSES.groupRow);
        const $targetCellElement = isGroupRow
          ? $targetElement.find(`.${VIEW_CLASSES.groupCell}`).first()
          : $targetElement.closest(`.${VIEW_CLASSES.row} > td, .${VIEW_CLASSES.row} > tr`);
        const $targetRowElement = $targetCellElement.parent();
        const rowIndex = view.getRowIndex($targetRowElement);
        const columnIndex = $targetCellElement[0]?.cellIndex;
        const rowOptions = $targetRowElement.data('options');
        const options: any = {
          event: dxEvent,
          targetElement: getPublicElement($targetElement),
          target: viewName[this],
          rowIndex,
          // @ts-expect-error the views have no common _getRows
          row: view._getRows()[rowIndex],
          columnIndex,
          // @ts-expect-error
          column: rowOptions?.cells?.[columnIndex]?.column,
        };

        // @ts-expect-error only some of the views have getContextMenuItems
        options.items = view.getContextMenuItems?.(options);

        that.executeAction('onContextMenuPreparing', options);
        that._contextMenuPrepared(options);
        menuItems = options.items;

        if (menuItems) {
          return false;
        }
      }

      return undefined;
    });

    return menuItems;
  }

  /**
   * @extended: selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _contextMenuPrepared(options) {}
}

export class ContextMenuView extends modules.View {
  private _contextMenuController!: ContextMenuController;

  public init() {
    super.init();

    this._contextMenuController = this.getController('contextMenu');
  }

  protected _renderCore() {
    // @ts-expect-error the view is rendered here
    const $element = this.element().addClass(CONTEXT_MENU);

    this.setAria('role', 'presentation', $element);

    this._createComponent(
      $element,
      ContextMenu,
      {
        onPositioning: (actionArgs) => {
          const { event } = actionArgs;
          const contextMenuInstance = actionArgs.component;
          const items = this._contextMenuController.getContextMenuItems(event);

          if (items) {
            contextMenuInstance.option('items', items);
            event!.stopPropagation();
          } else {
            // @ts-expect-error
            actionArgs.cancel = true;
          }
        },
        onItemClick(params) {
          params.itemData?.onItemClick?.(params);
        },
        cssClass: this.getWidgetContainerClass(),
        target: this.component.$element(),
      },
    );
  }
}

export const contextMenuModule = {
  defaultOptions() {
    return {};
  },
  controllers: {
    contextMenu: ContextMenuController,
  },
  views: {
    contextMenuView: ContextMenuView,
  },
};
