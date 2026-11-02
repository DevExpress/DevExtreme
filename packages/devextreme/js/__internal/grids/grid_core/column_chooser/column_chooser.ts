/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import type { ColumnChooser } from '@js/common/grids';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferUpdate } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { InitializedEvent as ButtonInitializedEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import Popup from '@js/ui/popup/ui.popup';
import type {
  ContentReadyEvent, OptionChangedEvent, Properties as TreeViewProperties, SelectionChangedEvent,
} from '@js/ui/tree_view';
import TreeView from '@js/ui/tree_view';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { BoundingRect } from '@ts/grids/grid_core/views/types';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';
import type { InternalPositionConfig } from '@ts/ui/overlay/overlay';
import type { PopupProperties } from '@ts/ui/popup/popup';
import { NODE_CLASS } from '@ts/ui/tree_view/tree_view.base';

import type { ColumnHeadersView } from '../column_headers/column_headers';
import type { ColumnsController } from '../columns_controller/columns_controller';
import type {
  Column, ColumnIndex, ColumnsChanges, DropLocationNames,
} from '../columns_controller/types';
import type { HeaderPanel } from '../header_panel/header_panel';
import modules from '../modules/modules';
import type { ModuleType, OptionChanged } from '../types';
import { ColumnsView } from '../views/columns_view';
import { CLASSES, defaultOptions, ICONS } from './const';
import type { ColumnChooserItem, NodeInternal } from './types';

const COLUMN_OPTIONS_USED_IN_ITEMS: (keyof Column)[] = [
  'showInColumnChooser', 'caption', 'allowHiding', 'visible', 'cssClass', 'ownerBand',
];

export class ColumnChooserController extends modules.ViewController {
  private _rowsView!: RowsView;

  public init(): void {
    super.init();
    this._rowsView = this.getView('rowsView');
  }

  private renderShowColumnChooserButton($element: dxElementWrapper): void {
    const columnChooserButtonClass = this.addWidgetPrefix(CLASSES.columnChooserButton);
    const columnChooserEnabled = this.option('columnChooser.enabled');
    const $showColumnChooserButton = $element.find(`.${columnChooserButtonClass}`);

    if (columnChooserEnabled) {
      if (!$showColumnChooserButton.length) {
        const $columnChooserButton = $('<div>')
          .addClass(columnChooserButtonClass)
          .appendTo($element);

        this._createComponent($columnChooserButton, Button, {
          icon: ICONS.columnChooser,
          onClick: (): void => {
            // TODO getView
            this.getView('columnChooserView').showColumnChooser();
          },
          hint: this.option('columnChooser.title'),
          integrationOptions: {},
        });
      } else {
        $showColumnChooserButton.show();
      }
    } else {
      $showColumnChooserButton.hide();
    }
  }

  public getPosition(): InternalPositionConfig {
    const position = this.option('columnChooser.position');

    return position ?? {
      my: 'right bottom',
      at: 'right bottom',
      of: this._rowsView?.element(),
      collision: 'fit',
      offset: '-2 -2',
      boundaryOffset: '2 2',
    };
  }
}

export class ColumnChooserView extends ColumnsView {
  private _popupContainer?: Popup;

  private _columnChooserList?: TreeView;

  private _isUpdatingColumnVisibility?: boolean;

  private _isPopupContainerShown?: boolean;

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'columnChooser':
        this._initializePopupContainer();

        this.render(null, 'full');
        break;
      default:
        super.optionChanged(args);
    }
  }

  public publicMethods(): string[] {
    return ['showColumnChooser', 'hideColumnChooser'];
  }

  protected _resizeCore(): void {

  }

  private _initializePopupContainer(): Popup {
    const columnChooserClass = this.addWidgetPrefix(CLASSES.columnChooser);
    // @ts-expect-error the view is rendered here
    const $element = this.element().addClass(columnChooserClass);
    const columnChooserOptions = this.option('columnChooser');
    const popupPosition = this._columnChooserController.getPosition();

    const dxPopupOptions: PopupProperties = {
      visible: false,
      shading: false,
      showCloseButton: true,
      dragEnabled: true,
      resizeEnabled: true,
      wrapperAttr: { class: columnChooserClass },
      toolbarItems: [
        { text: columnChooserOptions?.title, toolbar: 'top', location: 'before' },
      ],
      position: popupPosition,
      width: columnChooserOptions?.width,
      height: columnChooserOptions?.height,
      rtlEnabled: this.option('rtlEnabled'),
      container: columnChooserOptions?.container,
      tabFocusLoopEnabled: true,
      _ignoreCloseOnChildEscape: true,
    };

    if (!isDefined(this._popupContainer)) {
      this._popupContainer = this._createComponent($element, Popup, dxPopupOptions);

      this._popupContainer.on('optionChanged', (args) => {
        if (args.name === 'visible') {
          this.renderCompleted.fire();
        }
      });
    } else {
      this._popupContainer.option(dxPopupOptions);
    }

    this.setPopupAttributes();

    return this._popupContainer;
  }

  private setPopupAttributes(): void {
    const popupContainer = this._popupContainer;

    if (!popupContainer) {
      return;
    }

    const isSelectMode = this.isSelectMode();
    const isBandColumnsUsed = this._columnsController.isBandColumnsUsed();

    popupContainer.setAria({
      role: 'dialog',
      label: messageLocalization.format('dxDataGrid-columnChooserTitle'),
    });

    popupContainer.$wrapper()
      ?.toggleClass(this.addWidgetPrefix(CLASSES.columnChooserModeDrag), !isSelectMode)
      .toggleClass(this.addWidgetPrefix(CLASSES.columnChooserModeSelect), isSelectMode);

    popupContainer.$content()?.addClass(this.addWidgetPrefix(CLASSES.columnChooserList));

    if (isSelectMode && !isBandColumnsUsed) {
      popupContainer.$content()?.addClass(this.addWidgetPrefix(CLASSES.columnChooserPlain));
    }
  }

  protected _renderCore(change?: DataChange | 'full'): DeferredObj<unknown> {
    if (this._popupContainer) {
      const isDragMode = !this.isSelectMode();

      if (!this._columnChooserList || change === 'full') {
        this._renderTreeView();
      } else if (isDragMode) {
        this._updateItems();
      }
    }

    return Deferred<unknown>().resolve();
  }

  private _renderTreeView(): void {
    const $container = this._popupContainer?.$content();

    if (!$container) {
      return;
    }

    const columnChooser = this.option('columnChooser');
    const isSelectMode = this.isSelectMode();

    const treeViewConfig: TreeViewProperties = {
      dataStructure: 'plain',
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      itemTemplate: 'item',
      showCheckBoxesMode: 'none',
      rootValue: null,
      searchEnabled: columnChooser?.search?.enabled,
      searchTimeout: columnChooser?.search?.timeout,
      searchEditorOptions: columnChooser?.search?.editorOptions,
    };

    extend(
      treeViewConfig,
      isSelectMode ? this._prepareSelectModeConfig() : this._prepareDragModeConfig(),
    );

    if (this._columnChooserList) {
      if (!treeViewConfig.searchEnabled) {
        treeViewConfig.searchValue = '';
      }

      this._columnChooserList.option(treeViewConfig);
      // we need to set items after setting selectNodesRecursive,
      // so they will be processed correctly inside TreeView
      this._updateItems();
    } else {
      this._columnChooserList = this._createComponent($container, TreeView, treeViewConfig);
      // we need to set items after setting selectNodesRecursive,
      // so they will be processed correctly inside TreeView
      this._updateItems();

      let scrollTop = 0;

      this._columnChooserList.on('optionChanged', (e: OptionChangedEvent) => {
        const scrollable = e.component.getScrollable();
        scrollTop = scrollable.scrollTop();
      });

      this._columnChooserList.on('contentReady', (e: ContentReadyEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        deferUpdate(() => {
          const scrollable = e.component.getScrollable();
          scrollable.scrollTo({ top: scrollTop });

          this.renderCompleted.fire();
        });
      });
    }
  }

  private _prepareDragModeConfig(): TreeViewProperties {
    const columnChooserOptions = this.option('columnChooser');

    return {
      noDataText: columnChooserOptions?.emptyPanelText,
      activeStateEnabled: false,
      hoverStateEnabled: false,
      itemTemplate(data: ColumnChooserItem, index: number, item: DxElement): void {
        $(item)
          .text(data.text ?? '')
          .parent()
          .addClass(data.cssClass ?? '')
          .addClass(CLASSES.columnChooserItem);
      },
    };
  }

  private _getBandColumnVisibility(columnIndex: number): boolean {
    const childColumns = this._columnsController.getChildrenByBandColumn(columnIndex, true);
    return !!childColumns.some((column) => !!column.visible);
  }

  private _getColumnVisibility(
    columnIndex: number,
    isNodeSelected: boolean | undefined,
  ): boolean | undefined {
    const column = this._columnsController.columnOption(columnIndex);
    const selectionOptions = this.option('columnChooser.selection');
    const recursive = selectionOptions?.recursive;

    if (recursive && column?.hasColumns) {
      return this._getBandColumnVisibility(columnIndex);
    }

    return isNodeSelected;
  }

  private _updateColumnVisibility(nodes: NodeInternal[]): void {
    nodes.forEach((node) => {
      const columnIndex = node.itemData.id;
      const isVisible = this._getColumnVisibility(columnIndex, node.selected);

      this._columnsController.columnOption(columnIndex, 'visible', isVisible);
    });
  }

  private _getOrderedFlatNodes(nodes: NodeInternal[]): NodeInternal[] {
    const getFlattenedNodesRecursive = (
      sourceNodes: NodeInternal[],
      flatNodesArray: NodeInternal[],
    ): NodeInternal[] => sourceNodes.reduce((result, node) => {
      result.push(node);

      if (node.children.length) {
        getFlattenedNodesRecursive(node.children, result);
      }

      return result;
    }, flatNodesArray);

    // Band columns should be updated after regular columns
    return getFlattenedNodesRecursive(nodes, []).reverse();
  }

  private _prepareSelectModeConfig(): TreeViewProperties {
    const selectionOptions = this.option('columnChooser.selection') ?? {};
    const selectionChangedHandler = (e: SelectionChangedEvent): void => {
      // @ts-expect-error getNodes() is typed with optional children and itemData
      const nodes = this._getOrderedFlatNodes(e.component.getNodes());

      this.component.beginUpdate();
      this._isUpdatingColumnVisibility = true;

      this._updateColumnVisibility(nodes);

      this.component.endUpdate();
      this._isUpdatingColumnVisibility = false;
    };

    return {
      selectByClick: selectionOptions.selectByClick,
      selectNodesRecursive: selectionOptions.recursive,
      showCheckBoxesMode: selectionOptions.allowSelectAll ? 'selectAll' : 'normal',
      disabledNodeSelectionMode: 'never',
      onSelectionChanged: selectionChangedHandler,
    };
  }

  private processItems(chooserColumns: Column[]): ColumnChooserItem[] {
    const isSelectMode = this.isSelectMode();
    const isRecursive = this.option('columnChooser.selection.recursive');

    return chooserColumns.map((column) => {
      const item: ColumnChooserItem = {
        text: column.caption,
        cssClass: column.cssClass,
        allowHiding: column.allowHiding,
        expanded: true,
        id: column.index,
        disabled: column.allowHiding === false,
        parentId: column.ownerBand ?? null,
      };

      const isRecursiveWithColumns = isRecursive && column.hasColumns;

      if (isSelectMode && !isRecursiveWithColumns) {
        item.selected = column.visible;
      }

      return item;
    });
  }

  private _updateItems(): void {
    const isSelectMode = this.isSelectMode();
    const chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
    const items = this.processItems(chooserColumns);

    this._columnChooserList?.option('items', items);
  }

  private _updateItemsSelection(columnIndices: number[] | undefined): void {
    const columnChooserList = this._columnChooserList;

    if (!columnChooserList) {
      return;
    }

    const changedColumns = columnIndices
      ?.map((columnIndex) => this._columnsController.columnOption(columnIndex))
      .filter(isDefined);

    columnChooserList.beginUpdate();
    changedColumns?.forEach(({ visible, index }) => {
      if (visible) {
        columnChooserList.selectItem(index);
      } else {
        columnChooserList.unselectItem(index);
      }
    });
    columnChooserList.endUpdate();
  }

  protected _columnOptionChanged(changes: ColumnsChanges): void {
    super._columnOptionChanged(changes);

    const { optionNames } = changes;
    const isSelectMode = this.isSelectMode();
    const onlyVisibleChanged = this.isColumnVisibilityOnlyUpdated(optionNames);
    const isOnlyColumnVisibilityUpdated = this._isUpdatingColumnVisibility
      && onlyVisibleChanged;

    if (!isSelectMode || !this._columnChooserList || isOnlyColumnVisibilityUpdated) {
      return;
    }

    const columnIndices = isDefined(changes.columnIndex)
      ? [changes.columnIndex]
      : changes.columnIndices;
    const hasItemsOptionNames = COLUMN_OPTIONS_USED_IN_ITEMS
      .some((optionName) => optionNames[optionName]);
    const needUpdate = hasItemsOptionNames || !!(changes.changeTypes.columns && optionNames.all);

    if (!needUpdate) {
      return;
    }

    this._updateItemsSelection(columnIndices);
    if (!onlyVisibleChanged) {
      this._updateItems();
    }
  }

  private isColumnVisibilityOnlyUpdated(
    optionNames: { length: number } & Record<string, unknown>,
  ): boolean {
    const optionKeys = Object
      .keys(optionNames ?? {})
      .filter((key) => key !== 'length');

    return optionKeys.length === 1 && optionKeys[0] === 'visible';
  }

  public getColumnElements(): dxElementWrapper {
    const isSelectMode = this.isSelectMode();
    const chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
    const $content = this._popupContainer?.$content();
    const $nodes = $content?.find(`.${NODE_CLASS}`);

    if (!$nodes) {
      return $();
    }

    return $(chooserColumns.map((column) => $nodes
      .filter(`[data-item-id = '${column.index}']`)
      .children(`.${CLASSES.columnChooserItem}`).get(0)));
  }

  public getName(): string {
    return 'columnChooser';
  }

  public getColumns(): Column[] {
    return this._columnsController.getChooserColumns();
  }

  public allowDragging(column: Column): boolean | undefined {
    const isParentColumnVisible = this._columnsController.isParentColumnVisible(column.index);
    const isColumnHidden = !column.visible && column.allowHiding;

    return this.isColumnChooserVisible() && isParentColumnVisible && isColumnHidden;
  }

  public getBoundingRect(): BoundingRect | null {
    const container = this._popupContainer?.$overlayContent();

    if (container?.is(':visible')) {
      const offset = container.offset();

      if (offset) {
        return {
          left: offset.left,
          top: offset.top,
          right: offset.left + Number(getOuterWidth(container)),
          bottom: offset.top + Number(getOuterHeight(container)),
        };
      }
    }

    return null;
  }

  public showColumnChooser(): void {
    /// #DEBUG
    this._isPopupContainerShown = true;
    /// #ENDDEBUG
    let popupContainer = this._popupContainer;

    if (!popupContainer) {
      popupContainer = this._initializePopupContainer();

      this.render();
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    popupContainer.show();
  }

  private hideColumnChooser(): void {
    if (this._popupContainer) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      this._popupContainer.hide();

      /// #DEBUG
      this._isPopupContainerShown = false;
      /// #ENDDEBUG
    }
  }

  public isColumnChooserVisible(): boolean {
    const popupContainer = this._popupContainer;

    return !!popupContainer?.option('visible');
  }

  public isSelectMode(): boolean {
    return this.option('columnChooser.mode') === 'select';
  }

  public hasHiddenColumns(): boolean {
    const isEnabled = !!this.option('columnChooser.enabled');
    const hiddenColumns = this.getColumns().filter((column) => !column.visible);

    return isEnabled && hiddenColumns.length > 0;
  }
}

const headerPanel = (
  Base: ModuleType<HeaderPanel>,
): ModuleType<HeaderPanel> => class ColumnChooserHeaderPanelExtender extends Base {
  protected _getToolbarItems(): ToolbarItem[] {
    const items = super._getToolbarItems();

    return this._appendColumnChooserItem(items);
  }

  private _appendColumnChooserItem(items: ToolbarItem[]): ToolbarItem[] {
    const columnChooserEnabled = this.option('columnChooser.enabled');

    if (columnChooserEnabled) {
      const onClickHandler = (): void => {
        // TODO getView
        this.component.getView('columnChooserView').showColumnChooser();
      };
      const onInitialized = (e: ButtonInitializedEvent): void => {
        $(e.element).addClass(this.getToolbarButtonClass(
          this.addWidgetPrefix(CLASSES.columnChooserButton),
        ));
      };
      const hintText = this.option('columnChooser.title');
      const toolbarItem: ToolbarItem = {
        widget: 'dxButton',
        options: {
          icon: ICONS.columnChooser,
          onClick: onClickHandler,
          hint: hintText,
          text: hintText,
          onInitialized,
          elementAttr: { 'aria-haspopup': 'dialog' },
        },
        showText: 'inMenu',
        location: 'after',
        name: 'columnChooserButton',
        locateInMenu: 'auto',
        sortIndex: 40,
      };

      items.push(toolbarItem);
    }

    return items;
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'columnChooser':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
};

const columns = (
  Base: ModuleType<ColumnsController>,
): ModuleType<ColumnsController> => class ColumnsChooserColumnsControllerExtender extends Base {
  public allowMoveColumn(
    fromVisibleIndex: ColumnIndex,
    toVisibleIndex: ColumnIndex,
    sourceLocation: DropLocationNames,
    targetLocation: DropLocationNames,
  ): boolean | undefined {
    const isSelectMode = this.option('columnChooser.mode') === 'select';
    const isMoveColumnDisallowed = isSelectMode && targetLocation === 'columnChooser';

    return isMoveColumnDisallowed
      ? false
      : super.allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation);
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<ColumnHeadersView> => class ColumnChooserColumnHeadersExtender extends Base {
  public allowDragging(column: Column): boolean | undefined {
    const isDragMode = !this._columnChooserView.isSelectMode();
    const isColumnChooserVisible = this._columnChooserView.isColumnChooserVisible();

    return (isDragMode && isColumnChooserVisible && !!column.allowHiding)
      || super.allowDragging(column);
  }
};

export const columnChooserModule = {
  defaultOptions(): { columnChooser: ColumnChooser } {
    return defaultOptions;
  },
  controllers: {
    columnChooser: ColumnChooserController,
  },
  views: {
    columnChooserView: ColumnChooserView,
  },
  extenders: {
    views: {
      headerPanel,
      columnHeadersView,
    },
    controllers: {
      columns,
    },
  },
};
