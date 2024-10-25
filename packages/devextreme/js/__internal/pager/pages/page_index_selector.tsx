/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { Fragment } from 'inferno';

import { ConfigContext } from '../../core/r1/config_context';
import type { LightButtonProps } from '../common/light_button';
import { LightButton } from '../common/light_button';
import { PaginationDefaultProps, type PaginationProps } from '../common/pagination_props';
import { getLocalizationMessage } from '../utils/compatibility_utils';
import { PagesLarge } from './large';
import { PagesSmall } from './small';

const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
export const PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';

const classNames = {
  nextEnabledClass: `${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`,
  prevEnabledClass: `${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`,
  nextDisabledClass: `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`,
  prevDisabledClass: `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`,
};

type Direction = 'next' | 'prev';

const reverseDirections: { next: Direction; prev: Direction } = { next: 'prev', prev: 'next' };

function getIncrement(direction: Direction): number {
  return direction === 'next' ? +1 : -1;
}

export interface PageIndexSelectorProps {
  isLargeDisplayMode: boolean;
}

type PageIndexSelectorPropsType = Pick<PaginationProps, 'hasKnownLastPage'
| 'maxPagesCount'
| 'pageCount'
| 'pageIndex'
| 'pageIndexChangedInternal'
| 'pagesCountText'
| 'showNavigationButtons'
| 'itemCount'
>
& PageIndexSelectorProps;

const PageIndexSelectorDefaultProps: PageIndexSelectorPropsType = {
  isLargeDisplayMode: true,
  maxPagesCount: PaginationDefaultProps.maxPagesCount,
  pageCount: PaginationDefaultProps.pageCount,
  pageIndex: PaginationDefaultProps.pageIndex,
  pageIndexChangedInternal: PaginationDefaultProps.pageIndexChangedInternal,
  showNavigationButtons: PaginationDefaultProps.showNavigationButtons,
  itemCount: PaginationDefaultProps.itemCount,
};

interface NavigationButtonProps extends Pick<LightButtonProps, 'className' | 'tabIndex' > {navigate: LightButtonProps['onClick']}

interface NavigationButtonPropsCache {
  prevButtonProps: NavigationButtonProps | undefined;
  nextButtonProps: NavigationButtonProps | undefined;
}

export class PageIndexSelector extends BaseInfernoComponent<PageIndexSelectorPropsType> {
  public state: any = {};

  public refs: any = null;

  public __getterCache: NavigationButtonPropsCache = {
    prevButtonProps: undefined,
    nextButtonProps: undefined,
  };

  constructor(props) {
    super(props);
    this.pageIndexChangedInternal = this.pageIndexChangedInternal.bind(this);
    this.getButtonProps = this.getButtonProps.bind(this);
    this.canNavigateToPage = this.canNavigateToPage.bind(this);
    this.getNextPageIndex = this.getNextPageIndex.bind(this);
    this.canNavigateTo = this.canNavigateTo.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
  }

  getConfig(): any {
    if (this.context[ConfigContext.id]) {
      return this.context[ConfigContext.id];
    }
    return ConfigContext.defaultValue;
  }

  pageIndexChangedInternal(pageIndex: number): void {
    if (this.canNavigateToPage(pageIndex)) {
      this.props.pageIndexChangedInternal(pageIndex);
    }
  }

  getButtonProps(direction): NavigationButtonProps {
    // eslint-disable-next-line max-len
    const rtlAwareDirection = this.getConfig()?.rtlEnabled ? reverseDirections[direction] : direction;
    const canNavigate = this.canNavigateTo(rtlAwareDirection);
    const className = classNames[`${direction}${canNavigate ? 'Enabled' : 'Disabled'}Class`];
    return {
      className,
      tabIndex: canNavigate ? 0 : -1,
      navigate: () => this.navigateToPage(rtlAwareDirection),
    };
  }

  canNavigateToPage(pageIndex: number): boolean {
    if (!this.props.hasKnownLastPage) {
      return pageIndex >= 0;
    }
    return pageIndex >= 0 && pageIndex <= this.props.pageCount - 1;
  }

  getNextPageIndex(direction: Direction): number {
    return this.props.pageIndex + getIncrement(direction);
  }

  canNavigateTo(direction: Direction): boolean {
    return this.canNavigateToPage(this.getNextPageIndex(direction));
  }

  navigateToPage(direction: Direction): void {
    this.pageIndexChangedInternal(this.getNextPageIndex(direction));
  }

  getRenderPrevButton(): boolean {
    const {
      isLargeDisplayMode,
      showNavigationButtons,
    } = this.props;
    return (!isLargeDisplayMode || showNavigationButtons) ?? false;
  }

  getRenderNextButton(): boolean {
    return this.getRenderPrevButton() || !this.props.hasKnownLastPage;
  }

  getPrevButtonProps(): NavigationButtonProps {
    if (this.__getterCache.prevButtonProps !== undefined) {
      return this.__getterCache.prevButtonProps;
    }
    const result = ((): NavigationButtonProps => this.getButtonProps('prev'))();
    this.__getterCache.prevButtonProps = result;
    return result;
  }

  getNextButtonProps(): NavigationButtonProps {
    if (this.__getterCache.nextButtonProps !== undefined) {
      return this.__getterCache.nextButtonProps;
    }
    const result = ((): NavigationButtonProps => this.getButtonProps('next'))();
    this.__getterCache.nextButtonProps = result;
    return result;
  }

  componentWillUpdate(nextProps: PageIndexSelectorPropsType, nextState: any, context: any): void {
    const isComponentUpdated = this.context[ConfigContext.id] !== context[ConfigContext.id]
    || this.props.hasKnownLastPage !== nextProps.hasKnownLastPage
    || this.props.pageCount !== nextProps.pageCount
    || this.props.pageIndex !== nextProps.pageIndex
    || this.props.pageIndexChangedInternal !== nextProps.pageIndexChangedInternal;

    if (isComponentUpdated) {
      this.__getterCache.prevButtonProps = undefined;
      this.__getterCache.nextButtonProps = undefined;
    }
  }

  getPrevButtonLabel(): string {
    return getLocalizationMessage(this.context, 'dxPagination-prevPage');
  }

  getNextButtonLabel(): string {
    return getLocalizationMessage(this.context, 'dxPagination-nextPage');
  }

  render(): JSX.Element {
    const {
      className,
      tabIndex,
      navigate,
    } = this.getPrevButtonProps();

    const {
      isLargeDisplayMode,
      maxPagesCount,
      pageCount,
      pageIndex,
      pagesCountText,
    } = this.props;

    return (
      <Fragment>
        {this.getRenderPrevButton() && (
          <LightButton
            label={this.getPrevButtonLabel()}
            className={className}
            tabIndex={tabIndex}
            onClick={navigate}
          />
        )}
        {isLargeDisplayMode && (
          <PagesLarge
            maxPagesCount={maxPagesCount}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageIndexChangedInternal={this.pageIndexChangedInternal}
          />
        )}
        {!isLargeDisplayMode && (
          <PagesSmall
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageIndexChangedInternal={this.pageIndexChangedInternal}
            pagesCountText={pagesCountText}
          />
        )}
        {this.getRenderNextButton() && (
          <LightButton
            label={this.getNextButtonLabel()}
            className={this.getNextButtonProps().className}
            tabIndex={this.getNextButtonProps().tabIndex}
            onClick={this.getNextButtonProps().navigate}
          />
        )}
      </Fragment>
    );
  }
}
PageIndexSelector.defaultProps = PageIndexSelectorDefaultProps;
