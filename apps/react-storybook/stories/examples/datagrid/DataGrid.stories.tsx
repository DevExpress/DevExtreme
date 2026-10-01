import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useCallback, useMemo, useRef, useState } from "react";
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

const columnChooserArgTypes: Partial<Meta<typeof DataGrid>['argTypes']> = {
    'columnChooser.enabled': {
        control: 'boolean',
    },
    'columnChooser.mode': {
        control: 'radio',
        options: ['select', 'dragAndDrop'],
    },
    'columnChooser.title': {
        control: 'text',
    },
    'columnChooser.height': {
        control: 'number',
    },
    'columnChooser.width': {
        control: 'number',
    },
    'columnChooser.sortOrder': {
        control: 'radio',
        options: ['asc', 'desc', 'none'],
        mapping: {
            asc: 'asc',
            desc: 'desc',
            none: undefined,
        },
    },
    'columnChooser.emptyPanelText': {
        control: 'text',
    },
    'columnChooser.container': {
        control: 'text',
    },
    'columnChooser.search.enabled': {
        control: 'boolean',
    },
    'columnChooser.search.timeout': {
        control: 'number',
    },
    'columnChooser.selection.allowSelectAll': {
        control: 'boolean',
    },
    'columnChooser.selection.recursive': {
        control: 'boolean',
    },
    'columnChooser.selection.selectByClick': {
        control: 'boolean',
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

const deployment = "demo-mini";
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
        max_completion_tokens: 1000,
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


const aiResponseOptions = [
    {
        text: 'Success with one executed command',
        response: {
            actions: [{ name: 'Command executed successfully', args: {} }],
        },
    },
    {
        text: 'Success with several executed commands',
        response: {
            actions: [
                { name: 'Command executed successfully', args: {} },
                { name: 'Another command executed successfully', args: {} },
            ],
        },
    },
    {
        text: 'Success with one executed command and an error command',
        response: {
            actions: [
                { name: 'Command executed successfully', args: {} },
                { name: 'Error executing command', args: {} },
            ],
        },
    },
    {
        text: 'Error',
        response: null,
        error: 'Error from AI service',
    },
];

const aiResponseOptionsMap = {
    'Success with one executed command': aiResponseOptions[0],
    'Success with several executed commands': aiResponseOptions[1],
    'Success with one executed command and an error command': aiResponseOptions[2],
    'Error': aiResponseOptions[3],
};

export const AIAssistant: Story = {
    argTypes: {
        'aiResponse': {
            control: 'select',
            options: Object.keys(aiResponseOptionsMap),
            description: 'Simulated AI response type',
        },
    },
    args: {
        dataSource: countries,
        keyExpr: 'ID',
        showBorders: true,
        columns: ['Country', 'Area', 'Population_Total', 'GDP_Total'],
        aiResponse: 'Success with one executed command',
    },
    render: ({ aiResponse, ...args }) => {
        const responseRef = useRef(aiResponseOptions[0]);

        responseRef.current = aiResponseOptionsMap[aiResponse as string] ?? aiResponseOptions[0];

        const aiIntegrationInstance = useMemo(() => new AIIntegration({
            sendRequest() {
                let rejectFn: (reason?: unknown) => void;
                const current = responseRef.current;

                const promise = new Promise<string>((resolve, reject) => {
                    rejectFn = reject;

                    setTimeout(() => {
                        if (current.error) {
                            reject(new Error(current.error));
                        } else {
                            resolve(JSON.stringify(current.response));
                        }
                    }, 2000);
                });

                return {
                    promise,
                    abort: () => { rejectFn(new Error('Aborted')); },
                };
            },
        }), []);

        return (
            <DataGrid
                {...args}
                // @ts-expect-error --- IGNORE ---
                aiAssistant={{
                    enabled: true,
                    aiIntegration: aiIntegrationInstance,
                }}
            />
        );
    },
};

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

export const RowDraggingWithFixedColumns: Story = {
    args: {
        showBorders: true,
        showRowLines: false,
        rowDragging: {
            showDragIcons: true,
        },
    },
    render: ({ showBorders, showRowLines, rowDragging }) => {
        const [data, setData] = useState(countries);

        const onReorder = useCallback((e: DataGridTypes.RowDraggingReorderEvent) => {
            setData((items) => {
                const reorderedItems = [...items];
                const [movedItem] = reorderedItems.splice(e.fromIndex, 1);

                reorderedItems.splice(e.toIndex, 0, movedItem);

                return reorderedItems;
            });
        }, []);

        return (
            <DataGrid
                dataSource={data}
                keyExpr="ID"
                height={440}
                showBorders={showBorders}
                showRowLines={showRowLines}
                columnFixing={{ enabled: true }}
                focusedRowEnabled={true}
                selection={{ mode: 'single' }}
                rowDragging={{
                    allowReordering: true,
                    showDragIcons: rowDragging?.showDragIcons,
                    onReorder,
                }}
                columns={['Country', 'Area', 'Population_Total', 'GDP_Total']}
            />
        );
    },
};

export const ColumnChooserStory: Story = {
    name: 'ColumnChooser',
    argTypes: columnChooserArgTypes,
    args: {
        'columnChooser.enabled': true,
        'columnChooser.mode': 'select',
        'columnChooser.title': 'Choose Columns',
        'columnChooser.height': 300,
        'columnChooser.width': 250,
        'columnChooser.sortOrder': undefined,
        'columnChooser.emptyPanelText': 'Drag a column here to hide it',
        'columnChooser.search.enabled': true,
        'columnChooser.search.timeout': 0,
        'columnChooser.selection.allowSelectAll': true,
        'columnChooser.selection.recursive': true,
        'columnChooser.selection.selectByClick': true,
    },
    render: (args) => (
        <DataGrid
            dataSource={countries}
            keyExpr="ID"
            showBorders={true}
            allowColumnReordering={true}
            {...args}
        >
            <Column dataField="ID" width={60} />
            <Column dataField="Country" />
            <Column dataField="Area" caption="Area, km²" format="fixedPoint" />
            <Column caption="Population">
                <Column dataField="Population_Total" caption="Total" format="fixedPoint" />
                <Column dataField="Population_Urban" caption="Urban" format="percent" />
                <Column dataField="Population_Rural" caption="Rural" format="percent" />
            </Column>
            <Column caption="GDP">
                <Column dataField="GDP_Total" caption="Total, mln $" allowHiding={false} format="fixedPoint" />
                <Column dataField="GDP_Agriculture" caption="Agriculture" format={{ type: 'percent', precision: 1 }} />
                <Column dataField="GDP_Industry" caption="Industry" format={{ type: 'percent', precision: 1 }} />
                <Column dataField="GDP_Services" caption="Services" format={{ type: 'percent', precision: 1 }} />
            </Column>
        </DataGrid>
    ),
};

const resizeSeparatorData = [
    { ID: 1, CompanyName: 'Super Mart of the West', City: 'Bentonville', State: 'Arkansas', Phone: '(800) 555-2797', Fax: '(800) 555-2171' },
    { ID: 2, CompanyName: 'Electronics Depot', City: 'Atlanta', State: 'Georgia', Phone: '(800) 595-3232', Fax: '(800) 595-3231' },
    { ID: 3, CompanyName: 'K&S Music', City: 'Minneapolis', State: 'Minnesota', Phone: '(612) 304-6073', Fax: '(612) 304-6074' },
    { ID: 4, CompanyName: "Tom's Club", City: 'Issaquah', State: 'Washington', Phone: '(800) 955-2292', Fax: '(800) 955-2293' },
    { ID: 5, CompanyName: 'E-Mart', City: 'Hoffman Estates', State: 'Illinois', Phone: '(847) 286-2500', Fax: '(847) 286-2501' },
    { ID: 6, CompanyName: 'Walters', City: 'Deerfield', State: 'Illinois', Phone: '(847) 940-2500', Fax: '(847) 940-2501' },
];

type ResizeSeparatorScenario = {
    instructions: string;
    mode: 'nextColumn' | 'widget';
    rtlEnabled?: boolean;
    fixedPhone?: boolean;
    initialScrollLeft?: number;
};

const ResizeSeparatorReviewGrid = ({
    mode,
    rtlEnabled = false,
    fixedPhone = false,
    initialScrollLeft = 0,
}: ResizeSeparatorScenario) => {
    const scrollInitialized = useRef(false);
    const onContentReady = (e: DataGridTypes.ContentReadyEvent): void => {
        if (!scrollInitialized.current) {
            scrollInitialized.current = true;
            e.component.getScrollable()?.scrollTo({ left: initialScrollLeft });
        }
    };

    return (
        <DataGrid
            dataSource={resizeSeparatorData}
            keyExpr="ID"
            columnResizingMode={mode}
            allowColumnResizing={true}
            columnWidth="auto"
            rtlEnabled={rtlEnabled}
            showBorders={true}
            width={500}
            height={300}
            onContentReady={onContentReady}
        >
            <Column dataField="CompanyName" />
            <Column dataField="City" />
            <Column dataField="State" />
            <Column dataField="Phone" fixed={fixedPhone} fixedPosition="right" />
            <Column dataField="Fax" fixed={true} fixedPosition="right" />
        </DataGrid>
    );
};

const ResizeSeparatorReview = (scenario: ResizeSeparatorScenario) => {
    const [resetCount, setResetCount] = useState(0);

    return (
        <div style={{ padding: 16 }}>
            <p style={{ maxWidth: 500 }}>{scenario.instructions}</p>
            <button type="button" onClick={() => setResetCount((count) => count + 1)}
                style={{ marginBottom: 16 }}>
                Reset grid
            </button>
            <ResizeSeparatorReviewGrid key={resetCount} {...scenario} />
        </div>
    );
};

export const RightFixedResizeReview: Story = {
    name: 'Resize review - right-fixed Fax',
    render: () => (
        <ResizeSeparatorReview
            mode="nextColumn"
            instructions="Hold the left border of Fax, then drag left and right. Watch whether the blue separator jumps away from the border."
        />
    ),
};

export const RtlFixedResizeReview: Story = {
    name: 'Resize review - RTL fixed columns',
    render: () => (
        <ResizeSeparatorReview
            mode="nextColumn"
            rtlEnabled={true}
            fixedPhone={true}
            instructions="Resize the border between Phone and Fax in both directions. Watch whether the blue separator stays on the border being resized."
        />
    ),
};

export const WidgetResizeReview: Story = {
    name: 'Resize review - widget containment',
    render: () => (
        <ResizeSeparatorReview
            mode="widget"
            fixedPhone={true}
            instructions="Drag the right border of City or State through Phone and Fax and past the grid. The column can keep growing, while the blue separator should stop before Phone. Drag back to shrink it."
        />
    ),
};

export const RtlScrollResizeReview: Story = {
    name: 'Resize review - RTL scroll preservation',
    render: () => (
        <ResizeSeparatorReview
            mode="widget"
            rtlEnabled={true}
            fixedPhone={true}
            initialScrollLeft={50}
            instructions="The grid starts partly scrolled. Hold a visible border of a non-fixed column without moving, then drag. Watch whether the non-fixed columns jump when you press. Reset restores the starting scroll position."
        />
    ),
};
