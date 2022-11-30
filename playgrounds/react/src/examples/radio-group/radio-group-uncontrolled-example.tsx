import React from 'react';
import { RadioGroup, RadioButtonTmp } from '@devexpress/react';

const OPTIONS = [1, 2, 3, 4, 5];

export function RadioGroupUncontrolledExample() {
  return (
    <div className="example">
      <div className="example__title">
        Radio group  uncontrolled example:
      </div>
      <div className="example__control">
        <RadioGroup defaultValue={OPTIONS[2]}>
          { OPTIONS.map((option) => <RadioButtonTmp key={option} value={option} />)}
        </RadioGroup>
      </div>
    </div>
  );
}
