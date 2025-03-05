/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

export const CLASSES = {
  field: 'dx-cardview-field',
  fieldName: 'dx-cardview-field-name',
  fieldValue: 'dx-cardview-field-value',
  overflowHint: 'dx-cardview-overflow-hint',
};

export interface FieldProps {
  title: string | undefined;
  value: unknown;
  alignment: 'right' | 'center' | 'left';
  wordWrapEnabled?: boolean;
  cellHintEnabled?: boolean;
  elementRef?: RefObject<HTMLDivElement>;
  captionTemplate?: (title: string) => JSX.Element;
  valueTemplate?: (value: unknown) => JSX.Element;

  onClick?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onHoverChanged?: (hovered: boolean) => void;
  onPrepared?: (element: HTMLElement) => void;
}

export class Field extends Component<FieldProps> {
  private readonly containerRef: RefObject<HTMLDivElement>;

  constructor(props: FieldProps) {
    super(props);
    this.containerRef = this.props.elementRef || createRef<HTMLDivElement>();
  }

  componentDidMount(): void {
    this.props.onPrepared?.(this.containerRef.current!);
  }

  renderCaption(): JSX.Element {
    const { title, captionTemplate } = this.props;
    if (captionTemplate && title) {
      return captionTemplate(title);
    }
    return <span className={CLASSES.fieldName}>{title}:</span>;
  }

  renderValue(): JSX.Element {
    const {
      value, valueTemplate, wordWrapEnabled, alignment, cellHintEnabled,
    } = this.props;

    if (valueTemplate && value) {
      return valueTemplate(value);
    }

    const valueStyle = {
      textAlign: alignment,
      whiteSpace: wordWrapEnabled ? 'normal' : 'nowrap',
    };

    return (
      <span
        className={CLASSES.fieldValue}
        style={valueStyle}
        title={cellHintEnabled && typeof value === 'string' ? value : undefined}
      >
        {value}
      </span>
    );
  }

  render(): JSX.Element {
    return (
      <div
        onMouseEnter={(): void => this.props.onHoverChanged?.(true)}
        onMouseLeave={(): void => this.props.onHoverChanged?.(false)}
        onClick={this.props.onClick}
        onDblClick={this.props.onDblClick}
        ref={this.containerRef}
        tabIndex={0}
        className={CLASSES.field}
      >
        {this.renderCaption()}
        {this.renderValue()}
      </div>
    );
  }
}
