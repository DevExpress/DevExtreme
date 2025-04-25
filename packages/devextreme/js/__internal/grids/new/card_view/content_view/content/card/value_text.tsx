import type { Cell } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType } from 'inferno';

export interface ValueTextProps {
  cell: Cell;
  template?: ComponentType<{ cell: Cell }>;
  cellHintEnabled?: boolean;
}

const ROOT_CLASS = 'dx-cardview-field-value';
const CLASS = {
  root: ROOT_CLASS,
  textPartHighlighted: `${ROOT_CLASS}__text-part--highlighted`,
};

export const ValueText = ({
  cell,
  template: Template,
  cellHintEnabled,
}: ValueTextProps): JSX.Element => {
  const classNames = [
    CLASS.root,
    `${CLASS.root}--text-align-${cell.column.alignment}`,
  ].join(' ');

  const content = cell.highlightedText
    ? cell.highlightedText.map(({ type, text: textPart }) => (
      <span className={type === 'highlighted' ? CLASS.textPartHighlighted : ''}>{textPart}</span>
    ))
    : cell.text;

  return (
    <div
      className={classNames}
      title={cellHintEnabled ? cell.text : undefined}
    >
      {Template ? (
        <Template cell={cell}/>
      ) : content}
    </div>
  );
};
