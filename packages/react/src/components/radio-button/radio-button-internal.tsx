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

export function RadioButtonInternal({
  name, value, checked, defaultChecked, onClick, onChange, label, radioTemplate,
  labelTemplate, inputId, inputRef, renderRadioComponent,
}: RadioButtonRenderProps): JSX.Element {
  const RadioComponent = radioTemplate || DefaultRadioTemplate;
  const LabelComponent = labelTemplate || DefaultLabelTemplate;

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
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onClick={onClick}
          onChange={onChange}
        />
        {renderRadioComponent ? (
          renderRadioComponent(RadioComponent)
        ) : (
          <RadioComponent checked={checked || false} />
        )}
        {label && <LabelComponent label={label} />}
      </label>
    </span>
  );
}
