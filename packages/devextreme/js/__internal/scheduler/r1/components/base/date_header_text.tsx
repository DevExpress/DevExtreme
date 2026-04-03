import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

export interface DateHeaderTextProps {
  text?: string;
  splitText: boolean;
}

const DateHeaderTextDefaultProps = {
  text: '',
  splitText: false,
};

export class DateHeaderText extends BaseInfernoComponent<DateHeaderTextProps> {
  private textCache: string[] | null = null;

  getTextParts(): string[] {
    if (this.textCache !== null) {
      return this.textCache;
    }

    const { text } = this.props;
    this.textCache = text ? text.split(' ') : [''];
    return this.textCache;
  }

  componentWillUpdate(nextProps: DateHeaderTextProps): void {
    if (this.props.text !== nextProps.text) {
      this.textCache = null;
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
