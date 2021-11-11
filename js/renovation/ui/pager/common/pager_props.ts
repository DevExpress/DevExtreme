import {
  ComponentBindings,
  OneWay,
  TwoWay,
} from '@devextreme-generator/declarations';
import { BasePagerProps } from './base_pager_props';

import { EventCallback } from '../../common/event_callback';

@ComponentBindings()
export class PagerProps extends BasePagerProps {
  @TwoWay() pageSize = 5;

  @TwoWay() pageIndex = 1;
}

@ComponentBindings()
export class InternalPagerProps extends BasePagerProps {
  @OneWay() pageSize = 5;

  @OneWay() pageIndex = 1;

  @OneWay() pageIndexChange!: EventCallback<number>;

  @OneWay() pageSizeChange!: EventCallback<number>;
}
