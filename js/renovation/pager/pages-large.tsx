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

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ pages }: LargePages) => {
  const PagesMarkup = pages.map((pageProps) => {
    if (pageProps !== null) {
      const { index = 0, selected, onClick } = pageProps;
      return (
        <Page
          key={index.toString()}
          index={index}
          selected={selected}
          onClick={onClick}
        />
      );
    }
    return (
      <div key="delimiter" className={PAGER_PAGE_SEPARATOR_CLASS}>. . .</div>
    );
  });
  return (<Fragment>{PagesMarkup}</Fragment>);
};

@ComponentBindings()
export class LargePagesProps {
  @OneWay() maxPagesCount?: number = 10;

  @OneWay() pageCount?: number = 10;

  @OneWay() pageIndex?: number = 0;

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageIndexChange?: (pageIndex: number) => void = () => { }; // commonUtils.noop
}

const PAGES_LIMITER = 4;
type PageType = Partial<PageProps> | null;
type PagesState = {
  lastPageIndex: number;
  pageIndexes: (number | null)[];
  startPageIndex: number;
} | null;

function getPageIndexes(startIndex: number, pageCount: number): (number | null)[] {
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

// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class LargePages extends JSXComponent<LargePagesProps> {
  get pages(): PageType[] {
    const { pageIndex, pageCount, maxPagesCount } = this.props as Required<LargePagesProps>;
    let pageIndexes: (number | null)[] = [];
    const createPage = (index: number): PageType => ({
      index,
      onClick: () => this.onPageClick(index),
      selected: pageIndex === index,
    } as PageType);
    if (pageCount > 0) {
      if (pageCount <= maxPagesCount) {
        for (let i = 0; i < pageCount; i += 1) {
          pageIndexes.push(i);
        }
      } else {
        const startIndex = this.getStartIndex(pageIndex, pageCount);
        const usePrevState = this.canUsePrevState(pageIndex, pageCount);
        pageIndexes = usePrevState
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ? this.prevState!.pageIndexes
          : getPageIndexes(startIndex, pageCount);
        if (!usePrevState) {
          this.prevState = {
            lastPageIndex: startIndex + PAGES_LIMITER - 1,
            pageIndexes,
            startPageIndex: startIndex,
          };
        }
      }
    }
    const rtlPageIndexes = this.props.rtlEnabled ? [...pageIndexes].reverse() : pageIndexes;
    return rtlPageIndexes.map((index) => (index === null ? null : createPage(index)));
  }

  @InternalState() private prevState: PagesState = null;

  onPageClick(pageIndex: number): void {
    if (this.props.pageIndexChange) {
      this.props.pageIndexChange(pageIndex);
    }
  }

  private canUsePrevState(pageIndex: number, pageCount: number): boolean {
    if (this.prevState !== null) {
      const { startPageIndex, lastPageIndex } = this.prevState;
      const isFirstOrLastPage = pageIndex === 0 || pageIndex === pageCount - 1;
      const isInRange = (startPageIndex < pageIndex && pageIndex < lastPageIndex);
      const isNextAfterFirst = (startPageIndex === 1 && startPageIndex === pageIndex);
      const isPrevBeforeLast = (lastPageIndex === pageIndex
                && lastPageIndex === pageCount - 2);
      const isNotFirstOrLastInRange = startPageIndex !== pageIndex
                || lastPageIndex !== pageIndex;
      return isFirstOrLastPage || (isInRange || isNextAfterFirst || isPrevBeforeLast)
                || !isNotFirstOrLastInRange;
    }
    return false;
  }

  private getStartIndex(pageIndex: number, pageCount: number): number {
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
}
