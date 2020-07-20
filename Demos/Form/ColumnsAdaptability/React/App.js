import React from 'react';
import CheckBox from 'devextreme-react/check-box';
import Form from 'devextreme-react/form';
import employee from './data.js';

const colCountByScreen = {
  sm: 2,
  md: 3
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      useColCountByScreen: true
    };
    this.onUseColCountByScreenChanged = this.onUseColCountByScreenChanged.bind(this);
  }

  render() {
    const { useColCountByScreen } = this.state;

    return (
      <div>
        <Form
          id="form"
          formData={employee}
          colCountByScreen={useColCountByScreen ? colCountByScreen : null}
          labelLocation="top"
          minColWidth={233}
          colCount="auto"
          screenByWidth={screenByWidth}
        />
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Set the count of columns regardless of screen size"
              value={useColCountByScreen}
              onValueChanged={this.onUseColCountByScreenChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  onUseColCountByScreenChanged(e) {
    this.setState({
      useColCountByScreen: e.value
    });
  }
}

function screenByWidth(width) {
  return width < 720 ? 'sm' : 'md';
}

export default App;
