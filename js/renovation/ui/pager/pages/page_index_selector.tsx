import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Consumer,
} from '@devextreme-generator/declarations';

import { LightButton } from '../common/light_button';
import { PagesLarge } from './large';
import { PagesSmall } from './small';
import { PagerProps } from '../common/pager_props';
import { ConfigContextValue, ConfigContext } from '../../../common/config_context';

const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
export const PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';

const nextButtonClassName = `${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`;
const prevButtonClassName = `${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`;
const nextButtonDisabledClassName = `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`;
const prevButtonDisabledClassName = `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`;
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
  },
}: PageIndexSelector): JSX.Element => (
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
    />
    )}
    {!isLargeDisplayMode && (
    <PagesSmall
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageIndexChange={pageIndexChange}
      pagesCountText={pagesCountText}
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
type Direction = 'next' | 'prev';
function getIncrement(direction: Direction): number {
  return direction === 'next' ? +1 : -1;
}

/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class PageIndexSelectorProps {
  @OneWay() isLargeDisplayMode = true;
}

type PageIndexSelectorPropsType = Pick<PagerProps,
'hasKnownLastPage' | 'maxPagesCount' | 'pageCount' | 'pageIndex' | 'pageIndexChange' | 'pagesCountText' |
'showNavigationButtons' | 'totalCount'> & PageIndexSelectorProps;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageIndexSelector extends JSXComponent<PageIndexSelectorPropsType>() {
  @Consumer(ConfigContext)
  config?: ConfigContextValue;

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

  private getNextDirection(): Direction {
    return !this.config?.rtlEnabled ? 'next' : 'prev';
  }

  private getPrevDirection(): Direction {
    return !this.config?.rtlEnabled ? 'prev' : 'next';
  }

  private canNavigateToPage(pageIndex: number): boolean {
    if (!this.props.hasKnownLastPage) {
      return pageIndex >= 0;
    }
    return pageIndex >= 0 && pageIndex <= (this.props.pageCount as number) - 1;
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
    } = this.props;
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
}
