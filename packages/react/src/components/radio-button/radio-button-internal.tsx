import { ChangeEventHandler } from 'react';
import {
  LabelTemplateProps,
  RadioButtonRenderProps,
  RadioTemplateProps,
} from './types';

export function DefaultRadioTemplate({ checked = false }: RadioTemplateProps) {
  return <span>{checked ? '◉' : '◎'}</span>;
}

export function DefaultLabelTemplate({ label }: LabelTemplateProps) {
  return <span>{label}</span>;
}

export function RadioButtonInternal<T>({
  name, value, checked, defaultChecked, onSelected, onClick, label, radioTemplate,
  labelTemplate, inputId, inputRef, renderRadioComponent,
}: RadioButtonRenderProps<T>): JSX.Element {
  const RadioComponent = radioTemplate || DefaultRadioTemplate;
  const LabelComponent = labelTemplate || DefaultLabelTemplate;
  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    onSelected?.(value);
  };

  return (
    <span>
      <label
        htmlFor={inputId}
        style={{ cursor: 'pointer', userSelect: 'none', margin: '2px' }}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          style={{ display: 'none' }}
          type="radio"
          value={value as string}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          onClick={onClick}
        />
        {renderRadioComponent ? (
          renderRadioComponent(RadioComponent)
        ) : (
          <RadioComponent checked={checked || false} />
        )}
        {label ? <LabelComponent label={label} /> : null}
      </label>
    </span>
  );
}
