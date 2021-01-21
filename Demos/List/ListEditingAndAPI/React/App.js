import React from 'react';

import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import List from 'devextreme-react/list';

import { tasks } from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      allowDeleting: false,
      deleteType: 'toggle',
      selectedItems: []
    };
    this.onAllowDeletingChange = this.onAllowDeletingChange.bind(this);
    this.onDeleteTypeChange = this.onDeleteTypeChange.bind(this);
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
  }
  onAllowDeletingChange(args) {
    this.setState({
      allowDeleting: args.value
    });
  }
  onDeleteTypeChange(args) {
    this.setState({
      deleteType: args.value
    });
  }
  onSelectedItemsChange(args) {
    if(args.name === 'selectedItems') {
      this.setState({
        selectedItems: args.value
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="widget-container">
          <List
            dataSource={tasks}
            height={400}
            allowItemDeleting={this.state.allowDeleting}
            itemDeleteMode={this.state.deleteType}
            showSelectionControls={true}
            selectionMode="multiple"
            selectedItems={this.state.selectedItems}
            onOptionChanged={this.onSelectedItemsChange}>
          </List>
          <div className="selected-data">
            <span className="caption">Selected Tasks:</span>
            <span>{this.state.selectedItems.join(', ')}</span>
          </div>
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Allow deleting"
              value={this.state.allowDeleting}
              onValueChanged={this.onAllowDeletingChange}>
            </CheckBox>
          </div>
          <div className="option">
            <span>Deleting type </span>
            <SelectBox
              disabled={!this.state.allowDeleting}
              items={['static', 'toggle', 'slideButton', 'slideItem', 'swipe', 'context']}
              value={this.state.deleteType}
              onValueChanged={this.onDeleteTypeChange}>
            </SelectBox>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
