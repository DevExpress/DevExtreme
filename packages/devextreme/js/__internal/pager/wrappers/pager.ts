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
      twoWay: [
        ['pageSize', 'defaultPageSize', 'pageSizeChangedInternal', 'pageSizeChanged'],
        ['pageIndex', 'defaultPageIndex', 'pageIndexChangedInternal', 'pageIndexChanged'],
      ],
      allowNull: [],
      elements: [],
      templates: [],
      props: [
        'defaultPageSize',
        'pageSizeChanged',
        'pageSizeChangedInternal',
        'defaultPageIndex',
        'pageIndexChanged',
        'pageIndexChangedInternal',
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
        'itemCount',
        'label',
        'onKeyDown',
        'pageSize',
        'pageIndex',

        'width',
        'height',
        'elementAttr',

        'hint',
        'disabled',
        'tabIndex',
        'accessKey',
        'activeStateEnabled',
        'focusStateEnabled',
        'hoverStateEnabled',
      ],
    };
  }

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof PagerComponent {
    return PagerComponent;
  }
}
