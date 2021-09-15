import React from 'react';
import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing,
} from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import { SelectBox } from 'devextreme-react';
import {
  tasks, dependencies, resources, resourceAssignments,
} from './data.js';

const sortingModeValues = ['single', 'multiple', 'none'];
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      sortingMode: 'single',
      showSortIndexes: false,
      sorting: { mode: 'single', showSortIndexes: false },
      showSortIndexesDisabled: true,
    };
    this.onSortingModeChanged = this.onSortingModeChanged.bind(this);
    this.onShowSortIndexesChanged = this.onShowSortIndexesChanged.bind(this);
  }

  render() {
    const {
      sortingMode,
      showSortIndexes,
      sorting,
      showSortIndexesDisabled,

    } = this.state;
    return (
      <div id="form-demo">
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <div className="label">Sorting Mode:</div>
            {' '}
            <div className="value">
              <SelectBox
                items={sortingModeValues}
                value={sortingMode}
                onValueChanged={this.onSortingModeChanged}
              />
            </div>
          </div>
          {' '}
          <div className="option">
            <CheckBox
              text="Show Sort Indexes"
              value={showSortIndexes}
              onValueChanged={this.onShowSortIndexesChanged}
              disabled={showSortIndexesDisabled}
            />
          </div>
        </div>
        <div className="widget-container">
          <Gantt
            taskListWidth={500}
            scaleType="weeks"
            height={700}
            rootValue={-1}
            sorting={sorting}>

            <Tasks dataSource={tasks} />
            <Dependencies dataSource={dependencies} />
            <Resources dataSource={resources} />
            <ResourceAssignments dataSource={resourceAssignments} />

            <Column dataField="title" caption="Subject" width={300} sortOrder="asc" />
            <Column dataField="start" caption="Start Date" />
            <Column dataField="end" caption="End Date" />

            <Editing enabled={true} />
          </Gantt>
        </div>
      </div>
    );
  }

  onSortingModeChanged(e) {
    this.setState({
      sortingMode: e.value,
      sorting: { mode: e.value, showSortIndexes: this.state.showSortIndexes },
      showSortIndexesDisabled: e.value !== 'multiple',
    });
  }

  onShowSortIndexesChanged(e) {
    this.setState({
      showSortIndexes: e.value,
      sorting: { mode: this.state.sortingMode, showSortIndexes: e.value },
    });
  }
}

export default App;
