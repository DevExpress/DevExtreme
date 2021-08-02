import {
  ComponentBindings,
  TwoWay,
  OneWay,
  Event,
} from '@devextreme-generator/declarations';
import { BasePagerProps } from './base_pager_props';
import { EventCallback } from '../../common/event_callback';

@ComponentBindings()
export class PagerProps extends BasePagerProps {
  @TwoWay() pageIndex = 1;

  @TwoWay() pageSize = 5;

  @Event() pageIndexChange!: EventCallback<number>;

  @Event() pageSizeChange!: EventCallback<number>;
}

@ComponentBindings()
export class ExtendedPagerProps extends PagerProps {
  @OneWay() pageSizes: (number | 'all')[] = [5, 10];
}
