import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { FieldInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType } from 'inferno';
import { Component, createRef } from 'inferno';

export interface CaptionProps {
  field: FieldInfo;
  template?: ComponentType<{ field: FieldInfo }>;

  onClick?: (e: { field: FieldInfo }) => void;
  onDblClick?: (e: { field: FieldInfo }) => void;
  onPrepared?: (e: { field: FieldInfo }) => void;
}

export class Caption extends Component<CaptionProps> {
  private readonly ref = createRef<HTMLDivElement>();

  private readonly onClick = (e): void => {
    const args = {
      event: e,
      fieldCaptionElement: getPublicElement($(this.ref.current)),
      field: this.props.field,
    };

    this.props.onClick?.(args);
  };

  private readonly onDblClick = (e): void => {
    const args = {
      event: e,
      fieldCaptionElement: getPublicElement($(this.ref.current)),
      field: this.props.field,
    };

    this.props.onDblClick?.(args);
  };

  render(): JSX.Element {
    const Template = this.props.template;

    return (
      <div
        ref={this.ref}
        className="dx-cardview-field-caption"
        onClick={this.onClick}
        onDblClick={this.onDblClick}
      >
        {Template ? (
          <Template field={this.props.field} />
        )
          : <>{this.props.field.column.caption}:</>
        }
      </div>
    );
  }

  componentDidMount(): void {
    const args = {
      fieldCaptionElement: getPublicElement($(this.ref.current)),
      field: this.props.field,
    };

    this.props.onPrepared?.(args);
  }
}
