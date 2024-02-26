import React, { useCallback, useState } from 'react';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import Form from 'devextreme-react/form';
import employee from './data.ts';

const colCountByScreen = {
  sm: 2,
  md: 4,
};

const App = () => {
  const [calculateColCountAutomatically, setCalculateColCountAutomatically] = useState(false);

  const onCalculateColCountAutomaticallyChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setCalculateColCountAutomatically(e.value);
  }, [setCalculateColCountAutomatically]);

  return (
    <div>
      <Form
        id="form"
        formData={employee}
        colCountByScreen={calculateColCountAutomatically ? null : colCountByScreen}
        labelLocation="top"
        minColWidth={233}
        colCount="auto"
        screenByWidth={screenByWidth}
      />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Calculate the number of columns automatically"
            value={calculateColCountAutomatically}
            onValueChanged={onCalculateColCountAutomaticallyChanged}
          />
        </div>
      </div>
    </div>
  );
};

function screenByWidth(width: number) {
  return width < 720 ? 'sm' : 'md';
}

export default App;
