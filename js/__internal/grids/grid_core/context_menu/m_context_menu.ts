/* eslint-disable max-classes-per-file */
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import ContextMenu from '@js/ui/context_menu';

import modules from '../m_modules';

const CONTEXT_MENU = 'dx-context-menu';

const viewName = {
  columnHeadersView: 'header',
  rowsView: 'content',
  footerView: 'footer',
  headerPanel: 'headerPanel',
};
const VIEW_NAMES = ['columnHeadersView', 'rowsView', 'footerView', 'headerPanel'] as const;

class ContextMenuController extends modules.ViewController {
  init() {
    this.createAction('onContextMenuPreparing');
  }

  getContextMenuItems(dxEvent) {
    if (!dxEvent) {
      return false;
    }

    const that = this;
    const $targetElement = $(dxEvent.target);
    let $element;
    let $targetRowElement;
    let $targetCellElement;
    let menuItems;

    each(VIEW_NAMES, function () {
      // @ts-expect-error
      const view = that.getView(this);
      $element = view && view.element();

      if ($element && ($element.is($targetElement) || $element.find($targetElement).length)) {
        $targetCellElement = $targetElement.closest('.dx-row > td, .dx-row > tr');
        $targetRowElement = $targetCellElement.parent();
        const rowIndex = view.getRowIndex($targetRowElement);
        const columnIndex = $targetCellElement[0] && $targetCellElement[0].cellIndex;
        const rowOptions = $targetRowElement.data('options');
        const options: any = {
          event: dxEvent,
          targetElement: getPublicElement($targetElement),
          target: viewName[this],
          rowIndex,
          row: view._getRows()[rowIndex],
          columnIndex,
          column: rowOptions?.cells?.[columnIndex]?.column,
        };

        options.items = view.getContextMenuItems && view.getContextMenuItems(options);

        // @ts-expect-error
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _contextMenuPrepared(options) {

  }
}

class ContextMenuView extends modules.View {
  _renderCore() {
    const that = this;
    const $element = that.element().addClass(CONTEXT_MENU);

    this.setAria('role', 'presentation', $element);

    this._createComponent(
      $element,
      ContextMenu,
      {
        onPositioning(actionArgs) {
          const { event } = actionArgs;
          const contextMenuInstance = actionArgs.component;
          // @ts-expect-error
          const items = that.getController('contextMenu').getContextMenuItems(event);

          if (items) {
            contextMenuInstance.option('items', items);
            event!.stopPropagation();
          } else {
            // @ts-expect-error
            actionArgs.cancel = true;
          }
        },
        onItemClick(params) {
          // @ts-expect-error
          params.itemData?.onItemClick?.(params);
        },

        cssClass: that.getWidgetContainerClass(),
        target: that.component.$element(),
      },
    );
  }
}

export const contextMenuModule = {
  defaultOptions() {
    return {
      onContextMenuPreparing: null,
    };
  },
  controllers: {
    contextMenu: ContextMenuController,
  },
  views: {
    contextMenuView: ContextMenuView,
  },
};
