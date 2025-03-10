import { combined } from '@ts/core/reactive/index';
import { View } from '@ts/grids/new/grid_core/core/view';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType } from 'inferno';

import { ContentView } from './content_view/view';
import { HeaderPanelView } from './header_panel/view';

interface MainViewProps {
  Toolbar: ComponentType;
  Content: ComponentType;
  Pager: ComponentType;
  HeaderPanel: ComponentType;
}

function MainViewComponent({
  Toolbar, Content, Pager, HeaderPanel,
}: MainViewProps): JSX.Element {
  return (<>
    {/* @ts-expect-error */}
    <Toolbar/>
    {/* @ts-expect-error */}
    <HeaderPanel/>
    {/* @ts-expect-error */}
    <Content/>
    <div>
      {/*
        Pager, as renovated component, has strange disposing.
        See `inferno_renderer.remove` method.
        It somehow mutates $V prop of parent element.
        Without this div, CardView would be parent of Pager.
        In this case all `componentWillUnmount`s aren't called
      */}
      {/* @ts-expect-error */}
      <Pager/>
    </div>
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  public static dependencies = [
    ContentView, PagerView, ToolbarView, HeaderPanelView,
  ] as const;

  constructor(
    private readonly content: ContentView,
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
    private readonly headerPanel: HeaderPanelView,
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
    });
  }
}
