import { Component, ComponentBindings, JSXComponent, Event, OneWay } from 'devextreme-generator/component_declaration/common';
import SelectBox from '../select-box';
import { isObject } from '../../core/utils/type';

const PAGER_SELECTION_CLASS = 'dx-selection';
export const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';
export const PAGER_PAGE_SIZE_CLASS = 'dx-page-size';
export const PAGER_SELECTED_PAGE_SIZE_CLASS = `${PAGER_PAGE_SIZE_CLASS} ${PAGER_SELECTION_CLASS}`;

function smallSelector(selectBoxProps) {
    return (<SelectBox {...selectBoxProps} />);
}
function largeSelector(pageSizesText: { className: string; click: () => void; text: string; }[]) {
    return pageSizesText.map(({ text, className }, key) => (
        <div key={key} className={className}>{text}</div>
    ));
}
export const viewFunction = ({ pageSizesText, selectBoxProps,
                               props: { isLargeDisplayMode } }: PageSizeSelector) => {
    const PageSizesComponent = isLargeDisplayMode ?
                largeSelector(pageSizesText) : smallSelector(selectBoxProps);
    return (
        <div className={PAGER_PAGE_SIZES_CLASS}>
            {PageSizesComponent}
        </div>);
};
type FullPageSize = { text: string; value: number; };
type PageSize = number | FullPageSize;
@ComponentBindings()
export class PageSizeSelectorInput {
    @OneWay() isLargeDisplayMode = true;
    @OneWay() pageSize = 5;
    @Event() pageSizeChanged?: (pageSize: number) => void = () => { }; // commonUtils.noop
    // tslint:disable-next-line: member-ordering
    @OneWay() pageSizes: PageSize[] = [5, 10];
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class PageSizeSelector extends JSXComponent<PageSizeSelectorInput> {
    get pageSizesText() {
        const { pageSize, pageSizes } = this.props;
        return this.normalizedPageSizes(pageSizes).map((processedPageSize) => {
            const selected = processedPageSize.value === pageSize;
            const className = selected ? PAGER_SELECTED_PAGE_SIZE_CLASS : PAGER_PAGE_SIZE_CLASS;
            return {
                className,
                click: () => { },
                text: processedPageSize.text,
            };
        });
    }
    get selectBoxProps() {
        const { pageSizes, pageSize } = this.props;
        return {
            dataSource: this.normalizedPageSizes(pageSizes),
            displayExpr: 'text',
            onSelectionChanged: this.onSelectionChanged,
            value: pageSize,
            valueExpr: 'value',
            width: this.calculateLightPageSizesWidth(pageSizes),
        };
    }
    // TODO try to use flex
    private calculateLightPageSizesWidth(pageSizes) {
        // tslint:disable-next-line: max-line-length
        // return Number(this._$pagesSizeChooser.css('minWidth').replace('px', '')) + 10 * Math.max.apply(Math, pageSizes).toString().length;
        return  40 + 10 * Math.max.apply(Math, pageSizes).toString().length;
    }
    private normalizedPageSizes(pageSizes: PageSize[]): FullPageSize[] {
        return pageSizes.map((p) => {
            if (isObject(p)) {
                return p as FullPageSize;
            }
            return { text: String(p), value: p } as FullPageSize;
        });
    }
    private onSelectionChanged({ selectedItem }) {
        const { pageSizeChanged } = this.props;
        pageSizeChanged!(selectedItem);
    }
}
