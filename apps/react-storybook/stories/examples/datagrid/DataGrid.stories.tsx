import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from "react";
import { countries, generateData } from './data';

import DataGrid, {
    Column,
    DataGridTypes,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel
} from "devextreme-react/data-grid";
import DiscountCell from "./DiscountCell";
import ODataStore from "devextreme/data/odata/store";
import { AIIntegration } from 'devextreme-react/common/ai-integration';
import { AzureOpenAI } from 'openai';

const columnOptions = {
    regularColumns: [
        'ID',
        'Country',
        'Area',
        'Population_Urban',
        'Population_Rural',
        'Population_Total',
        'GDP_Agriculture',
        'GDP_Industry',
        'GDP_Services',
        'GDP_Total',
    ],
    customCommandColumns: [
        {
            type: 'buttons',
            fixedPosition: 'left',
            buttons: [{ text: 'text' }],
        },
        'ID',
        'Country',
        'Area',
        'Population_Urban',
        'Population_Rural',
        'Population_Total',
        'GDP_Agriculture',
        'GDP_Industry',
        'GDP_Services',
        'GDP_Total',
    ],
    fixedColumns: [
        {
            dataField: 'ID',
            fixed: true,
        },
        {
            dataField: 'Country',
            fixed: true,
        },
        'Area',
        'Population_Urban',
        'Population_Rural',
        'Population_Total',
        'GDP_Agriculture',
        'GDP_Industry',
        {
            dataField: 'GDP_Services',
            fixed: true,
            fixedPosition: 'right'
        },
        {
            dataField: 'GDP_Total',
            fixed: true,
            fixedPosition: 'right'
        },
    ],
    bandColumns: ['Country', 'Area', {
        caption: 'Population',
        columns: [{
            caption: 'Total',
            dataField: 'Population_Total',
            format: 'fixedPoint',
        }, {
            caption: 'Urban',
            dataField: 'Population_Urban',
            format: 'percent',
        }],
        }, {
        caption: 'Nominal GDP',
        columns: [{
            caption: 'Total, mln $',
            dataField: 'GDP_Total',
            format: 'fixedPoint',
            sortOrder: 'desc',
        }, {
            caption: 'By Sector',
            columns: [{
            caption: 'Agriculture',
            dataField: 'GDP_Agriculture',
            width: 95,
            format: {
                type: 'percent',
                precision: 1,
            },
            }, {
            caption: 'Industry',
            dataField: 'GDP_Industry',
            width: 80,
            format: {
                type: 'percent',
                precision: 1,
            },
            }, {
            caption: 'Services',
            dataField: 'GDP_Services',
            width: 85,
            format: {
                type: 'percent',
                precision: 1,
            },
            }],
        }],
    }],
    groupColumns: [
        'ID',
        {
            dataField: 'Country',
            groupIndex: 0,
        },
        {
            dataField: 'Area',
            groupIndex: 1,
        },
        'Population_Urban',
        'Population_Rural',
        'Population_Total',
        'GDP_Agriculture',
        'GDP_Industry',
        'GDP_Services',
        'GDP_Total',
    ],
};

const meta: Meta<typeof DataGrid> = {
    title: 'Example/DataGrid',
    component: DataGrid,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    argTypes: {
      columns: {
        options: Object.keys(columnOptions),
        mapping: columnOptions,
        control: { type: 'radio' },
      },
    }
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

export const Overview: Story = {
    args: {
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        showBorders: true,
        width: "100%"
    },
    render: ({ allowColumnReordering, rowAlternationEnabled, showBorders, width }) => {
        const [collapsed, setCollapsed] = useState(true);

        const onContentReady = useCallback((e: DataGridTypes.ContentReadyEvent) => {
            if (collapsed) {
                e.component.expandRow(['EnviroCare']);
                setCollapsed(false);
            }
        }, [collapsed]);

        return (
            <DataGrid
                dataSource={dataSourceOptions}
                allowColumnReordering={allowColumnReordering}
                rowAlternationEnabled={rowAlternationEnabled}
                showBorders={showBorders}
                width={width}
                onContentReady={onContentReady}
            >
                <GroupPanel visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} />
                <Grouping autoExpandAll={false} />

                <Column dataField="Product" groupIndex={0} />
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
                    cellRender={DiscountCell}
                    cssClass="bullet"
                />
                <Column dataField="SaleDate" dataType="date" />
                <Column dataField="Region" dataType="string" />
                <Column dataField="Sector" dataType="string" />
                <Column dataField="Channel" dataType="string" />
                <Column dataField="Customer" dataType="string" width={150} />

                <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
                <Paging defaultPageSize={10} />
            </DataGrid>
        );
    }
}

export const ColumnReordering: Story = {
    args: {
        allowColumnReordering: true,
        rtlEnabled: false,
        columnHidingEnabled: true,
        dataSource: countries,
        // @ts-expect-error
        columns: 'regularColumns',
        columnFixing: {
            enabled: false
        },
        grouping: {
            contextMenuEnabled: true,
        },
        groupPanel: {
            visible: true,
            allowColumnDragging: true,
        },
    }
};

const generatedData = generateData(10, 100);

export const ColumnReorderingWithVirtualColumns: Story = {
argTypes: {
    columns: {
        control: 'object',
        mapping: null,
    },
},
args: {
    allowColumnReordering: true,
    rtlEnabled: false,
    columnWidth: 100,
    dataSource: generatedData,
    columns: Object.keys(generatedData[0]),
}
}

const deployment = "gpt-4o-mini";
const apiVersion = "2024-02-01";
const endpoint = "https://public-api.devexpress.com/demo-openai";
const apiKey = "DEMO";

const aiService = new AzureOpenAI({
  dangerouslyAllowBrowser: true,
  deployment,
  endpoint,
  apiVersion,
  apiKey
});

async function getAIResponse(messages, signal): Promise<string> {
    const params = {
        messages,
        model: deployment,
        max_tokens: 1000,
        temperature: 0.7,
    };

    const response = await aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;

    return result ?? '';
}

const aiIntegration = new AIIntegration({
    sendRequest({ prompt }) {
        const controller = new AbortController();
        const signal = controller.signal;

        const aiPrompt = [
        { role: 'system', content: prompt.system, },
        { role: 'user', content: prompt.user, },
        ];

        const promise = getAIResponse(aiPrompt, signal);

        const result = {
        promise,
        abort: () => {
            controller.abort();
        },
        };

        return result;
    },
});


export const AiColumn: Story = {
    args: {
        dataSource: countries,
        aiIntegration,
        keyExpr: 'ID',
        columns: [
            {
                caption: 'AI Column 1',
                type: 'ai',
                name: 'test1',
                ai: {
                    prompt: 'Country currency',
                },
            },
            {
                caption: 'AI Column 2',
                type: 'ai',
                name: 'test2',
                ai: {
                    prompt: 'Emoji flag of the country',
                },
            },
            'Country', 'Area', 'Population_Urban', 'Population_Rural',
        ],
        allowColumnResizing: true,
        allowColumnReordering: true,
    },
};
