/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { Fragment } from 'inferno';

import type { ConfigContextValue } from '../../core/r1/config_context';
import { ConfigContext } from '../../core/r1/config_context';
import { PaginationDefaultProps, type PaginationProps } from '../common/pagination_props';
import type { PagePropsInterface } from './page';
import { Page } from './page';

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
const PAGES_LIMITER = 4;

interface PageType {
  key: string;
  pageProps: PagePropsInterface | null;
}

interface SlidingWindowState {
  indexesForReuse: number[];
  slidingWindowIndexes: number[];
}

type PageIndex = number | 'low' | 'high';
type DelimiterType = 'none' | 'low' | 'high' | 'both';

interface PageIndexes extends Array<PageIndex> {}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PagesLargePropsType = Pick<PaginationProps, 'maxPagesCount' | 'pageCount' | 'pageIndex' | 'pageIndexChangedInternal'>;

const PagesLargeDefaultProps: PagesLargePropsType = {
  maxPagesCount: PaginationDefaultProps.maxPagesCount,
  pageCount: PaginationDefaultProps.pageCount,
  pageIndex: PaginationDefaultProps.pageIndex,
  pageIndexChangedInternal: PaginationDefaultProps.pageIndexChangedInternal,
};

function getDelimiterType(
  startIndex: number,
  slidingWindowSize: number,
  pageCount: number,
): DelimiterType {
  switch (true) {
    case startIndex === 1:
      return 'high';
    case startIndex + slidingWindowSize === pageCount - 1:
      return 'low';
    default:
      return 'both';
  }
}

function createPageIndexesBySlidingWindowIndexes(
  slidingWindowIndexes: number[],
  pageCount: number,
  delimiter: DelimiterType,
): SlidingWindowState & { pageIndexes: PageIndexes } {
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

function createPageIndexes(
  startIndex: number,
  slidingWindowSize: number,
  pageCount: number,
  delimiter: DelimiterType,
): ReturnType<typeof createPageIndexesBySlidingWindowIndexes> {
  const slidingWindowIndexes: number[] = [];
  for (let i = 0; i < slidingWindowSize; i += 1) {
    slidingWindowIndexes.push(i + startIndex);
  }
  return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter);
}

export class PagesLarge extends BaseInfernoComponent<PagesLargePropsType> {
  public state: any = {};

  public refs: any = null;

  public config?: ConfigContextValue;

  private slidingWindowStateHolder!: SlidingWindowState;

  constructor(props) {
    super(props);
    this.canReuseSlidingWindow = this.canReuseSlidingWindow.bind(this);
    this.generatePageIndexes = this.generatePageIndexes.bind(this);
    this.isSlidingWindowMode = this.isSlidingWindowMode.bind(this);
    this.onPageClick = this.onPageClick.bind(this);
  }

  getConfig(): any {
    if (this.context[ConfigContext.id]) {
      return this.context[ConfigContext.id];
    }
    return ConfigContext.defaultValue;
  }

  getSlidingWindowState() {
    const slidingWindowState = this.slidingWindowStateHolder;
    if (!slidingWindowState) {
      return {
        indexesForReuse: [],
        slidingWindowIndexes: [],
      };
    }
    return slidingWindowState;
  }

  canReuseSlidingWindow(currentPageCount, pageIndex) {
    const {
      indexesForReuse,
    } = this.getSlidingWindowState();
    const lastPageIsFartherThanWindow = indexesForReuse.slice(-1)[0] < currentPageCount - 1;
    const pageIndexExistInIndexes = indexesForReuse.includes(pageIndex);
    return lastPageIsFartherThanWindow && pageIndexExistInIndexes;
  }

  generatePageIndexes() {
    const {
      pageCount,
      pageIndex,
    } = this.props;
    let startIndex = 0;
    const {
      slidingWindowIndexes,
    } = this.getSlidingWindowState();
    if (pageIndex === slidingWindowIndexes[0]) {
      startIndex = pageIndex - 1;
    } else if (pageIndex === slidingWindowIndexes[slidingWindowIndexes.length - 1]) {
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
    const indexes = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter);
    const {
      pageIndexes,
    } = indexes;
    this.slidingWindowStateHolder = indexes;
    return pageIndexes;
  }

  isSlidingWindowMode() {
    const {
      maxPagesCount,
      pageCount,
    } = this.props;
    return pageCount <= PAGES_LIMITER || pageCount <= maxPagesCount;
  }

  onPageClick(pageIndex) {
    this.props.pageIndexChangedInternal(pageIndex);
  }

  getPageIndexes() {
    const {
      pageCount,
    } = this.props;
    if (this.isSlidingWindowMode()) {
      return createPageIndexes(0, pageCount, pageCount, 'none').pageIndexes;
    }
    if (this.canReuseSlidingWindow(pageCount, this.props.pageIndex)) {
      const {
        slidingWindowIndexes,
      } = this.getSlidingWindowState();
      const delimiter = getDelimiterType(slidingWindowIndexes[0], PAGES_LIMITER, pageCount);
      return createPageIndexesBySlidingWindowIndexes(
        slidingWindowIndexes,
        pageCount,
        delimiter,
      ).pageIndexes;
    }
    return this.generatePageIndexes();
  }

  getPages(): PageType[] {
    const {
      pageIndex,
    } = this.props;
    const createPage = (index) => {
      const paginationProps = index === 'low' || index === 'high' ? null : {
        index,
        onClick: () => this.onPageClick(index),
        selected: pageIndex === index,
      };
      return {
        key: index.toString(),
        pageProps: paginationProps,
      };
    };
    const indices = this.getPageIndexes();
    const rtlPageIndexes = this.getConfig()?.rtlEnabled ? [...indices].reverse() : indices;
    return rtlPageIndexes.map((index) => createPage(index));
  }

  render(): JSX.Element {
    const PagesMarkup = this.getPages().map(({ key, pageProps }) => (pageProps
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
  }
}
PagesLarge.defaultProps = PagesLargeDefaultProps;
