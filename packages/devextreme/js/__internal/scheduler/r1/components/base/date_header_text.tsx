import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

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

  render(): JSX.Element {
    const {
      splitText,
      text,
    } = this.props;
    const textParts = this.getTextParts();

    return (
      <>
        {
          splitText
            ? textParts.map((part) => (
              <div className="dx-scheduler-header-panel-cell-date">
                <span>{part}</span>
              </div>
            ))
            : text
        }
      </>
    );
  }
}

DateHeaderText.defaultProps = DateHeaderTextDefaultProps;
