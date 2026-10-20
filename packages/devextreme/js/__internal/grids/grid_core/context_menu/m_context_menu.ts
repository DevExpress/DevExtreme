/* eslint-disable max-classes-per-file */
import type { GridsContextMenuTarget } from '@js/common/grids';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import ContextMenu from '@js/ui/context_menu';
import { each } from '@ts/core/utils/m_iterator';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import { DX_CONTEXT_MENU_CLASS } from '@ts/ui/context_menu/context_menu';

import modules from '../modules/modules';
import type { InternalGridOptions } from '../types';
import type { GridContextMenuItem, ViewRow } from '../views/types';
import type { ContextMenuPreparingOptions, ContextMenuViewName } from './types';

const viewName: Record<ContextMenuViewName, GridsContextMenuTarget> = {
  columnHeadersView: 'header',
  rowsView: 'content',
  footerView: 'footer',
  headerPanel: 'toolbar',
};
const VIEW_NAMES: readonly ContextMenuViewName[] = ['columnHeadersView', 'rowsView', 'footerView', 'headerPanel'];

export class ContextMenuController extends modules.ViewController {
  public init(): void {
    this.createAction('onContextMenuPreparing');
  }

  public getContextMenuItems(dxEvent?: DxEvent): GridContextMenuItem[] | false | undefined {
    if (!dxEvent) {
      return false;
    }

    const $targetElement = $(dxEvent.target);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in each callback
    let menuItems: GridContextMenuItem[] | undefined;

    each(VIEW_NAMES, (index, name) => {
      const view = this.getView(name);

      if (!view) {
        return undefined;
      }

      const $viewElement = view.element();
      const isTargetElementInsideView = $viewElement?.is($targetElement)
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of two flags
        || $viewElement?.find($targetElement).length;

      if (isTargetElementInsideView) {
        const isGroupRow = $targetElement.hasClass(VIEW_CLASSES.groupRow);
        const $targetCellElement = isGroupRow
          ? $targetElement.find(`.${VIEW_CLASSES.groupCell}`).first()
          : $targetElement.closest(`.${VIEW_CLASSES.row} > td, .${VIEW_CLASSES.row} > tr`);
        const $targetRowElement = $targetCellElement.parent();
        const rowIndex = view.getRowIndex($targetRowElement);
        const columnIndex: number | undefined = $targetCellElement[0]?.cellIndex;
        // @ts-expect-error data(key) is typed as returning the wrapper
        const rowOptions: ViewRow | undefined = $targetRowElement.data('options');
        const options: ContextMenuPreparingOptions = {
          event: dxEvent,
          targetElement: getPublicElement($targetElement),
          target: viewName[name],
          rowIndex,
          row: view._getRows()[rowIndex],
          columnIndex,
          // @ts-expect-error an undefined cellIndex reads no cell
          column: rowOptions?.cells?.[columnIndex]?.column,
        };

        options.items = view.getContextMenuItems?.(options);

        this.executeAction('onContextMenuPreparing', options);
        this._contextMenuPrepared(options);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the param
  protected _contextMenuPrepared(options: ContextMenuPreparingOptions): void {}
}

export class ContextMenuView extends modules.View {
  private _contextMenuController!: ContextMenuController;

  public init(): void {
    super.init();

    this._contextMenuController = this.getController('contextMenu');
  }

  protected _renderCore(): void {
    // @ts-expect-error the view is rendered here
    const $element = this.element().addClass(DX_CONTEXT_MENU_CLASS);

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
            // @ts-expect-error onPositioning is raised by a pointer event
            event.stopPropagation();
          } else {
            // @ts-expect-error cancel isn't declared on the positioning event
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
  defaultOptions(): InternalGridOptions {
    return {};
  },
  controllers: {
    contextMenu: ContextMenuController,
  },
  views: {
    contextMenuView: ContextMenuView,
  },
};
