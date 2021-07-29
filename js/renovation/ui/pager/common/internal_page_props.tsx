import {
  ComponentBindings,
  OneWay,
  Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';
import { BasePagerProps } from './pager_props';

@ComponentBindings()
export class InternalPagerProps extends BasePagerProps {
  @OneWay() pageIndex = 1;

  @OneWay() pageSize = 5;

  @Event() pageIndexChange!: EventCallback<number>;

  @Event() pageSizeChange!: EventCallback<number>;
}
