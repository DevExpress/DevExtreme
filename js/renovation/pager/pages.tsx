import {
    Component,
    ComponentBindings,
    JSXComponent,
    Event,
    OneWay,
    Fragment,
    InternalState,
} from 'devextreme-generator/component_declaration/common';
import Page, { PageProps } from './page';
import { PAGER_INFO_CLASS } from './info';
import NumberBox from '../number-box';

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
export const viewFunction = ({
    pages,
    numberBoxProps,
    props: { isLargeDisplayMode, pageCount, pagesCountText },
}: Pages) => {
    if (isLargeDisplayMode) {
        const PagesMarkup = pages.map((pageProps, key) => {
            if (pageProps !== null) {
                const { index, selected, onClick } = pageProps;
                return (
                    <Page
                        key={key}
                        index={index}
                        selected={selected}
                        onClick={onClick}
                    />
                );
            }
            return (
                <div key={key} className={PAGER_PAGE_SEPARATOR_CLASS}>{'. . .'}</div>
            );
        });
        return <Fragment>{PagesMarkup}</Fragment>;
    }
    return (
        <div className={'dx-light-pages'}>
            <NumberBox {...numberBoxProps} />
            <span className={PAGER_INFO_TEXT_CLASS}>{pagesCountText}</span>
            <Page selected={false} index={pageCount! - 1} />
        </div>
    );
};

@ComponentBindings()
export class PagesProps {
    @OneWay() isLargeDisplayMode?: boolean = true;
    @OneWay() maxPagesCount?: number = 10;
    @OneWay() pageCount?: number = 10;
    @OneWay() pageIndex?: number = 0;
    // tslint:disable-next-line: max-line-length
    @OneWay() pagesCountText?: string = 'of'; // TODO messageLocalization.getFormatter('dxPager-pagesCountText');
    @OneWay() rtlEnabled?: boolean = false;
    @OneWay() totalCount?: number = 0;
    @Event() pageIndexChange?: (pageIndex: number) => void = () => { }; // commonUtils.noop
}

const PAGES_LIMITER = 4;
type PageType = Partial<PageProps> | null;
type PagesState = {
    lastPageIndex: number;
    pageIndexes: (number | null)[];
    startPageIndex: number;
} | null;

// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class Pages extends JSXComponent<PagesProps> {
    get numberBoxProps() /*: NumberBoxProps */ {
        const { pageIndex, pageCount } = this.props as Required<PagesProps>;
        return {
            value: pageIndex + 1,
            // tslint:disable-next-line: object-literal-sort-keys
            min: 1,
            max: pageCount,
            width: this.calculateLightPagesWidth(pageCount),
            valueChange: this.valueChanged,
        };
    }
    get pages(): PageType[] {
        const { pageIndex, pageCount, maxPagesCount } = this.props as Required<
            PagesProps
        >;
        let pageIndexes: (number | null)[] = [];
        const createPage = (index: number) => {
            return {
                index,
                onClick: () => this.onPageClick(index),
                selected: pageIndex === index,
            } as PageType;
        };
        if (pageCount > 0) {
            if (pageCount <= maxPagesCount) {
                for (let i = 0; i < pageCount; i += 1) {
                    pageIndexes.push(i);
                }
            } else {
                const usePrevState = this.canUsePrevState(pageIndex);
                const startIndex = this.getStartIndex(pageIndex, pageCount);
                pageIndexes = usePrevState
                    ? this.prevState!.pageIndexes
                    : this.getPageIndexes(startIndex, pageCount);
                if (!this.prevState || this.prevState?.startPageIndex !== startIndex) {
                    this.prevState = {
                        lastPageIndex: startIndex + PAGES_LIMITER - 1,
                        pageIndexes,
                        startPageIndex: startIndex,
                    };
                }
                return pageIndexes.map(index => index === null ? null : createPage(index));
            }
        }
        return pageIndexes.map(index => index === null ? null : createPage(index));
    }
    @InternalState() private prevState: PagesState = null;
    onPageClick(pageIndex: number) {
        if (this.props.pageIndexChange) {
            this.props.pageIndexChange(pageIndex);
        }
    }
    private calculateLightPagesWidth(pageCount: number) {
        // tslint:disable-next-line: max-line-length
        // return /*Number($pageIndex.css('minWidth').replace('px', '')) 40 + 10 * pageCount.toString().length; */
        return 40 + 10 * pageCount.toString().length;
    }
    private canUsePrevState(pageIndex: number) {
        return (
            this.prevState !== null &&
            this.prevState.startPageIndex < pageIndex &&
            pageIndex < this.prevState.lastPageIndex
        );
    }
    private getPageIndexes(startIndex: number, pageCount: number) {
        const pageIndexes: (number | null)[] = [];
        for (let i = 0; i < PAGES_LIMITER; i += 1) {
            pageIndexes.push(startIndex + i);
        }
        if (pageIndexes[0] === 1) {
            return [0, ...pageIndexes, null, pageCount - 1];
        }
        if (pageIndexes[pageIndexes.length - 1] === pageCount - 2) {
            return [0, null, ...pageIndexes, pageCount - 1];
        }
        return [0, null, ...pageIndexes, null, pageCount - 1];
    }
    private getStartIndex(pageIndex: number, pageCount: number) {
        let startIndex = pageIndex - 1;
        if (this.prevState !== null) {
            if (this.prevState.lastPageIndex === pageIndex) {
                startIndex = this.prevState.startPageIndex + 1;
            }
            if (this.prevState.startPageIndex === pageIndex) {
                startIndex = this.prevState.startPageIndex - 1;
            }
        }
        startIndex = Math.max(startIndex, 1);
        const isLastPage = startIndex + PAGES_LIMITER >= pageCount;
        return isLastPage ? pageCount - PAGES_LIMITER - 1 : startIndex;
    }
    private valueChanged() {
        // this.seelct option('pageIndex', e.value);
    }
}
