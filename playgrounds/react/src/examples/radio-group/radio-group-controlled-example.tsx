import React, { useCallback, useState } from 'react';
import { RadioGroup, RadioButtonTmp } from '@devexpress/react';

type OptionType = { prop: number };
const OPTIONS = [
  { prop: 0 },
  { prop: 1 },
  { prop: 2 },
  { prop: 3 },
  { prop: 4 },
];

export function RadioGroupControlledExample() {
  const [value, setValue] = useState<OptionType | undefined>(undefined);

  const handleChange = useCallback((newValue?: OptionType) => {
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
          { OPTIONS.map((option) => <RadioButtonTmp key={option.prop} value={option} />)}
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
