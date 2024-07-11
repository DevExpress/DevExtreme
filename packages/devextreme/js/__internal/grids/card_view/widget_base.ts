import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { Properties } from '@js/ui/card_view';
import { isMaterialBased } from '@js/ui/themes';
import Widget from '@js/ui/widget/ui.widget';
import { DIContext } from '@ts/core/di';

import { ColumnsChooser } from './columns_chooser/columns_chooser';
import { ColumnsController } from './columns_controller/columns_controller';
import { ColumnsDraggingController } from './columns_dragging/columns_dragging';
import { ContentView } from './content_view/content_view';
import { DataController } from './data_controller/data_controller';
import type { EditingController } from './editing/controller';
import { HeaderPanelController } from './header_panel/controller';
import { HeaderPanelView } from './header_panel/view';
import { HeadersView } from './headers/view';
import { MainView } from './main_view';
import { OptionsController } from './options_controller/options_controller';
import { PagerView } from './pager';

class CardView extends Widget<Properties> {
  private diContext!: DIContext;

  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private readonly editingController!: EditingController;

  private contentView!: ContentView;

  private pagerView!: PagerView;

  private columnsChooser!: ColumnsChooser;

  private headerPanelController!: HeaderPanelController;

  private headerPanelView!: HeaderPanelView;

  protected _init() {
    // @ts-expect-error
    super._init();

    this.diContext = new DIContext();
    this.diContext.register(DataController);
    this.diContext.register(ColumnsController);
    this.diContext.register(HeaderPanelController);
    this.diContext.register(HeaderPanelView);
    // this.diContext.register(EditingController);
    this.diContext.register(ContentView);
    this.diContext.register(PagerView);
    this.diContext.register(MainView);
    this.diContext.register(ColumnsChooser);
    this.diContext.register(ColumnsDraggingController);
    this.diContext.register(HeadersView);
    this.diContext.registerInstance(OptionsController, new OptionsController(this));

    this.columnsChooser = this.diContext.get(ColumnsChooser);
    this.dataController = this.diContext.get(DataController);
    this.columnsController = this.diContext.get(ColumnsController);
    this.headerPanelController = this.diContext.get(HeaderPanelController);
    this.headerPanelView = this.diContext.get(HeaderPanelView);
    // this.editingController = this.diContext.get(EditingController);
    this.contentView = this.diContext.get(ContentView);
    this.pagerView = this.diContext.get(PagerView);
  }

  protected _getDefaultOptions() {
    return {
      // @ts-expect-error
      ...super._getDefaultOptions(),
      paging: {
        pageSize: 5,
        pageIndex: 0,
      },
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

  protected _initMarkup() {
    // @ts-expect-error
    super._initMarkup.apply(this, arguments);
    // @ts-expect-error
    this.diContext.get(MainView).render(this.$element().get(0));
  }
}

// @ts-expect-error
registerComponent('dxCardView', CardView);

export default CardView;
