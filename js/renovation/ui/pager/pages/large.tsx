import {
  Component,
  JSXComponent,
  Fragment,
  Consumer,
  Mutable,
} from '@devextreme-generator/declarations';
import { Page, PageProps } from './page';
import { PagerProps } from '../common/pager_props';
import { ConfigContextValue, ConfigContext } from '../../../common/config_context';

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
export const viewFunction = ({ pages }: PagesLarge): JSX.Element => {
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
type DelimiterType = 'none' | 'low' | 'high' | 'both';
interface PageIndexes extends Array<PageIndex> {}

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

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PagesLargePropsType = Pick<PagerProps, 'maxPagesCount' | 'pageCount' | 'pageIndex' | 'pageIndexChange'>;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PagesLarge extends JSXComponent<PagesLargePropsType>() {
  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  @Mutable()
  slidingWindowStateHolder!: SlidingWindowState;

  private get slidingWindowState(): SlidingWindowState {
    const slidingWindowState = this.slidingWindowStateHolder;
    if (!slidingWindowState) {
      return {
        indexesForReuse: [],
        slidingWindowIndexes: [],
      };
    }
    return slidingWindowState;
  }

  private canReuseSlidingWindow(currentPageCount: number, pageIndex: number): boolean {
    const { indexesForReuse } = this.slidingWindowState;
    const currentPageNotExistInIndexes = !indexesForReuse.includes(currentPageCount);
    const pageIndexExistInIndexes = indexesForReuse.includes(pageIndex);
    return currentPageNotExistInIndexes && pageIndexExistInIndexes;
  }

  private generatePageIndexes(): PageIndexes {
    const { pageIndex, pageCount } = this.props;
    let startIndex = 0;
    const { slidingWindowIndexes } = this.slidingWindowState;
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
    const {
      pageIndexes,
      ...slidingWindowState
    } = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter);
    this.slidingWindowStateHolder = slidingWindowState;
    return pageIndexes;
  }

  private isSlidingWindowMode(): boolean {
    const { pageCount, maxPagesCount } = this.props;
    return (pageCount <= PAGES_LIMITER) || (pageCount <= maxPagesCount);
  }

  private onPageClick(pageIndex: number): void {
    this.props.pageIndexChange?.(pageIndex);
  }

  get pageIndexes(): PageIndexes {
    const { pageCount } = this.props as { pageCount: number };
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

  get pages(): PageType[] {
    const { pageIndex } = this.props;
    const createPage = (index: PageIndex): PageType => {
      const pagerProps = index === 'low' || index === 'high' ? null
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
    const rtlPageIndexes = this.config?.rtlEnabled
      ? [...this.pageIndexes].reverse() : this.pageIndexes;
    return rtlPageIndexes.map((index): PageType => createPage(index));
  }
}
