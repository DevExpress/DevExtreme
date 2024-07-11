import registerComponent from '../../../core/component_registrator';
import { GridPagerWrapper } from '../../component_wrapper/grid_pager';
import { Pager as PagerComponent } from './pager';

export default class Pager extends GridPagerWrapper {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  get _propsInfo() {
    return {
      twoWay: [
        ['pageSize', 'defaultPageSize', 'pageSizeChange'],
        ['pageIndex', 'defaultPageIndex', 'pageIndexChange'],
      ],
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

  get _viewComponent() {
    return PagerComponent;
  }
}

registerComponent('dxPager', Pager);
