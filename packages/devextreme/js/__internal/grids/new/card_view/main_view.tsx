import { combined } from '@ts/core/reactive/index';
import { ColumnsChooserView } from '@ts/grids/new/grid_core/columns_chooser/view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/view';
import { HeaderFilterPopupView } from '@ts/grids/new/grid_core/filtering/header_filter';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType } from 'inferno';

import type { Config } from '../grid_core/core/config_context';
import { ConfigContext } from '../grid_core/core/config_context';
import { EditPopupView } from '../grid_core/editing/popup/view';
import { ContentView } from './content_view/view';
import { HeaderPanelView } from './header_panel/view';
import { OptionsController } from './options_controller';

interface MainViewProps {
  Toolbar: ComponentType;
  Content: ComponentType;
  Pager: ComponentType;
  HeaderPanel: ComponentType;
  HeaderFilterPopup: ComponentType;
  FilterPanel: ComponentType;
  ColumnsChooser: ComponentType;
  EditPopup: ComponentType;
  config: Config;
}

function MainViewComponent({
  Toolbar, Content, Pager,
  HeaderPanel, HeaderFilterPopup, FilterPanel,
  ColumnsChooser, EditPopup, config,
}: MainViewProps): JSX.Element {
  return (<>
    <ConfigContext.Provider value={config}>
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
      <ColumnsChooser/>
      <EditPopup/>
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
    ColumnsChooserView,
    EditPopupView,
    OptionsController,
  ] as const;

  constructor(
    private readonly content: ContentView,
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
    private readonly headerPanel: HeaderPanelView,
    private readonly headerFilterPopup: HeaderFilterPopupView,
    private readonly filterPanel: FilterPanelView,
    private readonly columnsChooser: ColumnsChooserView,
    private readonly editPopup: EditPopupView,
    private readonly options: OptionsController,
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
      ColumnsChooser: this.columnsChooser.asInferno(),
      EditPopup: this.editPopup.asInferno(),
      config: combined({
        rtlEnabled: this.options.oneWay('rtlEnabled'),
        disabled: this.options.oneWay('disabled'),
        templatesRenderAsynchronously: this.options.oneWay('templatesRenderAsynchronously'),
      }),
    });
  }
}
