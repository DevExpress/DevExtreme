/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
// eslint-disable-next-line max-classes-per-file
import { extend } from '@js/core/utils/extend';
import Widget from '@js/ui/widget/ui.widget';
import { DIContext } from '@ts/core/di/index';
import type { Subscription } from '@ts/core/reactive/index';
import { SearchView } from '@ts/grids/new/grid_core/search/view';
import { render } from 'inferno';

import { CompatibilityColumnsController } from './columns_controller/compatibility';
import * as ColumnsControllerModule from './columns_controller/index';
import * as DataControllerModule from './data_controller/index';
import { ErrorController } from './error_controller/error_controller';
import { FilterPanelView } from './filtering/filter_panel/view';
import {
  HeaderFilterController,
  HeaderFilterPopupView,
} from './filtering/header_filter/index';
import * as FilterControllerModule from './filtering/index';
import { ItemsController } from './items_controller/items_controller';
import { MainView } from './main_view';
import { defaultOptions, defaultOptionsRules, type Options } from './options';
import { PagerView } from './pager/view';
import { SearchController } from './search/controller';
import * as SelectionControllerModule from './selection/index';
import * as SortingControllerModule from './sorting_controller/index';
import type { SortingController } from './sorting_controller/sorting_controller';
import { ToolbarController } from './toolbar/controller';
import { ToolbarView } from './toolbar/view';
import { WidgetMock } from './widget_mock';

export class GridCoreNewBase<
  TProperties extends Options = Options,
> extends Widget<TProperties> {
  protected renderSubscription?: Subscription;

  protected diContext!: DIContext;

  protected dataController!: DataControllerModule.DataController;

  protected itemsController!: ItemsController;

  protected columnsController!: ColumnsControllerModule.ColumnsController;

  protected sortingController!: SortingController;

  protected selectionController!: SelectionControllerModule.Controller;

  private pagerView!: PagerView;

  private toolbarController!: ToolbarController;

  private toolbarView!: ToolbarView;

  private errorController!: ErrorController;

  private searchController!: SearchController;

  private searchView!: SearchView;

  public filterController!: FilterControllerModule.FilterController;

  private filterPanelView!: FilterControllerModule.FilterPanelView;

  protected _registerDIContext(): void {
    this.diContext = new DIContext();
    this.diContext.register(DataControllerModule.DataController);
    this.diContext.register(DataControllerModule.CompatibilityDataController);
    this.diContext.register(ItemsController);
    this.diContext.register(ColumnsControllerModule.ColumnsController);
    this.diContext.register(SelectionControllerModule.Controller);
    this.diContext.register(ColumnsControllerModule.CompatibilityColumnsController);
    this.diContext.register(SortingControllerModule.SortingController);
    this.diContext.register(ToolbarController);
    this.diContext.register(ToolbarView);
    this.diContext.register(PagerView);
    this.diContext.register(SearchController);
    this.diContext.register(SearchView);
    this.diContext.register(FilterControllerModule.FilterController);
    this.diContext.register(FilterControllerModule.FilterPanelView);
    this.diContext.register(FilterPanelView);
    this.diContext.register(HeaderFilterController);
    this.diContext.register(HeaderFilterPopupView);
    this.diContext.register(ErrorController);
  }

  protected _initWidgetMock() {
    this.diContext.registerInstance(WidgetMock, new WidgetMock(
      this,
      this.diContext.get(DataControllerModule.CompatibilityDataController),
      this.diContext.get(CompatibilityColumnsController),
    ));
  }

  protected _initDIContext(): void {
    this.dataController = this.diContext.get(DataControllerModule.DataController);
    this.columnsController = this.diContext.get(ColumnsControllerModule.ColumnsController);
    this.sortingController = this.diContext.get(SortingControllerModule.SortingController);
    this.selectionController = this.diContext.get(SelectionControllerModule.Controller);
    this.itemsController = this.diContext.get(ItemsController);
    this.toolbarController = this.diContext.get(ToolbarController);
    this.toolbarView = this.diContext.get(ToolbarView);
    this.pagerView = this.diContext.get(PagerView);
    this.searchController = this.diContext.get(SearchController);
    this.searchView = this.diContext.get(SearchView);
    this.errorController = this.diContext.get(ErrorController);
    this.filterController = this.diContext.get(FilterControllerModule.FilterController);
    this.filterPanelView = this.diContext.get(FilterControllerModule.FilterPanelView);
  }

  protected _init(): void {
    // @ts-expect-error
    super._init();
    this._registerDIContext();
    this._initWidgetMock();
    this._initDIContext();
  }

  protected _getDefaultOptions() {
    return {
      // @ts-expect-error
      ...super._getDefaultOptions() as {},
      ...extend(true, {}, defaultOptions) as typeof defaultOptions,
    };
  }

  protected _defaultOptionsRules() {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._defaultOptionsRules().concat(defaultOptionsRules);
  }

  protected _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();
    this.renderSubscription = this.diContext.get(MainView).render(
      this.$element().get(0) as HTMLDivElement,
    );
  }

  private _optionChanged(args) {
    [
      this.filterPanelView,
    ].forEach((c) => {
      if (c.isCompatibilityMode()) {
        c.optionChanged(args);
      }
    });

    if (!args.handled) {
      // @ts-expect-error
      super._optionChanged(args);
    }
  }

  protected _clean(): void {
    this.renderSubscription?.unsubscribe();
    render(null, this.$element().get(0));
    // @ts-expect-error
    super._clean();
  }
}

export class GridCoreNew extends ColumnsControllerModule.PublicMethods(
  DataControllerModule.PublicMethods(
    SortingControllerModule.PublicMethods(
      FilterControllerModule.PublicMethods(
        SelectionControllerModule.PublicMethods(
          GridCoreNewBase,
        ),
      ),
    ),
  ),
) {}
