import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { FieldInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType } from 'inferno';
import { Component, createRef } from 'inferno';

export interface ValueTextProps {
  field: FieldInfo;
  template?: ComponentType<{ field: FieldInfo }>;
  fieldHintEnabled?: boolean;

  onClick?: (e: { field: FieldInfo }) => void;
  onDblClick?: (e: { field: FieldInfo }) => void;
  onPrepared?: (e: { field: FieldInfo }) => void;
}

const ROOT_CLASS = 'dx-cardview-field-value';
const CLASS = {
  root: ROOT_CLASS,
  textPartHighlighted: `${ROOT_CLASS}__text-part--highlighted`,
};

export class ValueText extends Component<ValueTextProps> {
  private readonly ref = createRef<HTMLDivElement>();

  private readonly onClick = (e): void => {
    const args = {
      event: e,
      fieldValueElement: getPublicElement($(this.ref.current)),
      field: this.props.field,
    };

    this.props.onClick?.(args);
  };

  private readonly onDblClick = (e): void => {
    const args = {
      event: e,
      fieldValueElement: getPublicElement($(this.ref.current)),
      field: this.props.field,
    };

    this.props.onDblClick?.(args);
  };

  public render(): JSX.Element {
    const classNames = [
      CLASS.root,
      `${CLASS.root}--text-align-${this.props.field.column.alignment}`,
    ].join(' ');

    const content = this.props.field.highlightedText
      ? this.props.field.highlightedText.map(({ type, text: textPart }) => (
      <span className={type === 'highlighted' ? CLASS.textPartHighlighted : ''}>{textPart}</span>
      ))
      : this.props.field.text;

    const Template = this.props.template;

    return (
      <div
        ref={this.ref}
        onClick={this.onClick}
        onDblClick={this.onDblClick}
        className={classNames}
        title={this.props.fieldHintEnabled ? this.props.field.text : undefined}
      >
        {Template ? (
          <Template field={this.props.field}/>
        ) : content}
      </div>
    );
  }

  componentDidMount(): void {
    const args = {
      fieldValueElement: getPublicElement($(this.ref.current)),
      field: this.props.field,
    };

    this.props.onPrepared?.(args);
  }
}
