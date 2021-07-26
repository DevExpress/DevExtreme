import {
  ComponentBindings,
  OneWay,
  Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';

@ComponentBindings()
export class InternalPagerProps {
  @OneWay() pageIndex = 1;

  @OneWay() pageSize = 5;

  @Event() pageIndexChange!: EventCallback<number>;

  @Event() pageSizeChange!: EventCallback<number>;
}
