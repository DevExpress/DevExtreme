import { RadioGroupValue } from '@devextreme/components';
import { AnyRecord } from '@devextreme/core';
import { RadioGroupCompatible } from '@devextreme/react';
import { useState } from 'react';

const objectItems = [
  { text: 'first' },
  { text: 'second' },
  { text: 'third' },
];

const objectItems2 = [
  { value: 1, label: 'one' },
  { value: 2, label: 'two' },
  { value: 3, label: 'three' },
];

const objectItems3 = [
  { text: 'indigo' },
  { text: 'tomato' },
  { text: 'olive' },
];

function CustomItemComponent({ data }: { data: AnyRecord }) {
  return (
    <strong style={{ color: data.text }}>
      {data.text}
    </strong>
  );
}

export function RadioGroupCompatibleExample() {
  const [selectedValue, setSelectedValue] = useState<RadioGroupValue | undefined>(1);
  const handleChange = (value?: RadioGroupValue) => setSelectedValue(value);

  return (
    <>
      <div className="example">
        <div className="example__title">
          Compat radio group example with string items:
        </div>
        <div className="example__control">
          <RadioGroupCompatible
            defaultValue="option 2"
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
            defaultValue={objectItems[1].text}
            items={objectItems}
            displayExpr="text"
            valueExpr="text"
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
            items={objectItems2}
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
            defaultValue={objectItems3[2]}
            items={objectItems3}
            itemRender={(item, index) => (
              <strong style={{ color: item.text }}>
                Color
                {' '}
                {index}
              </strong>
            )}
          />
        </div>
      </div>
      <div className="example">
        <div className="example__title">
          Compat radio group example with itemComponent:
        </div>
        <div className="example__control">
          <RadioGroupCompatible
            defaultValue={objectItems3[1]}
            items={objectItems3}
            itemComponent={CustomItemComponent}
          />
        </div>
      </div>
    </>
  );
}
