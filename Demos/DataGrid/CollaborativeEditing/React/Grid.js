import React from 'react';
import DataGrid, { Column, Editing, Paging, RequiredRule, RangeRule } from 'devextreme-react/data-grid';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.maxDate = new Date(3000, 0);
    this.statesStore = AspNetData.createStore({
      key: 'ID',
      loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridStatesLookup'
    });
  }

  render() {
    return (
      <DataGrid
        dataSource={this.props.dataSource}
        height={600}
        showBorders={true}
        repaintChangesOnly={true}
        highlightChanges={true}
      >
        <Paging
          enabled={false}
        />

        <Editing
          mode="cell"
          refreshMode="reshape"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
          useIcons={true}
        />

        <Column
          dataField="Prefix"
          caption="Title"
          width={50}
        >
          <RequiredRule />
        </Column>

        <Column
          dataField="FirstName"
        >
          <RequiredRule />
        </Column>

        <Column
          dataField="StateID"
          caption="State"
          lookup={{
            dataSource: this.statesStore,
            displayExpr: 'Name',
            valueExpr: 'ID'
          }}
        >
          <RequiredRule />
        </Column>

        <Column
          dataField="BirthDate"
          dataType="date"
        >
          <RangeRule
            max={this.maxDate}
            message="Date can not be greater than 01/01/3000"
          />
        </Column>

      </DataGrid>
    );
  }
}

export default Grid;
