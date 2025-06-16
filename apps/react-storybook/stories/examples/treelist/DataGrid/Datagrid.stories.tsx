import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import DataGrid, { Column, MasterDetail } from "devextreme-react/data-grid";
import TreeList from "devextreme-react/tree-list";

const meta: Meta = {
  title: 'Example/T1291914/DataGrid',
  component: DataGrid,
};

export default meta;

type Story = StoryObj;

const dataSource = [
  { ID: 1, Prefix: 'Mr.' },
];

const detailData = [
  { ID: 1, Title: 'CEO', Hire_Date: '1995-01-15' },
];

export const MasterDetailTreeList: Story = {
    args: {
        keyExpr: 'ID',
        showBorders: true,
        selection: {
            mode: 'multiple',
        },
    },
    render: ({ keyExpr, showBorders, selection }) => (
            <DataGrid
                dataSource={dataSource}
                keyExpr={keyExpr}
                showBorders={showBorders}
                selection={selection}
            >
                <Column dataField="Prefix" width={400} caption={'Title'} />
                <MasterDetail
                    enabled={true}
                    autoExpandAll={true}
                    render={() => (
                        <TreeList
                        dataSource={detailData}
                        keyExpr="ID"
                        parentIdExpr="Head_ID"
                        rootValue={-1}
                        showBorders={true}
                        columnAutoWidth={true}
                        selection={{ mode: 'multiple' }}
                        showRowLines={true}
                        >
                        <Column dataField="Title" caption="Position" width={200} />
                        <Column dataField="Hire_Date" dataType="date" width={200} />
                        </TreeList>
                    )}
                />

            </DataGrid>
    )
}
