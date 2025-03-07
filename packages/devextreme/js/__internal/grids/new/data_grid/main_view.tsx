/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { combined } from '@ts/core/reactive/index';
import { ColumnChooserView } from '@ts/grids/new/grid_core/column_chooser/view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/filter_panel';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType } from 'inferno';

import { ContentView } from './content_view/view';
import { HeadersView } from './headers/view';

interface MainViewProps {
  Toolbar: ComponentType;
  Headers: ComponentType;
  Content: ComponentType;
  Pager: ComponentType;
  FilterPanel: ComponentType;
  ColumnChooser: ComponentType;
}

function MainViewComponent({
  Toolbar, Content, Pager, FilterPanel, ColumnChooser, Headers,
}: MainViewProps): JSX.Element {
  return (<>
    <Toolbar/>
    <Headers/>
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
    <ColumnChooser/>
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  public static dependencies = [
    ContentView, HeadersView, PagerView, ToolbarView, FilterPanelView, ColumnChooserView,
  ] as const;

  constructor(
    private readonly content: ContentView,
    private readonly headers: HeadersView,
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
    private readonly filterPanel: FilterPanelView,
    private readonly columnChooser: ColumnChooserView,
  ) {
    super();
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected override getProps() {
    return combined({
      Toolbar: this.toolbar.asInferno(),
      Content: this.content.asInferno(),
      Pager: this.pager.asInferno(),
      FilterPanel: this.filterPanel.asInferno(),
      ColumnChooser: this.columnChooser.asInferno(),
      Headers: this.headers.asInferno(),
    });
  }
}
