/* eslint-disable no-underscore-dangle */
import Component from './common/component';

export class GridPagerWrapper extends Component {
  _optionChanged(args: { name: string; value: unknown }): void {
    switch (args.name) {
      case 'pageIndex': {
        const pageIndexChanged = this.option('pageIndexChanged');
        if (pageIndexChanged) {
          pageIndexChanged(args.value);
        }
        break;
      }
      case 'pageSize': {
        const pageSizeChanged = this.option('pageSizeChanged');
        if (pageSizeChanged) {
          pageSizeChanged(args.value);
        }
        break;
      }
      default: break;
    }
    super._optionChanged(args);
  }
}
