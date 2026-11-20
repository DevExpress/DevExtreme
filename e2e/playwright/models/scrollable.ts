import type { WidgetName } from './types';
import Widget from './internal/widget';

export interface ScrollOffset {
  top: number;
  left: number;
}

export default class Scrollable extends Widget {
  name: WidgetName = 'dxScrollable';

  public scrollOffset(): Promise<ScrollOffset> {
    return this.invoke('scrollOffset');
  }

  public async scrollTo(value: Partial<ScrollOffset>): Promise<void> {
    await this.invoke('scrollTo', value);
  }
}
