import React, { useCallback, useState } from 'react';
import { RadioGroup, RadioButton, RadioGroupValue } from '@devexpress/react';

const OPTIONS = [0, 1, 2, 3, 4];

export function RadioGroupControlledExample() {
  const [value, setValue] = useState<RadioGroupValue | undefined>(undefined);

  const handleChange = useCallback((newValue?: RadioGroupValue) => {
    setValue(newValue);
  }, []);

  return (
    <div className="example">
      <div className="example__title">
        Radio group controlled example:
      </div>
      <div className="example__control">
        <RadioGroup
          value={value}
          valueChange={handleChange}
        >
          { OPTIONS.map((option) => <RadioButton key={option} value={option} />)}
        </RadioGroup>
      </div>
      <div className="example__info">
        State value:
        {'  '}
        {JSON.stringify(value)}
      </div>
    </div>
  );
}
