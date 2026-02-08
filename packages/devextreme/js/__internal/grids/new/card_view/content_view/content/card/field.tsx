/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { FieldInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType, RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import type { CaptionProps } from './caption';
import { Caption } from './caption';
import type { ValueTextProps } from './value_text';
import { ValueText } from './value_text';

export const CLASSES = {
  fieldTemplate: 'dx-cardview-field-template',
  overflowHint: 'dx-cardview-overflow-hint',
};

export interface FieldProps {
  fieldHintEnabled?: boolean;
  elementRef?: RefObject<HTMLDivElement>;
  captionTemplate?: ComponentType<{ field: FieldInfo }>;
  valueTemplate?: ComponentType<{ field: FieldInfo }>;

  field: FieldInfo;

  onClick?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onHoverChanged?: (hovered: boolean) => void;
  onPrepared?: (element: HTMLElement) => void;

  template?: ComponentType<{ field: FieldInfo }>;

  // TODO: move other props here too
  captionProps?: Partial<CaptionProps>;
  valueProps?: Partial<ValueTextProps>;
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
          <Template field={this.props.field}/>
        </div>
      );
    }

    return (
      <>
        <Caption
          field={this.props.field}
          template={this.props.captionTemplate}
          {...this.props.captionProps}
        />
        <ValueText
          fieldHintEnabled={this.props.fieldHintEnabled}
          field={this.props.field}
          template={this.props.valueTemplate}
          {...this.props.valueProps}
        />
      </>
    );
  }
}
