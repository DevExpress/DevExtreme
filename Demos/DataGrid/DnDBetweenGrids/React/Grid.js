import React from 'react';
import DataGrid, { Column, RowDragging, Scrolling, Lookup } from 'devextreme-react/data-grid';

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.priorities = [{
      id: 1, text: 'Low'
    }, {
      id: 2, text: 'Normal'
    }, {
      id: 3, text: 'High'
    }, {
      id: 4, text: 'Urgent'
    }];
    this.filterExpr = ['Status', '=', this.props.status];

    this.onAdd = this.onAdd.bind(this);

    this.dataSource = {
      store: this.props.tasksStore,
      reshapeOnPush: true
    };
  }

  onAdd(e) {
    var key = e.itemData.ID,
      values = { Status: e.toData };

    this.props.tasksStore.update(key, values).then(() => {
      this.props.tasksStore.push([{
        type: 'update', key: key, data: values
      }]);
    });
  }

  render() {
    return (
      <DataGrid
        dataSource={this.dataSource}
        height={440}
        showBorders={true}
        filterValue={this.filterExpr}
      >
        <RowDragging
          data={this.props.status}
          group="tasksGroup"
          onAdd={this.onAdd}
        />
        <Scrolling mode="virtual" />
        <Column
          dataField="Subject"
          dataType="string"
        />
        <Column
          dataField="Priority"
          dataType="number"
          width={80}
        >
          <Lookup
            dataSource={this.priorities}
            valueExpr="id"
            displayExpr="text"
          />
        </Column>
        <Column
          dataField="Status"
          dataType="number"
          visible={false}
        />

      </DataGrid>
    );
  }
}

export default Grid;
