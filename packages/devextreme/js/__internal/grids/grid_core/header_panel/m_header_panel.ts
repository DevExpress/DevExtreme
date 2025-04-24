/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { getPathParts } from '@js/core/utils/data';
import { isDefined } from '@js/core/utils/type';
import type { Properties as ToolbarProperties } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { HeaderFilterController } from '@ts/grids/grid_core/header_filter/m_header_filter';
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

  protected _editingController!: EditingController;

  protected _headerFilterController!: HeaderFilterController;

  public init() {
    super.init();
    this._editingController = this.getController('editing');
    this._headerFilterController = this.getController('headerFilter');
    this.createAction('onToolbarPreparing', { excludeValidators: ['disabled', 'readOnly'] });
  }

  /**
   * @extended: column_chooser, editing, filter_row, search
   */
  protected _getToolbarItems(): any[] {
    return [];
  }

  private _getButtonContainer() {
    return $('<div>').addClass(this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS));
  }

  protected _getToolbarButtonClass(specificClass) {
    const secondClass = specificClass ? ` ${specificClass}` : '';

    return this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS) + secondClass;
  }

  private _getToolbarOptions() {
    const userToolbarOptions: any = this.option('toolbar');

    const options = {
      toolbarOptions: {
        items: this._getToolbarItems(),
        visible: userToolbarOptions?.visible,
        disabled: userToolbarOptions?.disabled,
        onItemRendered(e) {
          const itemRenderedCallback = e.itemData.onItemRendered;

          if (itemRenderedCallback) {
            itemRenderedCallback(e);
          }
        },
      },
    };

    const userItems = userToolbarOptions?.items;
    options.toolbarOptions.items = normalizeToolbarItems(
      options.toolbarOptions.items,
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
      const $toolbar = $('<div>').attr('aria-label', label).appendTo($headerPanel);
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
            this._getToolbarItems(),
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
  protected allowDragging() {
  }

  public hasGroupedColumns(): any {}
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
