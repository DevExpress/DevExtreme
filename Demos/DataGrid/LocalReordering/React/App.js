import React from 'react';
import DataGrid, { Column, RowDragging, Scrolling, Lookup, Sorting } from 'devextreme-react/data-grid';
import { CheckBox } from 'devextreme-react/check-box';
import { tasks, employees } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onReorder = this.onReorder.bind(this);
    this.onShowDragIconsChanged = this.onShowDragIconsChanged.bind(this);

    this.state = {
      tasks: tasks,
      showDragIcons: true
    };
  }

  onReorder(e) {
    const visibleRows = e.component.getVisibleRows();
    const newTasks = [...this.state.tasks];
    const toIndex = newTasks.indexOf(visibleRows[e.toIndex].data);
    const fromIndex = newTasks.indexOf(e.itemData);

    newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, e.itemData);

    this.setState({
      tasks: newTasks
    });
  }

  onShowDragIconsChanged(args) {
    this.setState({
      showDragIcons: args.value
    });
  }

  render() {
    return (
      <React.Fragment>
        <DataGrid
          height={440}
          dataSource={this.state.tasks}
          keyExpr="ID"
          showBorders={true}
        >
          <RowDragging
            allowReordering={true}
            onReorder={this.onReorder}
            showDragIcons={this.state.showDragIcons}
          />
          <Scrolling mode="virtual" />
          <Sorting mode="none" />
          <Column dataField="ID" width={55} />
          <Column dataField="Owner" width={150}>
            <Lookup
              dataSource={employees}
              valueExpr="ID"
              displayExpr="FullName"
            />
          </Column>
          <Column
            dataField="AssignedEmployee"
            caption="Assignee"
            width={150}>
            <Lookup
              dataSource={employees}
              valueExpr="ID"
              displayExpr="FullName"
            />
          </Column>
          <Column dataField="Subject" />
        </DataGrid>

        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              value={this.state.showDragIcons}
              text="Show Drag Icons"
              onValueChanged={this.onShowDragIconsChanged}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
