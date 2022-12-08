import { RadioGroupCompatible, RadioGroupValue } from '@devextreme/react';
import { useState } from 'react';

const nonStringOptions = [
    { text: 'first' },
    { text: 'second' },
    { text: 'third' },
];

const nonStringOptions2 = [
    { value: 1, label: 'one' },
    { value: 2, label: 'two' },
    { value: 3, label: 'three' },
];

const nonStringOptions3 = [
    { text: 'indigo' },
    { text: 'tomato' },
    { text: 'olive' },
];

export function RadioGroupCompatibleExample() {
    const [selectedValue, setSelectedValue] = useState<
        RadioGroupValue | undefined
    >(1);
    const handleChange = (value?: RadioGroupValue) => setSelectedValue(value);

    return (
        <>
            <div className="example">
                <div className="example__title">
                    Compat radio group example with string items:
                </div>
                <div className="example__control">
                    <RadioGroupCompatible
                        defaultValue={'option 2'}
                        items={['option 1', 'option 2', 'option 3']}
                    />
                </div>
            </div>
            <div className="example">
                <div className="example__title">
                    Compat radio group controlled example with number items:
                </div>
                <div className="example__control">
                    <RadioGroupCompatible
                        value={selectedValue}
                        items={[1, 2, 3, 4, 5]}
                        valueChange={handleChange}
                    />
                </div>
            </div>

            <div className="example">
                <div className="example__title">
                    Compat radio group with item.text as value and label:
                </div>
                <div className="example__control">
                    <RadioGroupCompatible
                        defaultValue={nonStringOptions[1].text}
                        items={nonStringOptions}
                    />
                </div>
            </div>
            <div className="example">
                <div className="example__title">
                    Compat radio group with valueExpr and displayExpr:
                </div>
                <div className="example__control">
                    <RadioGroupCompatible
                        defaultValue={1}
                        items={nonStringOptions2}
                        valueExpr="value"
                        displayExpr="label"
                    />
                </div>
            </div>
            <div className="example">
                <div className="example__title">
                    Compat radio group example with itemRender:
                </div>
                <div className="example__control">
                    <RadioGroupCompatible
                        defaultValue={nonStringOptions3[2].text}
                        items={nonStringOptions3}
                        itemRender={(item, index) => (
                            <strong style={{ color: item.text }}>
                                Color {index}
                            </strong>
                        )}
                    />
                </div>
            </div>
        </>
    );
}
