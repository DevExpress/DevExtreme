import React, { useState } from 'react';
import {
  RadioButton,
  RadioTemplateProps,
  LabelTemplateProps,
} from '@devextreme/react';

const CustomRadio: React.FC<RadioTemplateProps> = ({ checked }) => (
  <span>{checked ? '+' : '-'}</span>
);

const CustomLabel: React.FC<LabelTemplateProps> = ({ label }) => <b>{label}</b>;

export function RadioButtonExample() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  return (
    <div className="example">
      <div className="example__title">Radio button example:</div>
      <div className="example__control">
        <div className="example__play-part">
          <span>Default templates, text label: </span>
          <RadioButton
            value="string label"
            checked={checked1}
            label="string label"
            onClick={() => setChecked1((current) => !current)}
          />
        </div>
        <div className="example__play-part">
          <span>Custom templates, component label: </span>
          <RadioButton
            value="component label"
            checked={checked2}
            label={<i>component label</i>}
            onClick={() => setChecked2((current) => !current)}
            radioTemplate={CustomRadio}
            labelTemplate={CustomLabel}
          />
        </div>
        <div className="example__play-part">
          <span>Uncontrolled mode: </span>
          <RadioButton
            value="uncontrolled 1"
            label="uncontrolled 1"
            name="uncontrolled"
            defaultChecked
          />
          <RadioButton
            value="uncontrolled 2"
            label="uncontrolled 2"
            name="uncontrolled"
          />
        </div>
      </div>
    </div>
  );
}
