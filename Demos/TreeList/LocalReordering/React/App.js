import React from 'react';
import TreeList, { Column, RowDragging } from 'devextreme-react/tree-list';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.js';

const expandedRowKeys = [1];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onReorder = this.onReorder.bind(this);
    this.onAllowDropInsideItemChanged = this.onAllowDropInsideItemChanged.bind(this);
    this.onAllowReorderingChanged = this.onAllowReorderingChanged.bind(this);
    this.onShowDragIconsChanged = this.onShowDragIconsChanged.bind(this);

    this.state = {
      employees,
      allowDropInsideItem: true,
      allowReordering: true,
      showDragIcons: true
    };
  }

  render() {
    return (
      <div>
        <TreeList
          id="employees"
          dataSource={this.state.employees}
          rootValue={-1}
          keyExpr="ID"
          showRowLines={true}
          showBorders={true}
          parentIdExpr="Head_ID"
          defaultExpandedRowKeys={expandedRowKeys}
          columnAutoWidth={true}
        >
          <RowDragging
            onDragChange={this.onDragChange}
            onReorder={this.onReorder}
            allowDropInsideItem={this.state.allowDropInsideItem}
            allowReordering={this.state.allowReordering}
            showDragIcons={this.state.showDragIcons}
          />
          <Column dataField="Title" caption="Position" />
          <Column dataField="Full_Name" />
          <Column dataField="City" />
          <Column dataField="State" />
          <Column dataField="Mobile_Phone" />
          <Column dataField="Hire_Date" dataType="date" />
        </TreeList>

        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              value={this.state.allowDropInsideItem}
              text="Allow Drop Inside Item"
              onValueChanged={this.onAllowDropInsideItemChanged}
            />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              value={this.state.allowReordering}
              text="Allow Reordering"
              onValueChanged={this.onAllowReorderingChanged}
            />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              value={this.state.showDragIcons}
              text="Show Drag Icons"
              onValueChanged={this.onShowDragIconsChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  onDragChange(e) {
    let visibleRows = e.component.getVisibleRows(),
      sourceNode = e.component.getNodeByKey(e.itemData.ID),
      targetNode = visibleRows[e.toIndex].node;

    while (targetNode && targetNode.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

  onReorder(e) {
    let visibleRows = e.component.getVisibleRows(),
      sourceData = e.itemData,
      targetData = visibleRows[e.toIndex].node.data,
      employees = this.state.employees,
      sourceIndex = employees.indexOf(sourceData),
      targetIndex = employees.indexOf(targetData);

    if (e.dropInsideItem) {
      sourceData = { ...sourceData, Head_ID: targetData.ID };
      employees = [...employees.slice(0, sourceIndex), sourceData, ...employees.slice(sourceIndex + 1)];
    } else {
      if (sourceData.Head_ID !== targetData.Head_ID) {
        sourceData = { ...sourceData, Head_ID: targetData.Head_ID };
        if (e.toIndex > e.fromIndex) {
          targetIndex++;
        }
      }
      employees = [...employees.slice(0, sourceIndex), ...employees.slice(sourceIndex + 1)];
      employees = [...employees.slice(0, targetIndex), sourceData, ...employees.slice(targetIndex)];
    }

    this.setState({
      employees
    });
  }

  onAllowDropInsideItemChanged(args) {
    this.setState({
      allowDropInsideItem: args.value
    });
  }

  onAllowReorderingChanged(args) {
    this.setState({
      allowReordering: args.value
    });
  }

  onShowDragIconsChanged(args) {
    this.setState({
      showDragIcons: args.value
    });
  }
}

export default App;
