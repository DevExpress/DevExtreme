/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { Cell } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType, RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { Caption } from './caption';
import { ValueText } from './value_text';

export const CLASSES = {
  fieldTemplate: 'dx-cardview-field-template',
  overflowHint: 'dx-cardview-overflow-hint',
};

export interface FieldProps {
  cellHintEnabled?: boolean;
  elementRef?: RefObject<HTMLDivElement>;
  captionTemplate?: ComponentType<{ cell: Cell }>;
  valueTemplate?: ComponentType<{ cell: Cell }>;

  cell: Cell;

  onClick?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onHoverChanged?: (hovered: boolean) => void;
  onPrepared?: (element: HTMLElement) => void;

  template?: ComponentType<{ cell: Cell }>;
}

export class Field extends Component<FieldProps> {
  private readonly containerRef: RefObject<HTMLDivElement>;

  constructor(props: FieldProps) {
    super(props);
    this.containerRef = this.props.elementRef ?? createRef<HTMLDivElement>();
  }

  componentDidMount(): void {
    this.props.onPrepared?.(this.containerRef.current!);
  }

  render(): JSX.Element {
    const Template = this.props.template;

    if (Template) {
      return (
        <div className={CLASSES.fieldTemplate}>
          <Template cell={this.props.cell}/>
        </div>
      );
    }

    return (
      <>
        <Caption
          cell={this.props.cell}
          template={this.props.captionTemplate}
        />
        <ValueText
          cell={this.props.cell}
          template={this.props.valueTemplate}
        />
      </>
    );
  }
}
