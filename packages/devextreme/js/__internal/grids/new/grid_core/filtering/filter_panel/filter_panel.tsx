/* eslint-disable @typescript-eslint/no-non-null-assertion */
import $ from '@js/core/renderer';
import type { FilterBuilderView as OldFilterBuilderView } from '@ts/grids/grid_core/filter/m_filter_builder';
import type { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';
import { Component, createRef } from 'inferno';

export interface FilterPanelProps {
  oldFilterPanelView: OldFilterPanelView;

  oldFilterBuilderView: OldFilterBuilderView;

  visible?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterValue?: any;
  popupVisible?: boolean;
}

export class FilterPanelComponent extends Component<FilterPanelProps> {
  private readonly filterPanelRef = createRef<HTMLDivElement>();

  private readonly filterBuilderRef = createRef<HTMLDivElement>();

  public render(): JSX.Element {
    return <>
            <div ref={this.filterPanelRef}></div>
            <div ref={this.filterBuilderRef}></div>
        </>;
  }

  public componentDidMount(): void {
    this.props.oldFilterPanelView.render($(this.filterPanelRef.current!));
    this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current!));
  }

  public componentDidUpdate(): void {
    this.props.oldFilterPanelView.render($(this.filterPanelRef.current!));
    this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current!));
  }
}
