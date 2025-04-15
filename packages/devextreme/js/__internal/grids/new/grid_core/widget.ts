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

import * as ColumnChooserModule from './column_chooser/index';
import { CompatibilityColumnsController } from './columns_controller/compatibility';
import * as ColumnsControllerModule from './columns_controller/index';
import * as DataControllerModule from './data_controller/index';
import * as di from './di';
import { ErrorController } from './error_controller/error_controller';
import * as FilterControllerModule from './filtering';
import { ClearFilterVisitor } from './filtering/filter_visitors/clear_filter_visitor';
import { GetAppliedFilterVisitor } from './filtering/filter_visitors/get_applied_filters_visitor';
import { HeaderFilterController } from './filtering/header_filter';
import { HeaderFilterViewController } from './filtering/header_filter/view_controller';
import { ItemsController } from './items_controller/items_controller';
import { MainView } from './main_view';
import { defaultOptions, defaultOptionsRules, type Options } from './options';
import { PagerView } from './pager/view';
import * as SearchControllerModule from './search/index';
import * as SelectionControllerModule from './selection';
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

  private columnChooserController!: ColumnChooserModule.ColumnChooserController;

  protected columnChooserView!: ColumnChooserModule.ColumnChooserView;

  private toolbarController!: ToolbarController;

  private toolbarView!: ToolbarView;

  private errorController!: ErrorController;

  public searchController!: SearchControllerModule.SearchController;

  private searchView!: SearchView;

  public filterController!: FilterControllerModule.FilterController;

  private filterPanelView!: FilterControllerModule.FilterPanelView;

  private headerFilterViewController!: HeaderFilterViewController;

  private headerFilterController!: HeaderFilterController;

  private clearFilterVisitor!: ClearFilterVisitor;

  private getAppliedFiltersVisitor!: GetAppliedFilterVisitor;

  protected _registerDIContext(): void {
    this.diContext = new DIContext();
    di.register(this.diContext);
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
    this.searchController = this.diContext.get(SearchControllerModule.SearchController);
    this.columnChooserController = this.diContext.get(ColumnChooserModule.ColumnChooserController);
    this.columnChooserView = this.diContext.get(ColumnChooserModule.ColumnChooserView);
    this.errorController = this.diContext.get(ErrorController);
    this.filterController = this.diContext.get(FilterControllerModule.FilterController);
    this.headerFilterController = this.diContext.get(HeaderFilterController);
    this.filterPanelView = this.diContext.get(FilterControllerModule.FilterPanelView);
    this.headerFilterViewController = this.diContext.get(HeaderFilterViewController);
    this.searchView = this.diContext.get(SearchView);

    this.clearFilterVisitor = this.diContext.get(ClearFilterVisitor);
    this.getAppliedFiltersVisitor = this.diContext.get(GetAppliedFilterVisitor);
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
        ColumnChooserModule.PublicMethods(
          SelectionControllerModule.PublicMethods(
            SearchControllerModule.PublicMethods(
              GridCoreNewBase,
            ),
          ),
        ),
      ),
    ),
  ),
) {}
