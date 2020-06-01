import {
  Component, ComponentBindings, JSXComponent, Event, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';
import LightButton from './light-button';
import LargePages from './pages-large';
import SmallPages from './pages-small';
import messageLocalization from '../../localization/message';

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
  renderNavButtons,
  prevClassName,
  navigateToPrevPage,
  nextClassName,
  navigateToNextPage,
  props: {
    isLargeDisplayMode, maxPagesCount,
    pageCount, pageIndex, pageIndexChange, pagesCountText,
    rtlEnabled,
  },
}: PageIndexSelector) => (
  <Fragment>
    {renderNavButtons
                && (
                <LightButton
                  className={prevClassName}
                  label="Previous page"
                  onClick={navigateToPrevPage}
                />
                )}
    {isLargeDisplayMode && (
    <LargePages
      maxPagesCount={maxPagesCount}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageIndexChange={pageIndexChange}
      rtlEnabled={rtlEnabled}
    />
    )}
    {!isLargeDisplayMode && (
    <SmallPages
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageIndexChange={pageIndexChange}
      pagesCountText={pagesCountText}
      rtlEnabled={rtlEnabled}
    />
    )}
    {renderNavButtons
                && (
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

  @OneWay() pageIndex?: number = 0;

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
export default class PageIndexSelector extends JSXComponent<PageIndexSelectorProps> {
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

  get renderNavButtons(): boolean {
    const {
      isLargeDisplayMode,
      showNavigationButtons,
    } = this.props as Required<PageIndexSelectorProps>;
    return !isLargeDisplayMode || showNavigationButtons;
  }

  getNextDirection(): Direction {
    return !this.props.rtlEnabled ? 'next' : 'prev';
  }

  getPrevDirection(): Direction {
    return !this.props.rtlEnabled ? 'prev' : 'next';
  }

  navigateToNextPage(): void {
    this.navigateToPage(this.getNextDirection());
  }

  navigateToPrevPage(): void {
    this.navigateToPage(this.getPrevDirection());
  }

  private canNavigateTo(direction: Direction): boolean {
    const isNextDirection = direction === 'next';
    const { pageCount, pageIndex } = this.props as Required<PageIndexSelectorProps>;
    return isNextDirection ? pageIndex < pageCount - 1 : pageIndex > 0;
  }

  private navigateToPage(direction: Direction): void {
    const canNavigate = this.canNavigateTo(direction);
    if (canNavigate && this.props.pageIndexChange) {
      this.props.pageIndexChange((this.props.pageIndex as number) + getIncrement(direction));
    }
  }
}
