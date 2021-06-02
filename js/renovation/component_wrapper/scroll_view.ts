/* eslint-disable no-underscore-dangle */
import Component from './common/component';
import { Deferred } from '../../core/utils/deferred';
import { Option } from './common/types';

// eslint-disable-next-line react/prefer-stateless-function
export class ScrollViewWrapper extends Component {
  update(): void {
    (this._viewRef as any)?.current?.update();

    return new (Deferred as any)().resolve();
  }

  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
