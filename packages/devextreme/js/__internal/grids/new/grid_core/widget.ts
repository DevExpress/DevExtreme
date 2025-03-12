/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
// eslint-disable-next-line max-classes-per-file
import Widget from '@js/ui/widget/ui.widget';
import { DIContext } from '@ts/core/di/index';
import type { Subscription } from '@ts/core/reactive/index';
import { render } from 'inferno';

import { ColumnsChooserView } from './columns_chooser/view';
import { CompatibilityColumnsController } from './columns_controller/compatibility';
import * as ColumnsControllerModule from './columns_controller/index';
import * as DataControllerModule from './data_controller/index';
import { EditingController } from './editing/controller';
import { ErrorController } from './error_controller/error_controller';
import { FilterController } from './filtering';
import { FilterPanelView } from './filtering/filter_panel/view';
import { MainView } from './main_view';
import { defaultOptions, defaultOptionsRules, type Options } from './options';
import { PagerView } from './pager/view';
import { Search } from './search/controller';
import { ToolbarController } from './toolbar/controller';
import { ToolbarView } from './toolbar/view';
import { WidgetMock } from './widget_mock';

export class GridCoreNewBase<
  TProperties extends Options = Options,
> extends Widget<TProperties> {
  protected renderSubscription?: Subscription;

  protected diContext!: DIContext;

  protected dataController!: DataControllerModule.DataController;

  protected columnsController!: ColumnsControllerModule.ColumnsController;

  private editingController!: EditingController;

  private pagerView!: PagerView;

  private columnsChooser!: ColumnsChooserView;

  private toolbarController!: ToolbarController;

  private toolbarView!: ToolbarView;

  private errorController!: ErrorController;

  private search!: Search;

  private filterController!: FilterController;

  private filterPanelView!: FilterPanelView;

  protected _registerDIContext(): void {
    this.diContext = new DIContext();
    this.diContext.register(DataControllerModule.DataController);
    this.diContext.register(DataControllerModule.CompatibilityDataController);
    this.diContext.register(ColumnsControllerModule.ColumnsController);
    this.diContext.register(ColumnsControllerModule.CompatibilityColumnsController);
    this.diContext.register(ToolbarController);
    this.diContext.register(ToolbarView);
    this.diContext.register(EditingController);
    this.diContext.register(PagerView);
    this.diContext.register(ColumnsChooserView);
    this.diContext.register(Search);
    this.diContext.register(FilterController);
    this.diContext.register(FilterPanelView);
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
    this.columnsChooser = this.diContext.get(ColumnsChooserView);
    this.dataController = this.diContext.get(DataControllerModule.DataController);
    this.columnsController = this.diContext.get(ColumnsControllerModule.ColumnsController);
    this.toolbarController = this.diContext.get(ToolbarController);
    this.toolbarView = this.diContext.get(ToolbarView);
    this.editingController = this.diContext.get(EditingController);
    this.pagerView = this.diContext.get(PagerView);
    this.search = this.diContext.get(Search);
    this.errorController = this.diContext.get(ErrorController);
    this.filterController = this.diContext.get(FilterController);
    this.filterPanelView = this.diContext.get(FilterPanelView);
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
      ...defaultOptions,
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
    this.renderSubscription = this.diContext.get(MainView).render(this.$element().get(0));
  }

  private _optionChanged(args) {
    [
      this.pagerView,
      this.toolbarView,
      this.columnsChooser,
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
    GridCoreNewBase,
  ),
) {}
