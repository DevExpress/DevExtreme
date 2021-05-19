/* eslint-disable no-underscore-dangle */
import Component from './common/component';
import { Deferred } from '../../core/utils/deferred';
import { Option } from './common/types.ts';

// eslint-disable-next-line react/prefer-stateless-function
export class ScrollableWrapper extends Component {
  update(): void {
    (this._viewRef as any).current.update();

    return new (Deferred as any)().resolve();
  }

  _visibilityChanged(): void {
    super.repaint();
  }

  _container(): any {
    return $(this.$element).find('.dx-scrollable-container');
  }

  $content(): any {
    return $(this.$element).find('.dx-scrollable-content');
  }

  // eslint-disable-next-line class-methods-use-this
  // https://trello.com/c/UCUiKGfd/2724-renovation-renovated-components-ignores-children-when-usetemplates-returns-false
  // _useTemplates(): boolean {
  //   return false;
  // }

  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
