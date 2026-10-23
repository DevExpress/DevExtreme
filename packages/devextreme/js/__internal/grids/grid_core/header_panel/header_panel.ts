/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getPathParts } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { ToolbarItem as DataGridToolbarItem } from '@js/ui/data_grid';
import type { Properties as ToolbarProperties } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { HeaderFilterController } from '@ts/grids/grid_core/header_filter/m_header_filter';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';
import { normalizeToolbarItems } from '@ts/grids/new/grid_core/toolbar/utils';

import type { Column } from '../columns_controller/types';
import type { ResizingController } from '../grid_view/grid_view';
import type { InternalGridOptions, ModuleType, OptionChanged } from '../types';
import { ColumnsView } from '../views/columns_view';
import type { ContextMenuItemsOptions, GridContextMenuItem } from '../views/types';
import { CLASSES, DEFAULT_TOOLBAR_ITEM_NAMES, TOOLBAR_ARIA_LABEL } from './const';

export class HeaderPanel extends ColumnsView {
  private _toolbar?: Toolbar<ToolbarItem>;

  private _toolbarOptions?: ToolbarProperties;

  private readonly registeredToolbarItems = new Map<string, ToolbarItem>();

  protected _editingController!: EditingController;

  protected _headerFilterController!: HeaderFilterController;

  public init(): void {
    super.init();

    this._editingController = this.getController('editing');
    this._headerFilterController = this.getController('headerFilter');

    this.createAction('onToolbarPreparing', { excludeValidators: ['disabled', 'readOnly'] });
  }

  /**
   * Registers a toolbar item without triggering a render.
   * Use during initialization (before the first render).
   */
  public registerToolbarItem(name: string, item: ToolbarItem): void {
    this.registeredToolbarItems.set(name, { ...item, name });
  }

  /**
   * Registers a toolbar item and immediately renders the change:
   * updates the existing item in-place, or invalidates the entire header panel to add a new one.
   * Use after the initial render (not during init).
   */
  public applyToolbarItem(name: string, item: ToolbarItem): void {
    const isExisting = this.registeredToolbarItems.has(name);
    const itemIndex = isExisting ? this.findToolbarItemIndex(name) : -1;

    this.registeredToolbarItems.set(name, { ...item, name });

    if (itemIndex >= 0) {
      const normalizedItem = this.getNormalizedRegisteredItem(name);
      this._toolbar?.option(`items[${itemIndex}]`, normalizedItem);
    } else {
      this._invalidate();
    }
  }

  private findToolbarItemIndex(name: string): number {
    const items: ToolbarItem[] = this._toolbar?.option('items') ?? [];

    return items.findIndex((i) => i.name === name);
  }

  private getNormalizedRegisteredItem(name: string): ToolbarItem | undefined {
    const registeredItem = this.registeredToolbarItems.get(name);

    const userToolbarOptions = this.option('toolbar');

    const userItem = userToolbarOptions?.items?.find(
      (ui) => (typeof ui === 'string' ? ui === name : ui?.name === name),
    );

    if (!registeredItem || !userItem) {
      return registeredItem;
    }

    return normalizeToolbarItems(
      [registeredItem],
      [userItem],
      DEFAULT_TOOLBAR_ITEM_NAMES,
    )[0];
  }

  /**
   * Unregisters a toolbar item and invalidates the header panel to re-render without it.
   */
  public removeToolbarItem(name: string): void {
    if (this.registeredToolbarItems.has(name)) {
      this.registeredToolbarItems.delete(name);
      this._invalidate();
    }
  }

  /**
   * @extended: column_chooser, editing, filter_row
   */
  protected _getToolbarItems(): ToolbarItem[] {
    return Array.from(this.registeredToolbarItems.values());
  }

  // eslint-disable-next-line class-methods-use-this
  private sortToolbarItems(items: ToolbarItem[]): ToolbarItem[] {
    return [...items].sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
  }

  private _getButtonContainer(): dxElementWrapper {
    return $('<div>').addClass(this.addWidgetPrefix(CLASSES.toolbarButton));
  }

  public getToolbarButtonClass(specificClass?: string): string {
    const secondClass = specificClass ? ` ${specificClass}` : '';

    return this.addWidgetPrefix(CLASSES.toolbarButton) + secondClass;
  }

  private _getToolbarOptions(): ToolbarProperties<ToolbarItem> {
    const { toolbar: userToolbarOptions } = this.option();
    const sortedToolbarItems: ToolbarItem[] = this.sortToolbarItems(this._getToolbarItems());

    const options: { toolbarOptions: ToolbarProperties<ToolbarItem> } = {
      toolbarOptions: {
        items: sortedToolbarItems,
        visible: userToolbarOptions?.visible,
        disabled: userToolbarOptions?.disabled,
        onItemRendered(e) {
          const itemRenderedCallback = e.itemData?.onItemRendered;

          if (itemRenderedCallback) {
            itemRenderedCallback(e);
          }
        },
      },
    };

    const userItems = userToolbarOptions?.items;
    options.toolbarOptions.items = normalizeToolbarItems(
      sortedToolbarItems,
      userItems,
      DEFAULT_TOOLBAR_ITEM_NAMES,
    );

    this.executeAction('onToolbarPreparing', options);

    if (options.toolbarOptions && !isDefined(options.toolbarOptions.visible)) {
      const toolbarItems = options.toolbarOptions.items;
      options.toolbarOptions.visible = !!toolbarItems?.length;
    }

    return options.toolbarOptions;
  }

  protected _renderCore(): DeferredObj<unknown> {
    if (!this._toolbar) {
      const $headerPanel = this.element();
      // @ts-expect-error the view is rendered here
      $headerPanel.addClass(this.addWidgetPrefix(CLASSES.headerPanel));
      const label = messageLocalization.format(this.component.NAME + TOOLBAR_ARIA_LABEL);
      // @ts-expect-error the view is rendered here
      const $toolbar = $('<div>').appendTo($headerPanel);

      this.setAria('label', label, $toolbar);
      this._toolbar = this._createComponent($toolbar, Toolbar, this._toolbarOptions);
    } else {
      // @ts-expect-error render() sets _toolbarOptions first
      this._toolbar.option(this._toolbarOptions);
    }

    return Deferred<unknown>().resolve();
  }

  protected _columnOptionChanged(): void {

  }

  protected _handleDataChanged(): void {
    if (this._requireReady) {
      this.render();
    }
  }

  private _isDisabledDefinedByUser(name: string): boolean {
    const userItems = this.option('toolbar')?.items;
    const userItem = userItems?.find(
      (item): item is DataGridToolbarItem => typeof item !== 'string' && item?.name === name,
    );

    return isDefined(userItem?.disabled);
  }

  public render($parent?: dxElementWrapper | null, options?: unknown): void {
    this._toolbarOptions = this._getToolbarOptions();
    super.render($parent, options);
  }

  public setToolbarItemDisabled(name: string, disabled: boolean): void {
    const toolbar = this._toolbar;
    const isDefinedByUser = this._isDisabledDefinedByUser(name);

    if (!toolbar || isDefinedByUser) {
      return;
    }

    const items = toolbar.option('items') ?? [];
    const itemIndex = items.findIndex((item) => item.name === name);

    if (itemIndex < 0) {
      return;
    }

    const item = items[itemIndex];

    toolbar.option(`items[${itemIndex}].disabled`, disabled);

    if (item.options) {
      toolbar.option(`items[${itemIndex}].options.disabled`, disabled);
    }
  }

  public updateToolbarDimensions(): void {
    // @ts-expect-error updateDimensions is an internal method not in the public dxToolbar API
    this._toolbar?.updateDimensions();
  }

  private getHeaderPanel(): dxElementWrapper | undefined {
    return this.element();
  }

  private getHeight(): number {
    return this.getElementHeight();
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'onToolbarPreparing') {
      this._invalidate();
      args.handled = true;
    }

    if (args.name === 'toolbar') {
      const parts = getPathParts(args.fullName);
      const optionName = args.fullName.replace(/^toolbar\./, '');
      const isItemsOption = parts[1] === 'items';

      const isToolbarReplaced = parts.length === 1;
      const isVisibleChanged = parts[1] === 'visible';
      const areItemsReplaced = isItemsOption && parts.length === 2;
      const isItemReplaced = isItemsOption && parts.length === 3;

      if (isToolbarReplaced || isVisibleChanged || areItemsReplaced) {
        this._invalidate();
      } else if (isItemReplaced) {
        const normalizedItem = normalizeToolbarItems(
          this._getToolbarItems(),
          // @ts-expect-error OptionChanged has no paths for toolbar items by index
          [args.value],
          DEFAULT_TOOLBAR_ITEM_NAMES,
        )[0];
        this._toolbar?.option(optionName, normalizedItem);
      } else {
        this._toolbar?.option(optionName, args.value);
      }
      args.handled = true;
    }

    super.optionChanged(args);
  }

  /**
   * @extended: column_chooser, editing
   */
  public isVisible(): boolean {
    return !!this._toolbarOptions?.visible;
  }

  /**
   * @extended: DataGrid's grouping
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public allowDragging(column: Column): boolean {
    return false;
  }

  public hasGroupedColumns(): boolean | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overrides use the param
  public getContextMenuItems(options: ContextMenuItemsOptions): GridContextMenuItem[] | undefined {
    return undefined;
  }
}

const resizing = (
  Base: ModuleType<ResizingController>,
): ModuleType<ResizingController> => class HeaderPanelResizingExtender extends Base {
  protected _updateDimensionsCore(): void {
    super._updateDimensionsCore();

    this.getView('headerPanel').updateToolbarDimensions();
  }
};

export const headerPanelModule = {
  defaultOptions(): InternalGridOptions {
    return {};
  },
  views: {
    headerPanel: HeaderPanel,
  },
  extenders: {
    controllers: {
      resizing,
    },
  },
};
