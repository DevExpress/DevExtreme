import { combined } from '@ts/core/reactive/index';
import { ColumnChooserView } from '@ts/grids/new/grid_core/column_chooser';
import { View } from '@ts/grids/new/grid_core/core/view';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType } from 'inferno';

import type { Config } from '../grid_core/core/config_context';
import { ConfigContext } from '../grid_core/core/config_context';
import { ContentView } from './content_view/view';
import { HeaderPanelView } from './header_panel/view';
import { OptionsController } from './options_controller';

interface MainViewProps {
  Toolbar: ComponentType;
  Content: ComponentType;
  Pager: ComponentType;
  HeaderPanel: ComponentType;
  ColumnChooser: ComponentType;
  config: Config;
}

function MainViewComponent({
  Toolbar, Content, Pager, HeaderPanel, ColumnChooser, config,
}: MainViewProps): JSX.Element {
  return (<>
    <ConfigContext.Provider value={config}>
      <Toolbar/>
      <HeaderPanel/>
      <Content/>
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
      <ColumnChooser/>
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
    ColumnChooserView,
    OptionsController,
  ] as const;

  constructor(
    private readonly content: ContentView,
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
    private readonly headerPanel: HeaderPanelView,
    private readonly columnsChooser: ColumnChooserView,
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
      ColumnChooser: this.columnsChooser.asInferno(),
      config: combined({
        rtlEnabled: this.options.oneWay('rtlEnabled'),
        disabled: this.options.oneWay('disabled'),
        templatesRenderAsynchronously: this.options.oneWay('templatesRenderAsynchronously'),
      }),
    });
  }
}
