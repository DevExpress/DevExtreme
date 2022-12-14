import React, { useState } from 'react';
import { RadioGroup, RadioButton } from '@devextreme/react';

const OPTIONS = [1, 2, 3, 4, 5];

export function RadioGroupUncontrolledExample() {
    const [value, setValue] = useState(OPTIONS[2]);
    return (
        <div className="example">
            <div className="example__title">
                Radio group uncontrolled example:
            </div>
            <div className="example__control">
                <RadioGroup defaultValue={OPTIONS[2]} valueChange={(value) => setValue(value!)}>
                    {OPTIONS.map((option) => (
                        <RadioButton key={option} value={option} />
                    ))}
                </RadioGroup>
            </div>
            <span>{`Selected value: ${value}`}</span>
        </div>
    );
}
