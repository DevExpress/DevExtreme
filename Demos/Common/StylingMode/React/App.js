import React from 'react';

import SelectBox from 'devextreme-react/select-box';
import TagBox from 'devextreme-react/tag-box';
import TextBox from 'devextreme-react/text-box';
import DateBox from 'devextreme-react/date-box';
import TextArea from 'devextreme-react/text-area';
import Button from 'devextreme-react/button';
import Validator from 'devextreme-react/validator';
import notify from 'devextreme/ui/notify';
import validationEngine from 'devextreme/ui/validation_engine';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(2020, 4, 3),
      stylingMode: 'filled'
    };

    this.validateClick = this.validateClick.bind(this);
    this.stylingModeChange = this.stylingModeChange.bind(this);
  }

  render() {
    setTimeout(() => validationEngine.validateGroup());
    return (
      <React.Fragment>
        <div className="title">Edit Task</div>
        <div className="editors">
          <div className="left">
            <TextBox
              stylingMode={this.state.stylingMode}
              defaultValue="Samantha Bright"
              width="100%"
              placeholder="Owner"
            />
            <TextBox
              stylingMode={this.state.stylingMode}
              defaultValue=""
              width="100%"
              placeholder="Subject"
            >
              <Validator
                validationRules={[{ type: 'required' }]} />
            </TextBox>
          </div>
          &nbsp;
          <div className="right">
            <DateBox
              defaultValue={this.state.date}
              stylingMode={this.state.stylingMode}
              width="100%"
              placeholder="Start Date"
            />
            <SelectBox
              items={[ 'High', 'Urgent', 'Normal', 'Low' ]}
              stylingMode={this.state.stylingMode}
              defaultValue="High"
              width="100%"
              placeholder="Priority"
            />
          </div>
          <div className="center">
            <TagBox
              items={[ 'Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed' ]}
              defaultValue={[ 'Not Started' ]}
              multiline={false}
              stylingMode={this.state.stylingMode}
              width="100%"
              placeholder="Status"
            />
            <TextArea
              stylingMode={this.state.stylingMode}
              defaultValue={'Need sign-off on the new NDA agreement. It\'s important that this is done quickly to prevent any unauthorized leaks.'}
              width="100%"
              placeholder="Details"
            />
          </div>
          <div className="center">
            <Button
              onClick={this.validateClick}
              text="Save"
              type="default"
              className="validate"
            />
          </div>
        </div>
        <div className="options">
          <div className="caption">Styling Mode</div>
          <div className="option">
            <SelectBox
              items={[ 'outlined', 'filled', 'underlined' ]}
              value={this.state.stylingMode}
              onValueChanged={this.stylingModeChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  validateClick(e) {
    var result = e.validationGroup.validate();
    if (result.isValid) {
      notify('The task was saved successfully.', 'success');
    } else {
      notify('The task was not saved. Please check if all fields are valid.', 'error');
    }
  }

  stylingModeChange(e) {
    this.setState({
      stylingMode: e.value
    });
  }
}

export default App;
