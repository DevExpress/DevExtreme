/* eslint-disable no-underscore-dangle */
import Component from './common/component';
import { Deferred } from '../../core/utils/deferred';

// eslint-disable-next-line react/prefer-stateless-function
export class ScrollViewWrapper extends Component {
  update(): void {
    (this._viewRef as any).current.update();

    return new (Deferred as any)().resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  // https://trello.com/c/UCUiKGfd/2724-renovation-renovated-components-ignores-children-when-usetemplates-returns-false
  // _useTemplates(): boolean {
  //   return false;
  // }
}
