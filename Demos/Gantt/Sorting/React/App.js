import React from 'react';
import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Sorting,
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
      showSortIndexesDisabled: true,
    };
    this.onSortingModeChanged = this.onSortingModeChanged.bind(this);
    this.onShowSortIndexesChanged = this.onShowSortIndexesChanged.bind(this);
  }

  render() {
    const {
      sortingMode,
      showSortIndexes,
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
            rootValue={-1}>

            <Tasks dataSource={tasks} />
            <Dependencies dataSource={dependencies} />
            <Resources dataSource={resources} />
            <ResourceAssignments dataSource={resourceAssignments} />

            <Column dataField="title" caption="Subject" width={300} sortOrder="asc" />
            <Column dataField="start" caption="Start Date" />
            <Column dataField="end" caption="End Date" />

            <Editing enabled={true} />
            <Sorting mode={sortingMode} showSortIndexes={showSortIndexes}></Sorting>
          </Gantt>
        </div>
      </div>
    );
  }

  onSortingModeChanged(e) {
    this.setState({
      sortingMode: e.value,
      showSortIndexesDisabled: e.value !== 'multiple',
    });
  }

  onShowSortIndexesChanged(e) {
    this.setState({
      showSortIndexes: e.value,
    });
  }
}

export default App;
