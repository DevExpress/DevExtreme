import { FilterBuilderView as OldFilterBuilderView } from '@ts/grids/grid_core/filter/m_filter_builder';
import { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';
import { Component, createRef } from 'inferno';
import $ from '@js/core/renderer';

export interface FilterPanelProps {
    oldFilterPanelView: OldFilterPanelView;

    oldFilterBuilderView: OldFilterBuilderView;
}

export class FilterPanelComponent extends Component<FilterPanelProps> {
    private readonly filterPanelRef = createRef<HTMLDivElement>();
    private readonly filterBuilderRef = createRef<HTMLDivElement>();

    render(): JSX.Element {
        return <>
            <div ref={this.filterPanelRef}></div>
            <div ref={this.filterBuilderRef}></div>
        </>;
    }

    componentDidMount(): void {
        this.props.oldFilterPanelView.render($(this.filterPanelRef.current!));
        this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current!));
    }
    componentDidUpdate(): void {
        this.props.oldFilterPanelView.render($(this.filterPanelRef.current!));
        this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current!));
    }
}