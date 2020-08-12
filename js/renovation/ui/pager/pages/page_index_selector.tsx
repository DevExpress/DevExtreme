import {
  Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay, Fragment,
} from 'devextreme-generator/component_declaration/common';

import { LightButton } from '../common/light_button';
import { PagesLarge } from './large';
import { PagesSmall } from './small';
import messageLocalization from '../../../../localization/message';

const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
export const PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';

const nextButtonClassName = `${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`;
const prevButtonClassName = `${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`;
const nextButtonDisabledClassName = `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`;
const prevButtonDisabledClassName = `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  renderPrevButton,
  renderNextButton,
  prevClassName,
  navigateToPrevPage,
  nextClassName,
  navigateToNextPage,
  pageIndexChange,
  props: {
    isLargeDisplayMode, maxPagesCount,
    pageCount, pageIndex, pagesCountText,
    rtlEnabled,
  },
}: PageIndexSelector) => (
  <Fragment>
    {renderPrevButton && (
    <LightButton
      className={prevClassName}
      label="Previous page"
      onClick={navigateToPrevPage}
    />
    )}
    {isLargeDisplayMode && (
    <PagesLarge
      maxPagesCount={maxPagesCount}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageIndexChange={pageIndexChange}
      rtlEnabled={rtlEnabled}
    />
    )}
    {!isLargeDisplayMode && (
    <PagesSmall
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageIndexChange={pageIndexChange}
      pagesCountText={pagesCountText}
      rtlEnabled={rtlEnabled}
    />
    )}
    {renderNextButton && (
    <LightButton
      className={nextClassName}
      label="Next page"
      onClick={navigateToNextPage}
    />
    )}
  </Fragment>
);

@ComponentBindings()
export class PageIndexSelectorProps {
  @OneWay() hasKnownLastPage?: boolean = true;

  @OneWay() isLargeDisplayMode?: boolean = true;

  @OneWay() maxPagesCount?: number = 10;

  @OneWay() pageCount?: number = 10;

  @TwoWay() pageIndex?: number = 0;

  @Event() pageIndexChange?: (value: number) => void; // commonUtils.noop

  @OneWay() pagesCountText?: string = messageLocalization.getFormatter('dxPager-pagesCountText')();

  @OneWay() rtlEnabled?: boolean = false;

  @OneWay() showNavigationButtons?: boolean = false;

  @OneWay() totalCount?: number = 0;
}

function getIncrement(direction: Direction): number {
  return direction === 'next' ? +1 : -1;
}

type Direction = 'next' | 'prev';

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageIndexSelector extends JSXComponent(PageIndexSelectorProps) {
  private getNextDirection(): Direction {
    return !this.props.rtlEnabled ? 'next' : 'prev';
  }

  private getPrevDirection(): Direction {
    return !this.props.rtlEnabled ? 'prev' : 'next';
  }

  private canNavigateToPage(pageIndex: number): boolean {
    if (!this.props.hasKnownLastPage) {
      return pageIndex >= 0;
    }
    return (pageIndex >= 0 && pageIndex <= (this.props.pageCount as number) - 1);
  }

  private getNextPageIndex(direction: Direction): number {
    return (this.props.pageIndex as number) + getIncrement(direction);
  }

  private canNavigateTo(direction: Direction): boolean {
    return this.canNavigateToPage(this.getNextPageIndex(direction));
  }

  private navigateToPage(direction: Direction): void {
    this.pageIndexChange(this.getNextPageIndex(direction));
  }

  get renderPrevButton(): boolean {
    const {
      isLargeDisplayMode,
      showNavigationButtons,
    } = this.props as Required<PageIndexSelectorProps>;
    return !isLargeDisplayMode || showNavigationButtons;
  }

  get renderNextButton(): boolean {
    return this.renderPrevButton || !this.props.hasKnownLastPage;
  }

  get nextClassName(): string {
    const direction = this.getNextDirection();
    const canNavigate = this.canNavigateTo(direction);
    return canNavigate ? nextButtonClassName : nextButtonDisabledClassName;
  }

  get prevClassName(): string {
    const direction = this.getPrevDirection();
    const canNavigate = this.canNavigateTo(direction);
    return canNavigate ? prevButtonClassName : prevButtonDisabledClassName;
  }

  pageIndexChange(pageIndex: number): void {
    if (this.canNavigateToPage(pageIndex)) {
      this.props.pageIndex = pageIndex;
    }
  }

  navigateToNextPage(): void {
    this.navigateToPage(this.getNextDirection());
  }

  navigateToPrevPage(): void {
    this.navigateToPage(this.getPrevDirection());
  }
}
