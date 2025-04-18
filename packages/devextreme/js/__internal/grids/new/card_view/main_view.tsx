/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { combined } from '@ts/core/reactive/index';
import { ColumnChooserView } from '@ts/grids/new/grid_core/column_chooser/index';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/view';
import { HeaderFilterPopupView } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import { KeyboardNavigationController } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType, RefObject } from 'inferno';

import type { Config } from '../grid_core/core/config_context';
import { ConfigContext } from '../grid_core/core/config_context';
import { EditPopupView } from '../grid_core/editing/popup/view';
import { RootElementUpdater } from '../grid_core/inferno_wrappers/root_element_updater';
import { ContentView } from './content_view/view';
import { ContextMenuView } from './context_menu/view';
import { HeaderPanelView } from './header_panel/view';
import { OptionsController } from './options_controller';

const CLASSES = {
  cardView: 'dx-cardview',
};

interface MainViewProps {
  Toolbar: ComponentType;
  Content: ComponentType;
  Pager: ComponentType;
  HeaderPanel: ComponentType;
  HeaderFilterPopup: ComponentType;
  FilterPanel: ComponentType;
  ColumnChooser: ComponentType;
  EditPopup: ComponentType;
  ContextMenu: ComponentType;
  config: Config;
  rootElementRef: RefObject<HTMLDivElement>;
  onKeyDown: (event: KeyboardEvent) => void;
}

function MainViewComponent({
  Toolbar,
  Content,
  Pager,
  HeaderPanel,
  HeaderFilterPopup,
  FilterPanel,
  ColumnChooser,
  ContextMenu,
  EditPopup,
  config,
  rootElementRef,
  onKeyDown,
}: MainViewProps): JSX.Element {
  return (<>
    <ConfigContext.Provider value={config}>
        <RootElementUpdater
          rootElementRef={rootElementRef}
          className={CLASSES.cardView}
        >
          <div
            class="dx-cardview-root-container"
            onKeyDown={onKeyDown}
          >
            <Toolbar/>
            <HeaderPanel/>
            <HeaderFilterPopup />
            <Content/>
            <FilterPanel/>
            <div>
              {/*
                Pager, as renovated component, has strange disposing.
                See `inferno_renderer.remove` method.
                It somehow mutates $V prop of parent element.
                Without this div, CardView would be parent of Pager.
                In this case all `componentWillUnmount`s aren't called
              */}
              <Pager/>
            </div>
            <EditPopup/>
            <ColumnChooser/>
            <ContextMenu/>
          </div>
        </RootElementUpdater>
    </ConfigContext.Provider>
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  public static dependencies = [
    ContentView,
    PagerView,
    ToolbarView,
    HeaderPanelView,
    HeaderFilterPopupView,
    FilterPanelView,
    ColumnChooserView,
    EditPopupView,
    ContextMenuView,
    OptionsController,
    KeyboardNavigationController,
  ] as const;

  constructor(
    private readonly content: ContentView,
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
    private readonly headerPanel: HeaderPanelView,
    private readonly headerFilterPopup: HeaderFilterPopupView,
    private readonly filterPanel: FilterPanelView,
    private readonly columnsChooser: ColumnChooserView,
    private readonly editPopup: EditPopupView,
    private readonly contextMenu: ContextMenuView,
    private readonly options: OptionsController,
    private readonly keyboardNavigation: KeyboardNavigationController,
  ) {
    super();
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected override getProps() {
    return combined({
      Toolbar: this.toolbar.asInferno(),
      Content: this.content.asInferno(),
      Pager: this.pager.asInferno(),
      HeaderPanel: this.headerPanel.asInferno(),
      HeaderFilterPopup: this.headerFilterPopup.asInferno(),
      FilterPanel: this.filterPanel.asInferno(),
      ColumnChooser: this.columnsChooser.asInferno(),
      EditPopup: this.editPopup.asInferno(),
      ContextMenu: this.contextMenu.asInferno(),
      config: combined({
        rtlEnabled: this.options.oneWay('rtlEnabled'),
        disabled: this.options.oneWay('disabled'),
        templatesRenderAsynchronously: this.options.oneWay('templatesRenderAsynchronously'),
      }),
      rootElementRef: { current: this.root! },
      onKeyDown: (event: KeyboardEvent) => {
        this.keyboardNavigation.onKeyDown(event);
      },
    });
  }
}
