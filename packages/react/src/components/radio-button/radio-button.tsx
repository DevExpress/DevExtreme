import React, { useId, forwardRef } from 'react';
import {
  RadioButtonProps,
  LabelTemplateProps,
  RadioTemplateProps,
} from './types';

const DefaultRadioTemplate = ({ checked }: RadioTemplateProps) => (
  <span>{checked ? '◉' : '◎'}</span>
);

const DefaultLabelTemplate = ({ label }: LabelTemplateProps) => (
  <span>{label}</span>
);

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      value, checked, onClick, onChange, label, radioTemplate, labelTemplate,
    },
    inputRef,
  ) => {
    const RadioComponent = radioTemplate || DefaultRadioTemplate;
    const LabelComponent = labelTemplate || DefaultLabelTemplate;
    const inputId = useId();

    return (
      <span>
        <label
          htmlFor={inputId}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <input
            ref={inputRef}
            id={inputId}
            style={{ display: 'none' }}
            type="radio"
            value={value}
            checked={checked}
            onClick={onClick}
            onChange={onChange}
          />
          <RadioComponent checked={checked} />
          <LabelComponent label={label} />
        </label>
      </span>
    );
  },
);
