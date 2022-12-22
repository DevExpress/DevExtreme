import { RadioButton, RadioGroup } from '@devextreme/react';
import { useCallback, useState } from 'react';

const OPTIONS = [0, 1, 2, 3, 4];

export function RadioGroupControlledExample() {
  const [value, setValue] = useState<number | undefined>(undefined);

  const handleChange = useCallback((newValue?: number) => {
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
