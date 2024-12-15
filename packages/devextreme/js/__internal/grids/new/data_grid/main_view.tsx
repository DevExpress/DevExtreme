/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Subscribable } from '@ts/core/reactive/index';
import { ColumnsChooserView } from '@ts/grids/new/grid_core/columns_chooser/view';
import { View } from '@ts/grids/new/grid_core/core/view_old';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/filter_panel';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { InfernoNode } from 'inferno';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  public static dependencies = [
    PagerView, ToolbarView, FilterPanelView, ColumnsChooserView,
  ] as const;

  constructor(
    _pager: PagerView,
    toolbar: ToolbarView,
    _filterPanel: FilterPanelView,
    _columnsChooser: ColumnsChooserView,
  ) {
    super();
    const HeaderPanel = toolbar.asInferno();
    const Pager = _pager.asInferno();
    const FilterPanel = _filterPanel.asInferno();
    const ColumnsChooser = _columnsChooser.asInferno();

    this.vdom = <>
      <HeaderPanel/>
      <FilterPanel/>
      {/* @ts-expect-error */}
      <Pager/>
      {/* @ts-expect-error */}
      <ColumnsChooser/>
    </>;
  }
}
