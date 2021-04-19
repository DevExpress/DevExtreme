import React from 'react';
import CheckBox from 'devextreme-react/check-box';
import Form from 'devextreme-react/form';
import employee from './data.js';

const colCountByScreen = {
  sm: 2,
  md: 4
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      calculateColCountAutomatically: false
    };
    this.onCalculateColCountAutomaticallyChanged = this.onCalculateColCountAutomaticallyChanged.bind(this);
  }

  render() {
    const { calculateColCountAutomatically } = this.state;

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
              onValueChanged={this.onCalculateColCountAutomaticallyChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  onCalculateColCountAutomaticallyChanged(e) {
    this.setState({
      calculateColCountAutomatically: e.value
    });
  }
}

function screenByWidth(width) {
  return width < 720 ? 'sm' : 'md';
}

export default App;
