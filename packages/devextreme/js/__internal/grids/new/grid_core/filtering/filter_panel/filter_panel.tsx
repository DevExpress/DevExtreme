import type { FilterPanel } from '@js/common/grids';
import $ from '@js/core/renderer';
import type { Properties as FilterBuilderProperties } from '@js/ui/filter_builder';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type { FilterBuilderView as OldFilterBuilderView } from '@ts/grids/grid_core/filter/m_filter_builder';
import type { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';
import { Component, createRef } from 'inferno';

import { CLASSES } from '../../const';

export interface FilterPanelProps {
  oldFilterPanelView: OldFilterPanelView;
  oldFilterBuilderView: OldFilterBuilderView;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterValue?: any;

  filterPanel?: FilterPanel;
  filterBuilder?: FilterBuilderProperties;
  filterBuilderPopup?: PopupProperties;
}

export class FilterPanelComponent extends Component<FilterPanelProps> {
  private readonly filterPanelRef = createRef<HTMLDivElement>();

  private readonly filterBuilderRef = createRef<HTMLDivElement>();

  public render(): JSX.Element {
    return <>
        <div ref={this.filterPanelRef}></div>
        <div className={CLASSES.excludeFlexBox} ref={this.filterBuilderRef}></div>
    </>;
  }

  public componentDidMount(): void {
    this.props.oldFilterPanelView.render($(this.filterPanelRef.current));
    this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current));
  }

  public componentDidUpdate(): void {
    this.props.oldFilterPanelView.render($(this.filterPanelRef.current));
    this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current));
  }
}
