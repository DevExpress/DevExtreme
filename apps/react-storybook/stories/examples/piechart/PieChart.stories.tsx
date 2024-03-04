import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PieChart, {
    Series,
    Label,
    Connector,
    Size,
    Export,
    PieChartTypes,
} from 'devextreme-react/pie-chart';
import { areas } from './data';

const meta: Meta<typeof PieChart> = {
    title: 'Example/Pie Chart',
    component: PieChart,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    }
};

export default meta;

type Story = StoryObj<typeof PieChart>;
function pointClickHandler(e: PieChartTypes.PointClickEvent) {
    toggleVisibility(e.target);
}

function legendClickHandler(e: PieChartTypes.LegendClickEvent) {
    const arg = e.target;
    const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
    toggleVisibility(item);
}

function toggleVisibility(item) {
    item.isVisible() ? item.hide() : item.show();
}

export const Overview: Story = {
    args: {
        dataSource: areas,
        palette: "Bright",
        title: "Area of Countries",
        onPointClick: pointClickHandler,
        onLegendClick: legendClickHandler
    },
    render: ({ dataSource, palette, title, onPointClick, onLegendClick }) => (
        <PieChart
            id="pie"
            title={title}
            dataSource={dataSource}
            palette={palette}
            onPointClick={onPointClick}
            onLegendClick={onLegendClick}
        >
            <Series argumentField="country" valueField="area">
                <Label visible={true}>
                    <Connector visible={true} width={1}/>
                </Label>
            </Series>

            <Size width={500}/>
            <Export enabled={true}/>
        </PieChart>
    )
}
