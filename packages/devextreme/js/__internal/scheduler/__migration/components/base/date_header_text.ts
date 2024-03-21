import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { VNode } from 'inferno';
import { createFragment, createVNode } from 'inferno';

export interface DateHeaderTextProps {
  text?: string;
  splitText: boolean;
}

const DateHeaderTextDefaultProps = {
  text: '',
  splitText: false,
};

export class DateHeaderText extends BaseInfernoComponent<DateHeaderTextProps> {
  private _textCache: string[] | null = null;

  getTextParts(): string[] {
    if (this._textCache !== null) {
      return this._textCache;
    }

    const { text } = this.props;
    this._textCache = text ? text.split(' ') : [''];
    return this._textCache;
  }

  componentWillUpdate(nextProps: DateHeaderTextProps): void {
    if (this.props.text !== nextProps.text) {
      this._textCache = null;
    }
  }

  render(): VNode {
    const {
      splitText,
      text,
    } = this.props;
    const textParts = this.getTextParts();

    return createFragment(splitText
      ? textParts.map(
        (part) => createVNode(
          1,
          'div',
          'dx-scheduler-header-panel-cell-date',
          createVNode(1, 'span', null, part, 0),
          2,
        ),
      )
      : text, 0);
  }
}

DateHeaderText.defaultProps = DateHeaderTextDefaultProps;
