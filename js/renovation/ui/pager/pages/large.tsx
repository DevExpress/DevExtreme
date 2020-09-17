import {
  Component,
  JSXComponent,
  Fragment,
} from 'devextreme-generator/component_declaration/common';
import { Page, PageProps } from './page';
import PagerProps from '../common/pager_props';

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ pages }: PagesLarge) => {
  const PagesMarkup = pages.map(({ key, pageProps }) => (pageProps
    ? (
      <Page
        key={key}
        index={pageProps.index}
        selected={pageProps.selected}
        onClick={pageProps.onClick}
      />
    )
    : (
      <div key={key} className={PAGER_PAGE_SEPARATOR_CLASS}>. . .</div>
    )
  ));
  return (<Fragment>{PagesMarkup}</Fragment>);
};

const PAGES_LIMITER = 4;
interface PageType {
  key: string;
  pageProps: Partial<PageProps> | null;
}
interface SlidingWindowState {
  indexesForReuse: number[];
  slidingWindowIndexes: number[];
}
type PageIndex = number | 'low' | 'high';
type PageIndexes = PageIndex[];
type DelimiterType = 'none' | 'low' | 'high' | 'both';

function getDelimiterType(
  startIndex: number, slidingWindowSize: number, pageCount: number,
): DelimiterType {
  if (startIndex === 1) {
    return 'high';
  } if (startIndex + slidingWindowSize === pageCount - 1) {
    return 'low';
  }
  return 'both';
}

function createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes: number[], pageCount: number,
  delimiter: DelimiterType): SlidingWindowState & { pageIndexes: PageIndexes } {
  let pageIndexes: PageIndexes = [];
  let indexesForReuse: number[] = [];
  // eslint-disable-next-line default-case
  switch (delimiter) {
    case 'none':
      pageIndexes = [...slidingWindowIndexes];
      break;
    case 'both':
      pageIndexes = [0, 'low', ...slidingWindowIndexes, 'high', pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(1, -1);
      break;
    case 'high':
      pageIndexes = [0, ...slidingWindowIndexes, 'high', pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(0, -1);
      break;
    case 'low':
      pageIndexes = [0, 'low', ...slidingWindowIndexes, pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(1);
      break;
  }
  return {
    slidingWindowIndexes, indexesForReuse, pageIndexes,
  };
}

function createPageIndexes(startIndex: number, slidingWindowSize: number, pageCount: number,
  delimiter: DelimiterType): ReturnType<typeof createPageIndexesBySlidingWindowIndexes> {
  const slidingWindowIndexes: number[] = [];
  for (let i = 0; i < slidingWindowSize; i += 1) {
    slidingWindowIndexes.push(i + startIndex);
  }
  return createPageIndexesBySlidingWindowIndexes(
    slidingWindowIndexes, pageCount, delimiter,
  );
}

type PagesLargePropsType = Pick<PagerProps,
'maxPagesCount' | 'pageCount' | 'pageIndex' | 'pageIndexChange'|'rtlEnabled'>;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PagesLarge extends JSXComponent<PagesLargePropsType>() {
  get pages(): PageType[] {
    const { pageIndex } = this.props;
    const createPage = (index: PageIndex): PageType => {
      const pagerProps = (index === 'low' || index === 'high') ? null
        : {
          index,
          onClick: (): void => this.onPageClick(index),
          selected: pageIndex === index,
        };
      return {
        key: index.toString(),
        pageProps: pagerProps,
      };
    };
    const rtlPageIndexes = this.props.rtlEnabled
      ? [...this.pageIndexes].reverse() : this.pageIndexes;
    return rtlPageIndexes.map((index): PageType => createPage(index));
  }

  canReuseSlidingWindow(currentPageCount: number, pageIndex: number): boolean {
    const { indexesForReuse } = this.slidingWindowState;
    const currentPageNotExistInIndexes = indexesForReuse.indexOf(currentPageCount) === -1;
    const pageIndexExistInIndexes = indexesForReuse.indexOf(pageIndex) !== -1;
    return currentPageNotExistInIndexes && pageIndexExistInIndexes;
  }

  generatePageIndexes(): PageIndexes {
    const { pageIndex, pageCount } = this.props;
    let startIndex = 0;
    const slidingWindow = this.slidingWindowState.slidingWindowIndexes;
    if (pageIndex === slidingWindow[0]) {
      startIndex = pageIndex - 1;
    } else if (pageIndex === slidingWindow[slidingWindow.length - 1]) {
      startIndex = pageIndex + 2 - PAGES_LIMITER;
    } else if (pageIndex < PAGES_LIMITER) {
      startIndex = 1;
    } else if (pageIndex >= pageCount - PAGES_LIMITER) {
      startIndex = pageCount - PAGES_LIMITER - 1;
    } else {
      startIndex = pageIndex - 1;
    }
    const slidingWindowSize = PAGES_LIMITER;
    const delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    const {
      pageIndexes,
      ...state
    } = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter);
    this.patchState(state);
    return pageIndexes;
  }

  patchState({ slidingWindowIndexes, indexesForReuse }: SlidingWindowState): void {
    this.slidingWindowState.slidingWindowIndexes = slidingWindowIndexes;
    this.slidingWindowState.indexesForReuse = indexesForReuse;
  }

  isSlidingWindowMode(): boolean {
    const { pageCount, maxPagesCount } = this.props;
    return (pageCount <= PAGES_LIMITER) || (pageCount <= maxPagesCount);
  }

  get pageIndexes(): PageIndexes {
    const { pageCount } = this.props as {pageCount: number};
    if (this.isSlidingWindowMode()) {
      return createPageIndexes(0, pageCount, pageCount, 'none').pageIndexes;
    }
    if (this.canReuseSlidingWindow(pageCount, this.props.pageIndex)) {
      const { slidingWindowIndexes } = this.slidingWindowState;
      const delimiter = getDelimiterType(
        slidingWindowIndexes[0], PAGES_LIMITER, pageCount,
      );
      return createPageIndexesBySlidingWindowIndexes(
        slidingWindowIndexes, pageCount, delimiter,
      ).pageIndexes;
    }
    return this.generatePageIndexes();
  }

  private slidingWindowState: SlidingWindowState = {
    indexesForReuse: [],
    slidingWindowIndexes: [],
  };

  onPageClick(pageIndex: number): void {
    this.props.pageIndexChange?.(pageIndex);
  }
}
