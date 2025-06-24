/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
// eslint-disable-next-line max-classes-per-file
import { extend } from '@js/core/utils/extend';
import Widget from '@js/ui/widget/ui.widget';
import type { Signal } from '@ts/core/reactive/index';
import { signal } from '@ts/core/reactive/index';
import { DIContext } from '@ts/core/di/index';
import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import { SearchView } from '@ts/grids/new/grid_core/search/view';
import { rerender } from 'inferno';

import { AccessibilityController } from './accessibility/index';
import * as ColumnChooserModule from './column_chooser/index';
import { CompatibilityColumnsController } from './columns_controller/compatibility';
import * as ColumnsControllerModule from './columns_controller/index';
import * as DataControllerModule from './data_controller/index';
import * as di from './di';
import * as EditingModule from './editing/index';
import { EditPopupView } from './editing/popup/view';
import { ErrorController } from './error_controller/error_controller';
import { CompatibilityFilterSyncController, FilterSyncController } from './filtering/filter_sync/index';
import { CompatibilityHeaderFilterController, HeaderFilterController } from './filtering/header_filter/index';
import { HeaderFilterViewController } from './filtering/header_filter/view_controller';
import * as FilterControllerModule from './filtering/index';
import { ItemsController } from './items_controller/items_controller';
import { LifeCycleController } from './lifecycle/controller';
import { MainView } from './main_view';
import { defaultOptions, defaultOptionsRules, type Options } from './options';
import { PagerView } from './pager/view';
import * as SearchControllerModule from './search/index';
import * as SelectionControllerModule from './selection/index';
import type { SortingController } from './sorting_controller/index';
import * as SortingControllerModule from './sorting_controller/index';
import { ToolbarController } from './toolbar/controller';
import { ToolbarView } from './toolbar/view';
import { WidgetMock } from './widget_mock';

export class GridCoreNewBase<
  TProperties extends Options = Options,
> extends Widget<TProperties> {
  protected renderSubscription?: () => void;

  protected diContext!: DIContext;

  protected dataController!: DataControllerModule.DataController;

  protected itemsController!: ItemsController;

  protected columnsController!: ColumnsControllerModule.ColumnsController;

  protected sortingController!: SortingController;

  protected selectionController!: SelectionControllerModule.Controller;

  private editingController!: EditingModule.Controller;

  private editPopupView!: EditPopupView;

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

  public filterSyncController!: FilterSyncController;

  private accessibilityController!: AccessibilityController;

  private lifeCycleController!: LifeCycleController;

  // TODO: rewrite to lifeCycleController
  public initialized!: Signal<boolean>;

  protected _registerDIContext(): void {
    this.diContext = new DIContext();
    di.register(this.diContext);
  }

  protected _initWidgetMock() {
    this.diContext.registerInstance(WidgetMock, new WidgetMock(
      this,
      this.diContext.get(DataControllerModule.CompatibilityDataController),
      this.diContext.get(CompatibilityColumnsController),
      this.diContext.get(CompatibilityHeaderFilterController),
      this.diContext.get(CompatibilityFilterSyncController),
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
    this.editingController = this.diContext.get(EditingModule.Controller);
    this.editPopupView = this.diContext.get(EditPopupView);
    this.pagerView = this.diContext.get(PagerView);
    this.searchController = this.diContext.get(SearchControllerModule.SearchController);
    this.columnChooserController = this.diContext.get(ColumnChooserModule.ColumnChooserController);
    this.columnChooserView = this.diContext.get(ColumnChooserModule.ColumnChooserView);
    this.errorController = this.diContext.get(ErrorController);
    this.filterController = this.diContext.get(FilterControllerModule.FilterController);
    this.headerFilterController = this.diContext.get(HeaderFilterController);
    this.filterPanelView = this.diContext.get(FilterControllerModule.FilterPanelView);
    this.headerFilterViewController = this.diContext.get(HeaderFilterViewController);
    this.accessibilityController = this.diContext.get(AccessibilityController);
    this.filterSyncController = this.diContext.get(FilterSyncController);
    this.searchView = this.diContext.get(SearchView);
  }

  private _initLifeCycleController(): void {
    this.lifeCycleController = this.diContext.get(LifeCycleController);
    this.lifeCycleController.provideContentReadyCallback(() => {
      // @ts-expect-error
      this._fireContentReadyAction();
    });
  }

  protected _init(): void {
    // @ts-expect-error
    super._init();
    this.initialized = signal(false);
    this._registerDIContext();
    this._initWidgetMock();
    this._initDIContext();
    this._initLifeCycleController();
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

  protected _initializeComponent(): void {
    // @ts-expect-error usage of base method not described in d.ts
    super._initializeComponent();
    this.initialized.value = true;
  }

  // NOTE: this disables calling of _fireContentReadyAction on initial render
  protected _renderContent() {
    // @ts-expect-error
    this._renderContentImpl();
  }

  protected _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();
    this.renderSubscription = this.diContext.get(MainView).render(
      this.$element().get(0) as HTMLDivElement,
    );
    // NOTE: We flush all Inferno async render operations after initial render
    // Because after component creation markup should be ready
    rerender();
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
    this.renderSubscription?.();
    infernoRenderer.renderIntoContainer(null, this.$element().get(0), true);
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
              EditingModule.PublicMethods(
                GridCoreNewBase,
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) {}
