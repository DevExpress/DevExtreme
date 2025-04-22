import type { FieldInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType } from 'inferno';

export interface ValueTextProps {
  field: FieldInfo;
  template?: ComponentType<{ field: FieldInfo }>;
  cellHintEnabled?: boolean;
}

const ROOT_CLASS = 'dx-cardview-field-value';
const CLASS = {
  root: ROOT_CLASS,
  textPartHighlighted: `${ROOT_CLASS}__text-part--highlighted`,
};

export const ValueText = ({
  field,
  template: Template,
  cellHintEnabled,
}: ValueTextProps): JSX.Element => {
  const classNames = [
    CLASS.root,
    `${CLASS.root}--text-align-${field.column.alignment}`,
  ].join(' ');

  const content = field.highlightedText
    ? field.highlightedText.map(({ type, text: textPart }) => (
      <span className={type === 'highlighted' ? CLASS.textPartHighlighted : ''}>{textPart}</span>
    ))
    : field.text;

  return (
    <div
      className={classNames}
      title={cellHintEnabled ? field.text : undefined}
    >
      {Template ? (
        <Template field={field}/>
      ) : content}
    </div>
  );
};
