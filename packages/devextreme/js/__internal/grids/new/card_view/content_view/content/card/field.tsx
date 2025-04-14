/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { HighlightedTextItem } from '@ts/grids/new/grid_core/search/types';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { Caption } from './caption';
import { ValueText } from './value_text';

export const CLASSES = {
  field: 'dx-cardview-field',
  fieldValue: 'dx-cardview-field-value',
  overflowHint: 'dx-cardview-overflow-hint',
};

export interface FieldProps {
  title: string | undefined;
  text: string;
  highlightedText: HighlightedTextItem[] | null;
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

  render(): JSX.Element {
    return (
      <div
        ref={this.containerRef}
        tabIndex={0}
        className={CLASSES.field}
        onMouseEnter={(): void => this.props.onHoverChanged?.(true)}
        onMouseLeave={(): void => this.props.onHoverChanged?.(false)}
        onClick={this.props.onClick}
        onDblClick={this.props.onDblClick}
      >
        <Caption title={this.props.title} template={this.props.captionTemplate} />
        <ValueText
          text={this.props.text}
          highlightedText={this.props.highlightedText}
          valueTemplate={this.props.valueTemplate}
          alignment={this.props.alignment}
          wordWrapEnabled={this.props.wordWrapEnabled}
          cellHintEnabled={this.props.cellHintEnabled}
        />
      </div>
    );
  }
}
