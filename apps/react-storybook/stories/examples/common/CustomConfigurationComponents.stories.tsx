import type { Meta, StoryObj } from '@storybook/react';
import React from "react";

import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel
} from "devextreme-react/data-grid";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import ODataStore from "devextreme/data/odata/store";

import customConfigurationComponent from 'devextreme-react/core/custom-configuration-component';

const meta: Meta<typeof DataGrid> = {
  title: 'Example/Common/Custom Configuration Components',
  component: DataGrid,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof DataGrid>;

const pageSizes = [10, 25, 50, 100];

const dataSourceOptions = {
  store: new ODataStore({
    version: 2,
    url: 'https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes',
    key: 'Id',
    beforeSend(request) {
      const year = new Date().getFullYear() - 1;
      request.params.startDate = `${year}-05-10`;
      request.params.endDate = `${year}-5-15`;
    },
  }),
};

const CustomerDataColumns = () => (
  <>
    <Column dataField="Region" dataType="string" />
    <Column dataField="Customer" dataType="string" width={150} />
  </>
);

const GridCommonSettings = () => (
  <>
    <GroupPanel visible={true} />
    <SearchPanel visible={true} highlightCaseSensitive={true} />
    <Grouping autoExpandAll={false} />
    <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
    <Paging defaultPageSize={10} />
  </>
);

const GridCommonColumns = () => (
  <>
    <Column dataField="SaleDate" dataType="date" />
    <Column dataField="Product" />
  </>
);

const CommonSettings = customConfigurationComponent(GridCommonSettings);
const CustomerData = customConfigurationComponent(CustomerDataColumns);
const CommonColumns = customConfigurationComponent(GridCommonColumns);

const BriefGrid = () => (
  <DataGrid
    dataSource={dataSourceOptions}
    style={{ padding: '10px' }}
  >
    <CommonSettings />
    <CommonColumns />
    <CustomerData />
  </DataGrid>
);

const DetailGrid = () => (
  <DataGrid
    dataSource={dataSourceOptions}
    style={{ padding: '10px' }}
  >
    <CommonSettings />
    <CommonColumns />
    <Column
      dataField="Amount"
      caption="Sale Amount"
      dataType="number"
      format="currency"
      alignment="right"
    />
    <Column
      dataField="Discount"
      caption="Discount %"
      dataType="number"
      format="percent"
      alignment="right"
      allowGrouping={false}
      cssClass="bullet"
    />
    <Column caption='Customer Data'>
      <CustomerDataColumns />
      <Column dataField="Sector" dataType="string" />
      <Column dataField="Channel" dataType="string" />
    </Column>
  </DataGrid>
);

export const Overview: Story = {
  render: () => {
    return (
      <TabPanel>
        <Item title="Brief">
          <BriefGrid />
        </Item>
        <Item title="Detailed">
          <DetailGrid />
        </Item>
      </TabPanel>
    );
  }
}
