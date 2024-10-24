/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination as PaginationComponent } from '../pagination';
import { PaginationWrapper } from './pagination_wrapper';

export default class Pagination extends PaginationWrapper {
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
        'isGridCompatibilityMode',
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
        'showPageSizeSelector',
        'allowedPageSizes',
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

        '_skipValidation',
      ],
    };
  }

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof PaginationComponent {
    return PaginationComponent;
  }
}
