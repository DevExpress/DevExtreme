/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { getPathParts } from '@js/core/utils/data';
import { isDefined } from '@js/core/utils/type';
import type { Properties as ToolbarProperties } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { HeaderFilterController } from '@ts/grids/grid_core/header_filter/m_header_filter';
import type { DefaultToolbarItem, ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';
import { normalizeToolbarItems } from '@ts/grids/new/grid_core/toolbar/utils';

import type { ModuleType } from '../m_types';
import { ColumnsView } from '../views/m_columns_view';
import type { ResizingController } from '../views/m_grid_view';

const HEADER_PANEL_CLASS = 'header-panel';
const TOOLBAR_BUTTON_CLASS = 'toolbar-button';

const TOOLBAR_ARIA_LABEL = '-ariaToolbar';

const DEFAULT_TOOLBAR_ITEM_NAMES = ['addRowButton', 'applyFilterButton', 'columnChooserButton', 'exportButton', 'groupPanel', 'revertButton', 'saveButton', 'searchPanel'];

export class HeaderPanel extends ColumnsView {
  private _toolbar?: Toolbar;

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

    if (!userItem) {
      return registeredItem;
    }

    return normalizeToolbarItems(
      [registeredItem] as DefaultToolbarItem[],
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

  private _getButtonContainer() {
    return $('<div>').addClass(this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS));
  }

  public getToolbarButtonClass(specificClass?: string): string {
    const secondClass = specificClass ? ` ${specificClass}` : '';

    return this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS) + secondClass;
  }

  private _getToolbarOptions(): ToolbarProperties<DefaultToolbarItem | ToolbarItem> {
    const { toolbar: userToolbarOptions } = this.option();
    const sortedToolbarItems: ToolbarItem[] = this.sortToolbarItems(this._getToolbarItems());

    const options: { toolbarOptions: ToolbarProperties<DefaultToolbarItem | ToolbarItem> } = {
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
      sortedToolbarItems as DefaultToolbarItem[],
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

  protected _renderCore() {
    if (!this._toolbar) {
      const $headerPanel = this.element();
      $headerPanel.addClass(this.addWidgetPrefix(HEADER_PANEL_CLASS));
      const label = messageLocalization.format(this.component.NAME + TOOLBAR_ARIA_LABEL);
      const $toolbar = $('<div>').appendTo($headerPanel);

      this.setAria('label', label, $toolbar);
      this._toolbar = this._createComponent($toolbar, Toolbar, this._toolbarOptions);
    } else {
      this._toolbar.option(this._toolbarOptions!);
    }
  }

  protected _columnOptionChanged() {

  }

  protected _handleDataChanged() {
    if (this._requireReady) {
      this.render();
    }
  }

  private _isDisabledDefinedByUser(name: string): boolean {
    const userItems = (this.option('toolbar') as any)?.items;
    const userItem = userItems?.find((item) => item?.name === name);

    return isDefined(userItem?.disabled);
  }

  public render() {
    this._toolbarOptions = this._getToolbarOptions();
    super.render.apply(this, arguments as any);
  }

  public setToolbarItemDisabled(name, disabled: boolean): void {
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

    const item: any = toolbar.option(`items[${itemIndex}]`);

    toolbar.option(`items[${itemIndex}].disabled`, disabled);

    if (item.options) {
      toolbar.option(`items[${itemIndex}].options.disabled`, disabled);
    }
  }

  public updateToolbarDimensions() {
    (this._toolbar as any)?.updateDimensions();
  }

  private getHeaderPanel() {
    return this.element();
  }

  private getHeight() {
    return this.getElementHeight();
  }

  public optionChanged(args) {
    if (args.name === 'onToolbarPreparing') {
      this._invalidate();
      args.handled = true;
    }
    if (args.name === 'toolbar') {
      const parts = getPathParts(args.fullName);
      const optionName = args.fullName.replace(/^toolbar\./, '');

      if (parts.length === 1 || parts[1] === 'visible') {
        // `toolbar`, `toolbar.visible` case
        this._invalidate();
      } else if (parts[1] === 'items') {
        if (parts.length === 2) {
          // `toolbar.items` case
          this._invalidate();
        } else if (parts.length === 3) {
          // `toolbar.items[i]` case
          const normalizedItem = normalizeToolbarItems(
            this._getToolbarItems() as DefaultToolbarItem[],
            [args.value],
            DEFAULT_TOOLBAR_ITEM_NAMES,
          )[0];
          this._toolbar?.option(optionName, normalizedItem);
        } else if (parts.length >= 4) {
          // `toolbar.items[i].prop` case
          this._toolbar?.option(optionName, args.value);
        }
      } else {
        // `toolbar.disabled` case
        this._toolbar?.option(optionName, args.value);
      }
      args.handled = true;
    }
    super.optionChanged(args);
  }

  /**
   * @extended: column_chooser, editing
   */
  public isVisible() {
    return !!(this._toolbarOptions && this._toolbarOptions.visible);
  }

  /**
   * @extended: DataGrid's grouping
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public allowDragging(column): boolean {
    return false;
  }

  public hasGroupedColumns(): any {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getContextMenuItems(options) {
    return undefined;
  }
}

const resizing = (Base: ModuleType<ResizingController>) => class HeaderPanelResizingExtender extends Base {
  protected _updateDimensionsCore() {
    // @ts-expect-error
    super._updateDimensionsCore.apply(this, arguments);

    this.getView('headerPanel').updateToolbarDimensions();
  }
};

export const headerPanelModule = {
  defaultOptions() {
    return {
    };
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
