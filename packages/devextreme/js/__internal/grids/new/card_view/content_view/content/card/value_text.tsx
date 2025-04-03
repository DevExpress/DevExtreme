import type { HighlightedTextItem } from '@ts/grids/new/grid_core/search/types';

export interface ValueTextProps {
  text: string;
  highlightedText: HighlightedTextItem[] | null;
  valueTemplate?: (text: string) => JSX.Element;
  wordWrapEnabled?: boolean;
  alignment: 'right' | 'center' | 'left';
  cellHintEnabled?: boolean;
}

const ROOT_CLASS = 'dx-cardview-field-value';
const CLASS = {
  root: ROOT_CLASS,
  textPartHighlighted: `${ROOT_CLASS}__text-part--highlighted`,
};

export const ValueText = ({
  text,
  highlightedText,
  valueTemplate,
  wordWrapEnabled,
  alignment,
  cellHintEnabled,
}: ValueTextProps): JSX.Element => {
  if (valueTemplate && text) {
    return valueTemplate(text);
  }

  const classNames = [
    CLASS.root,
    `${CLASS.root}--text-align-${alignment}`,
    `${CLASS.root}--white-space-${wordWrapEnabled ? 'normal' : 'nowrap'}`,
  ].join(' ');

  return (
    <span
      className={classNames}
      title={cellHintEnabled ? text : undefined}
    >
      { highlightedText
        ? highlightedText.map(({ type, text: textPart }) => (
          <span className={type === 'highlighted' ? CLASS.textPartHighlighted : ''}>{textPart}</span>
        ))
        : text
       }
    </span>
  );
};
