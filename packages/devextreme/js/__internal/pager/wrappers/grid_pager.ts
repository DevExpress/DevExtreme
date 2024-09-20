/* eslint-disable @typescript-eslint/ban-types */
import { ComponentWrapper } from '../../core/r1/component_wrapper';
import type { Option } from '../../core/r1/types';

export class GridPagerWrapper extends ComponentWrapper {
  _optionChanged(args: Option): void {
    switch (args.name) {
      case 'pageIndex': {
        const pageIndexChanged = this.option('pageIndexChanged') as Function;
        if (pageIndexChanged) {
          pageIndexChanged(args.value);
        }
        break;
      }
      case 'pageSize': {
        const pageSizeChanged = this.option('pageSizeChanged') as Function;
        if (pageSizeChanged) {
          pageSizeChanged(args.value);
        }
        break;
      }
      default: break;
    }
    super._optionChanged(args);
  }

  protected getPageCount(): number {
    return this.option('pageCount') as number;
  }
}
