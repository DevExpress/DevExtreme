import React from 'react';

import SelectBox from 'devextreme-react/select-box';
import List from 'devextreme-react/list';

import ArrayStore from 'devextreme/data/array_store';

import { tasks } from './data.js';

const dataSource = new ArrayStore({
  key: 'id',
  data: tasks
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectionMode: 'all',
      selectAllMode: 'page',
      selectedItemKeys: []
    };
    this.onSelectionModeChange = this.onSelectionModeChange.bind(this);
    this.onSelectAllModeChange = this.onSelectAllModeChange.bind(this);
    this.onSelectedItemKeysChange = this.onSelectedItemKeysChange.bind(this);
  }
  onSelectionModeChange(args) {
    this.setState({
      selectionMode: args.value
    });
  }
  onSelectAllModeChange(args) {
    this.setState({
      selectAllMode: args.value
    });
  }
  onSelectedItemKeysChange(args) {
    if(args.name === 'selectedItemKeys') {
      this.setState({
        selectedItemKeys: args.value
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="widget-container">
          <List
            dataSource={dataSource}
            height={400}
            showSelectionControls={true}
            selectionMode={this.state.selectionMode}
            selectAllMode={this.state.selectAllMode}
            selectedItemKeys={this.state.selectedItemKeys}
            onOptionChanged={this.onSelectedItemKeysChange}>
          </List>
          <div className="selected-data">
            <span className="caption">Selected IDs:</span>
            <span>{this.state.selectedItemKeys.join(', ')}</span>
          </div>
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Selection Mode</span>
            &nbsp;
            <SelectBox
              items={['none', 'single', 'multiple', 'all']}
              value={this.state.selectionMode}
              onValueChanged={this.onSelectionModeChange}>
            </SelectBox>
          </div>
          <div className="option">
            <span>Select All Mode</span>
            &nbsp;
            <SelectBox
              disabled={this.state.selectionMode !== 'all'}
              items={['page', 'allPages']}
              value={this.state.selectAllMode}
              onValueChanged={this.onSelectAllModeChange}>
            </SelectBox>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
