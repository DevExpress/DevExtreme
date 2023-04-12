import {
  ComponentBindings,
  OneWay,
  TwoWay,
  Event,
} from '@devextreme-generator/declarations';
import { BasePagerProps } from './base_pager_props';

import { EventCallback } from '../../common/event_callback';

const PAGER_PAGE_INDEX_DESCRIPTION = 'Page index';

@ComponentBindings()
export class PagerProps extends BasePagerProps {
  @TwoWay() pageSize = 5;

  @TwoWay() pageIndex = 1;
}

@ComponentBindings()
export class InternalPagerProps extends BasePagerProps {
  @OneWay() pageSize = 5;

  @OneWay() pageIndex = 1;

  @OneWay() inputAttr = {
    'aria-label': PAGER_PAGE_INDEX_DESCRIPTION,
  };

  @Event() pageIndexChange!: EventCallback<number>;

  @Event() pageSizeChange!: EventCallback<number>;
}
