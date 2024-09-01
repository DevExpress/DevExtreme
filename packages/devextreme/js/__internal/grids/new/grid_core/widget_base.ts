/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
import browser from '@js/core/utils/browser';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { isMaterialBased } from '@js/ui/themes';
import Widget from '@js/ui/widget/ui.widget';
import { DIContext } from '@ts/core/di/index';
import type { Subscription } from '@ts/core/reactive';
import { ColumnsChooser } from '@ts/grids/new/grid_core/columns_chooser/columns_chooser';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { ColumnsDraggingController } from '@ts/grids/new/grid_core/columns_dragging/columns_dragging';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';
import { EditingController } from '@ts/grids/new/grid_core/editing/controller';
import { HeaderPanelController } from '@ts/grids/new/grid_core/header_panel/controller';
import { HeaderPanelView } from '@ts/grids/new/grid_core/header_panel/view';
import { HeadersView } from '@ts/grids/new/grid_core/headers/view';
import { MainView } from '@ts/grids/new/grid_core/main_view';
import { PagerView } from '@ts/grids/new/grid_core/pager';
import { Search } from '@ts/grids/new/grid_core/search/controller';
import { render } from 'inferno';

import { ContentStatusView } from './content_view/content_status_view';
import { ContentView } from './content_view/content_view';
import { FilterPanelView } from './filtering/filter_panel/filter_panel';

export class GridCoreNew<Properties> extends Widget<Properties> {
  protected renderSubscription?: Subscription;

  protected diContext!: DIContext;

  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private editingController!: EditingController;

  private pagerView!: PagerView;

  private columnsChooser!: ColumnsChooser;

  private headerPanelController!: HeaderPanelController;

  private headerPanelView!: HeaderPanelView;

  private search!: Search;

  protected _registerDIContext(): void {
    this.diContext = new DIContext();
    this.diContext.register(DataController);
    this.diContext.register(ColumnsController);
    this.diContext.register(HeaderPanelController);
    this.diContext.register(HeaderPanelView);
    this.diContext.register(EditingController);
    this.diContext.register(PagerView);
    this.diContext.register(MainView);
    this.diContext.register(ColumnsChooser);
    this.diContext.register(ColumnsDraggingController);
    this.diContext.register(HeadersView);
    this.diContext.register(Search);
    this.diContext.register(ContentStatusView);
    this.diContext.register(FilterPanelView);
    this.diContext.register(ContentView);
  }

  protected _initDIContext(): void {
    this.columnsChooser = this.diContext.get(ColumnsChooser);
    this.dataController = this.diContext.get(DataController);
    this.columnsController = this.diContext.get(ColumnsController);
    this.headerPanelController = this.diContext.get(HeaderPanelController);
    this.headerPanelView = this.diContext.get(HeaderPanelView);
    this.editingController = this.diContext.get(EditingController);
    this.pagerView = this.diContext.get(PagerView);
    this.search = this.diContext.get(Search);
  }

  protected _init(): void {
    // @ts-expect-error
    super._init();
    this._registerDIContext();
    this._initDIContext();
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  protected _getDefaultOptions() {
    return {
      // @ts-expect-error
      ...super._getDefaultOptions() as {},
      paging: {
        pageSize: 6,
        pageIndex: 0,
      },
      searchText: '',
      editingChanges: [],
    };
  }

  protected _defaultOptionsRules() {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._defaultOptionsRules().concat([
      {
        device() {
          // @ts-expect-error
          return isMaterialBased();
        },
        options: {
          headerFilter: {
            height: 315,
          },
          editing: {
            useIcons: true,
          },
          selection: {
            showCheckBoxesMode: 'always',
          },
        },
      },
      {
        device() {
          return browser.webkit;
        },
        options: {
          loadingTimeout: 30, // T344031
          loadPanel: {
            animation: {
              show: {
                easing: 'cubic-bezier(1, 0, 1, 0)',
                duration: 500,
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            },
          },
        },
      },
    ]);
  }

  protected _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();
    // @ts-expect-error
    this.renderSubscription = this.diContext.get(MainView).render(this.$element().get(0));
  }

  protected _clean(): void {
    this.renderSubscription?.unsubscribe();
    // @ts-expect-error
    render(null, this.$element().get(0));
    // @ts-expect-error
    super._clean();
  }

  public getScrollable(): dxScrollable {
    return this.diContext.get(ContentView).scrollableRef.current!;
  }
}
