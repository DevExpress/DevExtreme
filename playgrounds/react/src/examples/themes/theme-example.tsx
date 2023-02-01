import { RadioButton, RadioGroup } from '@devextreme/react';
import '@devextreme/styles/lib/themes/material-purple-light-scoped.css';

const OPTIONS = [0, 1, 2, 3, 4];
export function ThemeExample() {
  return (
    <div className="example">
      <div className="example__title">
        Component styled by global theme:
      </div>
      <div className="example__control">
        <RadioGroup>
          {OPTIONS.map((option) => (
            <RadioButton
              key={option}
              value={option}
              label={option.toString()}
            />
          ))}
        </RadioGroup>
      </div>
      <div className="example__title">
        Component styled by scoped purple theme:
      </div>
      <div className="dx-material-purple-light">
        <RadioGroup>
          {OPTIONS.map((option) => <RadioButton key={option} value={option} />)}
        </RadioGroup>
      </div>
    </div>
  );
}
