import { Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event } from 'devextreme-generator/component_declaration/common';
import InfoText from './info';
import PageIndexSelector from './page-index-selector';
import PageSizeSelector from './page-size-selector';

// import { getFormatter } from '../../localization/message';

export const PAGER_CLASS = 'dx-pager dx-datagrid-pager';
export const PAGER_PAGES_CLASS = 'dx-pages';
export const viewFunction = ({
    pageSizeChanged,
    isLargeDisplayMode,
    pageIndexChange,
    props: { infoTextMessageTemplate, maxPagesCount, pageIndex,
             pageCount, pageSize, pageSizes,
             pagesCountText, rtlEnabled,
             showNavigationButtons, totalCount },
    }: Pager) => {
    return (<div className={PAGER_CLASS}>
        <PageSizeSelector
            isLargeDisplayMode={isLargeDisplayMode}
            pageSize={pageSize}
            pageSizeChanged={pageSizeChanged}
            pageSizes={pageSizes}
        />
        <div className={PAGER_PAGES_CLASS}>
            <InfoText
                infoTextMessageTemplate={infoTextMessageTemplate}
                pageCount={pageCount}
                pageIndex={pageIndex}
                totalCount={totalCount}
            />
            <PageIndexSelector
                // hasKnownLastPage={hasKnownLastPage}
                isLargeDisplayMode={isLargeDisplayMode}
                maxPagesCount={maxPagesCount}
                pageCount={pageCount}
                pageIndex={pageIndex}
                pageIndexChange={pageIndexChange}
                pagesCountText={pagesCountText}
                rtlEnabled={rtlEnabled}
                showNavigationButtons={showNavigationButtons}
                totalCount={totalCount}
            />
        </div>
    </div>);
};

@ComponentBindings()
export class PagerProps {
    // TODO messageLocalization.getFormatter('dxPager-infoText'),
    @OneWay() infoTextMessageTemplate ? = 'Page {0} of {1} ({2} items)';
    @OneWay() lightModeEnabled ? = false;
    @OneWay() maxPagesCount ? = 10;
    @OneWay() pageCount ? = 10;
    // visible: true,
    // pagesNavigatorVisible: 'auto',
    @TwoWay() pageIndex?: number = 0;
    // TODO messageLocalization.getFormatter('dxPager-pagesCountText');
    @OneWay() pagesCountText ? = 'Of';
    @TwoWay() pageSize?: number = 5;
    // showPageSizes: true,
    @Event() pageSizeChange?: (pageSize: number) => void;
    @OneWay() pageSizes ? = [5, 10];
    @OneWay() rtlEnabled ? = false;
    @OneWay() showNavigationButtons ? = false;
    @OneWay() totalCount ? = 0;
    // hasKnownLastPage: true,
    // showInfo: false,
    // messageLocalization.getFormatter('dxPager-infoText'),
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class Pager extends JSXComponent<PagerProps> {
    get isLargeDisplayMode() { return !this.props.lightModeEnabled; }
    pageIndexChanged(newPageIndex: number) {
        this.props.pageIndex = newPageIndex;
    }
    pageSizeChanged(newPageSize: number) {
        this.props.pageSize = newPageSize;
    }
}
