import * as React from 'react';
import { Template } from 'devextreme-react/core/template';
import {
  DataGrid,
  Column,
  FilterRow,
  Grouping,
  GroupPanel,
  MasterDetail,
  Pager,
  Paging,
  Selection,
} from 'devextreme-react/data-grid';
import { NumberBox } from 'devextreme-react/number-box';
import Example from './example-block';
import { sales } from './data';

const DetailComponent = ({ data: { data } }: any) => (
  <p>
    Row data:
    <br />
    {JSON.stringify(data)}
  </p>
);

const CityComponent = (props: any) => {
  const { data } = props;
  return <i>{data.displayValue}</i>;
};

const RegionComponent = (props: any) => {
  const { data } = props;
  return <b>{data.displayValue}</b>;
};

export default class extends React.Component<any, { expandAll: boolean, pageSize: number }> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      expandAll: true,
      pageSize: 5,
    };

    this.handleToolbarPreparing = this.handleToolbarPreparing.bind(this);
    this.handlePageIndexChange = this.handlePageIndexChange.bind(this);
  }

  private handleToolbarPreparing(args: any) {
    args.toolbarOptions.items.unshift({
      location: 'after',
      template: 'toolbarLabel',
    },
    {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'chevronup',
        onClick: (e: any) => {
          this.setState((state) => {
            e.component.option('icon', state.expandAll ? 'chevrondown' : 'chevronup');
            return {
              expandAll: !state.expandAll,
            };
          });
        },
      },
    });
  }

  private handlePageIndexChange(e: any) {
    this.setState({
      pageSize: e.value,
    });
  }

  public render(): React.ReactNode {
    const { expandAll, pageSize } = this.state;
    return (
      <Example title="DxDataGrid" state={this.state}>
        <br />
        <br />
        <br />
        Page size:
        <br />
        <NumberBox
          showSpinButtons
          step={5}
          value={pageSize}
          onValueChanged={this.handlePageIndexChange}
        />
        <br />
        <DataGrid
          dataSource={sales}
          allowColumnReordering
          onToolbarPreparing={this.handleToolbarPreparing}
        >
          <GroupPanel visible />
          <Grouping autoExpandAll={expandAll} />
          <FilterRow visible />
          <Selection mode="multiple" />

          <Column dataField="orderId" caption="Order ID" width={90} />
          <Column dataField="city" cellComponent={CityComponent} />
          <Column dataField="country" groupIndex={0} width={180} />
          <Column dataField="region" cellComponent={RegionComponent} />
          <Column dataField="date" dataType="date" />
          <Column dataField="amount" dataType="currency" width={90} />

          <Pager
            allowedPageSizes={[5, 10, 15, 20]}
            showPageSizeSelector
            showInfo
          />
          <Paging
            defaultPageIndex={2}
            pageSize={pageSize}
          />
          <MasterDetail enabled component={DetailComponent} />

          <Template name="toolbarLabel">
            {expandAll ? <b>Collapse Groups:</b> : <b>Expand Groups:</b>}
          </Template>
        </DataGrid>
      </Example>
    );
  }
}
