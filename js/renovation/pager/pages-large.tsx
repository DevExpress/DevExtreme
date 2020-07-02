import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  OneWay,
  Fragment,
} from 'devextreme-generator/component_declaration/common';

import { Page, PageProps } from './page';

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ pages }: PagesLarge) => {
  const PagesMarkup = pages.map((pageProps) => (pageProps !== null
    ? (
      <Page
        key={pageProps.index}
        index={pageProps.index}
        selected={pageProps.selected}
        onClick={pageProps.onClick}
      />
    )
    : <div key="delimiter" className={PAGER_PAGE_SEPARATOR_CLASS}>. . .</div>));
  return (<Fragment>{PagesMarkup}</Fragment>);
};

@ComponentBindings()
export class PagesLargeProps {
  @OneWay() maxPagesCount?: number = 10;

  @OneWay() pageCount?: number = 10;

  @OneWay() pageIndex?: number = 0;

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageIndexChange?: (pageIndex: number) => void = () => { }; // commonUtils.noop
}

const PAGES_LIMITER = 4;
type PageType = Partial<PageProps> | null;
type SlidingWindowState = {
  indexesForReuse: number[];
  slidingWindowIndexes: number[];
};

type PageIndexes = (number | null)[];
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
  if (delimiter === 'none') {
    pageIndexes = [...slidingWindowIndexes];
  } else if (delimiter === 'both') {
    pageIndexes = [0, null, ...slidingWindowIndexes, null, pageCount - 1];
    indexesForReuse = slidingWindowIndexes.slice(1, -1);
  } else if (delimiter === 'high') {
    pageIndexes = [0, ...slidingWindowIndexes, null, pageCount - 1];
    indexesForReuse = slidingWindowIndexes.slice(0, -1);
  } else if (delimiter === 'low') {
    pageIndexes = [0, null, ...slidingWindowIndexes, pageCount - 1];
    indexesForReuse = slidingWindowIndexes.slice(1);
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

@Component({ defaultOptionRules: null, view: viewFunction })
export class PagesLarge extends JSXComponent(PagesLargeProps) {
  get pages(): PageType[] {
    const { pageIndex } = this.props as Required<PagesLargeProps>;
    const createPage = (index = 0): PageType => ({
      index,
      onClick: () => this.onPageClick(index),
      selected: pageIndex === index,
    } as PageType);
    const rtlPageIndexes = this.props.rtlEnabled
      ? [...this.pageIndexes].reverse() : this.pageIndexes;
    return rtlPageIndexes.map((index): PageType => (index === null ? null : createPage(index)));
  }

  canReuseSlidingWindow(currentPageCount: number, pageIndex = 0): boolean {
    const { indexesForReuse } = this.slidingWindowState;
    const currentPageNotExistInIndexes = indexesForReuse.indexOf(currentPageCount) === -1;
    const pageIndexExistInIndexes = indexesForReuse.indexOf(pageIndex) !== -1;
    return currentPageNotExistInIndexes && pageIndexExistInIndexes;
  }

  generatePageIndexes(): PageIndexes {
    const { pageIndex, pageCount } = this.props as Required<PagesLargeProps>;
    let startIndex = 0;
    let slidingWindowSize = 0;
    let delimiter: DelimiterType = 'none';
    const slidingWindow = this.slidingWindowState.slidingWindowIndexes;
    if (pageIndex === slidingWindow[0]) {
      startIndex = pageIndex - 1;
      slidingWindowSize = PAGES_LIMITER;
      delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    } else if (pageIndex === slidingWindow[slidingWindow.length - 1]) {
      startIndex = pageIndex + 2 - PAGES_LIMITER;
      slidingWindowSize = PAGES_LIMITER;
      delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    } else if (pageIndex < PAGES_LIMITER) {
      startIndex = 1;
      slidingWindowSize = PAGES_LIMITER;
      delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    } else if (pageIndex >= pageCount - PAGES_LIMITER) {
      startIndex = pageCount - PAGES_LIMITER - 1;
      slidingWindowSize = PAGES_LIMITER;
      delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    } else {
      startIndex = pageIndex - 1;
      slidingWindowSize = PAGES_LIMITER;
      delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    }
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
    const { pageCount, maxPagesCount } = this.props as Required<PagesLargeProps>;
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
