/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pager as PagerComponent } from '../pager';
import { GridPagerWrapper } from './grid_pager';

export default class Pager extends GridPagerWrapper {
  getProps(): Record<string, unknown> {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown as any);
    return props;
  }

  get _propsInfo(): any {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: [
        'defaultPageSize',
        'pageSizeChange',
        'defaultPageIndex',
        'pageIndexChange',
        'gridCompatibility',
        'className',
        'showInfo',
        'infoText',
        'lightModeEnabled',
        'displayMode',
        'maxPagesCount',
        'pageCount',
        'pagesCountText',
        'visible',
        'hasKnownLastPage',
        'pagesNavigatorVisible',
        'showPageSizes',
        'pageSizes',
        'rtlEnabled',
        'showNavigationButtons',
        'totalCount',
        'label',
        'onKeyDown',
        'pageSize',
        'pageIndex',
      ],
    };
  }

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof PagerComponent {
    return PagerComponent;
  }
}
