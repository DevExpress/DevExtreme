import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Fragment,
  Consumer,
} from '@devextreme-generator/declarations';

import { LightButton, LightButtonProps } from '../common/light_button';
import { PagesLarge } from './large';
import { PagesSmall } from './small';
import { InternalPagerProps } from '../common/pager_props';
import {
  ConfigContextValue,
  ConfigContext,
} from '../../../common/config_context';
import messageLocalization from '../../../../localization/message';

const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
export const PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';

const getNextButtonLabel = (): string => messageLocalization.getFormatter('dxPager-nextPage')();
const getPrevButtonLabel = (): string => messageLocalization.getFormatter('dxPager-prevPage')();

const classNames = {
  nextEnabledClass: `${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`,
  prevEnabledClass: `${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`,
  nextDisabledClass: `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`,
  prevDisabledClass: `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`,
};

const reverseDirections: { next: Direction; prev: Direction } = { next: 'prev', prev: 'next' };
export const viewFunction = ({
  renderPrevButton,
  renderNextButton,
  prevButtonProps,
  nextButtonProps,
  pageIndexChange,
  props: {
    isLargeDisplayMode,
    maxPagesCount,
    pageCount,
    pageIndex,
    pagesCountText,
  },
}: PageIndexSelector): JSX.Element => (
  <Fragment>
    {renderPrevButton && (
      <LightButton
        label={getPrevButtonLabel()}
        className={prevButtonProps.className}
        tabIndex={prevButtonProps.tabIndex}
        onClick={prevButtonProps.navigate}
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
        label={getNextButtonLabel()}
        className={nextButtonProps.className}
        tabIndex={nextButtonProps.tabIndex}
        onClick={nextButtonProps.navigate}
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

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PageIndexSelectorPropsType = Pick<InternalPagerProps, 'hasKnownLastPage'
| 'maxPagesCount'
| 'pageCount'
| 'pageIndex'
| 'pageIndexChange'
| 'pagesCountText'
| 'showNavigationButtons'
| 'totalCount'
>
& PageIndexSelectorProps;

interface NavigationButtonProps extends Pick<LightButtonProps, 'className' | 'tabIndex' > {navigate: LightButtonProps['onClick']}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageIndexSelector extends JSXComponent<PageIndexSelectorPropsType, 'pageIndexChange'>() {
  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  pageIndexChange(pageIndex: number): void {
    if (this.canNavigateToPage(pageIndex)) {
      this.props.pageIndexChange(pageIndex);
    }
  }

  private getButtonProps(direction: Direction): NavigationButtonProps {
    const rtlAwareDirection = this.config?.rtlEnabled ? reverseDirections[direction] : direction;
    const canNavigate = this.canNavigateTo(rtlAwareDirection);
    const className = classNames[`${direction}${canNavigate ? 'Enabled' : 'Disabled'}Class`];
    return {
      className,
      tabIndex: canNavigate ? 0 : -1,
      navigate: (): void => this.navigateToPage(rtlAwareDirection),
    };
  }

  private canNavigateToPage(pageIndex: number): boolean {
    if (!this.props.hasKnownLastPage) {
      return pageIndex >= 0;
    }
    return pageIndex >= 0 && pageIndex <= this.props.pageCount - 1;
  }

  private getNextPageIndex(direction: Direction): number {
    return this.props.pageIndex + getIncrement(direction);
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

  get prevButtonProps(): NavigationButtonProps {
    return this.getButtonProps('prev');
  }

  get nextButtonProps(): NavigationButtonProps {
    return this.getButtonProps('next');
  }
}
