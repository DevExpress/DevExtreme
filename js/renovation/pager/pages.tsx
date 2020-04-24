// tslint:disable-next-line: max-line-length
import { Component, ComponentBindings, JSXComponent, Event, OneWay, Fragment, InternalState } from 'devextreme-generator/component_declaration/common';
import Page, { PageProps } from './page';
import { PAGER_INFO_CLASS } from './info';
import NumberBox from '../number-box';
// import { NumberBoxProps } from "../number-box";

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;

export const viewFunction = ({
    pages, numberBoxProps,
    props: {
        isLargeDisplayMode,
        pageCount,
        pagesCountText } }: Pages) => {
    if (isLargeDisplayMode) {
        const PagesMarkup = pages.map((pageProps, key) => {
            if (pageProps !== null) {
                const { index, selected, value } = pageProps;
                return (<Page key={key} index={index} selected={selected} value={value}/>);
            }
            return (<div key={key} className={PAGER_PAGE_SEPARATOR_CLASS}>. . .</div>);
        });
        return (<Fragment>
            {PagesMarkup}
        </Fragment>);
    }
    return (<div className={'dx-light-pages'}>
        <NumberBox {...numberBoxProps} />
        <span className={PAGER_INFO_TEXT_CLASS}>{pagesCountText}</span>
        <Page selected={false} index={pageCount! - 1} value={pageCount!.toString()} />
    </div>);
};

@ComponentBindings()
export class PagesProps {
    @OneWay() isLargeDisplayMode?: boolean = true;
    @OneWay() maxPagesCount?: number = 10;
    @OneWay() pageCount?: number = 10;
    @OneWay() pageIndex?: number = 0;
    @Event() pageIndexChange?: (pageIndex: number) => void = (() => { }); // commonUtils.noop
    // tslint:disable-next-line: max-line-length
    @OneWay() pagesCountText?: string = 'of'; // TODO messageLocalization.getFormatter('dxPager-pagesCountText');
    @OneWay() rtlEnabled?: boolean = false;
    @OneWay() totalCount?: number = 0;
}

const PAGES_LIMITER = 4;
type PageType = Partial<PageProps> | null;
// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class Pages extends JSXComponent<PagesProps> {
    get pages() {
        const { pageIndex, pageCount, maxPagesCount } = this.props as Required<PagesProps>;
        const pages: PageType[] = [];
        const createPage = (index) => {
            return {
                index, selected: pageIndex === index,
                value: (index + 1).toString(),
            } as PageType;
        };
        if (pageCount > 0) {
            if (pageCount <= maxPagesCount) {
                for (let i = 0; i < pageCount; i += 1) {
                    pages.push(createPage(i));
                }
            } else {
                let startIndex = this.limiterStartIndex === -1 ? pageIndex : this.limiterStartIndex;
                if (pageIndex === startIndex) {
                    startIndex = Math.max(startIndex - 1, 0);
                }
                // TODO _limiterStartIndex mutation
                // if(currentPageIndex + PAGES_LIMITER === startIndex) {
                //     startIndex =
                // }
                const isLastPage = (startIndex + PAGES_LIMITER >= pageCount);
                startIndex = isLastPage ? pageCount - PAGES_LIMITER : startIndex;
                if (startIndex >= 1) {
                    pages.push(createPage(0));
                    pages.push(null);
                }
                for (let i = 0; i < PAGES_LIMITER; i += 1) {
                    pages.push(createPage(startIndex + i));
                }
                if (startIndex + PAGES_LIMITER < pageCount) {
                    pages.push(null);
                    pages.push(createPage(pageCount - 1));
                }
            }
        }
        return pages;
    }

    get numberBoxProps() /*: NumberBoxProps */ {
        const { pageIndex, pageCount } = this.props as Required<PagesProps>;
        return {
            restAttributes: {},
            value: pageIndex + 1,
            // tslint:disable-next-line: object-literal-sort-keys
            min: 1,
            max: pageCount,
            width: this.calculateLightPagesWidth(pageCount),
            valueChange: this.valueChanged,
        };
    }
    @InternalState() private limiterStartIndex = -1;
    private calculateLightPagesWidth(pageCount) {
        // tslint:disable-next-line: max-line-length
        // return /*Number($pageIndex.css('minWidth').replace('px', '')) 40 + 10 * pageCount.toString().length; */
        return 40 + 10 * pageCount.toString().length;
    }
    /*onPageClick(pageIndex) {
        this._limiterStartIndex = pageIndex;
        this.props.pageIndex = pageIndex;
    }*/
    private valueChanged() {
        // this.seelct option('pageIndex', e.value);
    }
}
