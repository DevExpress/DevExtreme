import React from 'react';
import {Splitter, Item} from 'devextreme-react/splitter'
import type {Meta, StoryObj} from '@storybook/react';

import DataGridSample from './samples/DataGrid';
import SchedulerSample from './samples/Scheduler';
import PieChartSample from './samples/PieChart';

const meta: Meta<typeof Splitter> = {
    title: 'Components/Splitter',
    component: Splitter,
    parameters: {
        layout: 'fullscreen',
    }
};

export default meta;

type Story = StoryObj<typeof Splitter>;

export const Horizontal: Story = {
    render: () => {
        return (
            <div style={{height: 900}}>
                <Splitter orientation="horizontal" >
                    <Item>
                        <PieChartSample/>
                    </Item>
                    <Item>
                        <DataGridSample/>
                    </Item>
                </Splitter>
            </div>
        );
    }
}

export const Vertical: Story = {
    render: () => {
        return (
            <div style={{height: 800}}>
                <Splitter orientation="vertical">
                    <Item maxSize={400}>
                        <DataGridSample/>
                    </Item>
                    <Item>
                        <DataGridSample/>
                    </Item>
                </Splitter>
            </div>
        );
    }
}

export const Nested: Story = {
    render: () => {
        return (
            <div style={{height: 1200}}>
                <Splitter orientation="vertical">
                    <Item maxSize={400}>
                        <SchedulerSample/>
                    </Item>
                    <Item>
                        <Splitter>
                            <Item>
                                <DataGridSample/>
                            </Item>
                            <Item>
                                <PieChartSample/>
                            </Item>
                        </Splitter>
                    </Item>
                    <Item>
                        <DataGridSample/>
                    </Item>
                </Splitter>
            </div>
        );
    }
}
