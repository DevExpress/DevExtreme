import React from 'react';

import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import List from 'devextreme-react/list';

import { tasks, deleteModeLabel } from './data.js';

const itemDeleteModes = ['static', 'toggle', 'slideButton', 'slideItem', 'swipe', 'context'];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      allowDeletion: false,
      itemDeleteMode: 'toggle',
    };
    this.onAllowDeletionChange = this.onAllowDeletionChange.bind(this);
    this.onItemDeleteModeChange = this.onItemDeleteModeChange.bind(this);
  }

  onAllowDeletionChange(args) {
    this.setState({
      allowDeletion: args.value,
    });
  }

  onItemDeleteModeChange(args) {
    this.setState({
      itemDeleteMode: args.value,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="widget-container">
          <List
            dataSource={tasks}
            height={400}
            allowItemDeleting={this.state.allowDeletion}
            itemDeleteMode={this.state.itemDeleteMode}>
          </List>
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Allow deletion"
              value={this.state.allowDeletion}
              onValueChanged={this.onAllowDeletionChange}>
            </CheckBox>
          </div>
          <div className="option">
            <span>Item delete mode </span>
            <SelectBox
              disabled={!this.state.allowDeletion}
              items={itemDeleteModes}
              inputAttr={deleteModeLabel}
              value={this.state.itemDeleteMode}
              onValueChanged={this.onItemDeleteModeChange}>
            </SelectBox>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
