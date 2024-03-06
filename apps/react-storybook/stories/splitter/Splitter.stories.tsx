import React from 'react';
import { Splitter, Item } from 'devextreme-react/splitter'
import type { Meta, StoryObj } from '@storybook/react';

import DataGrid from './DataGrid';
import Scheduler from './Scheduler';
import PieChart from './PieChart';

const meta: Meta<typeof Splitter> = {
  title: 'Components/Splitter',
  component: Splitter,
  parameters: {
    layout: 'fullscreen',
  }
};

export default meta;

type Story = StoryObj<typeof Splitter>;
export const Default: Story = {
  render: () => {
    return (
        <div style={{ height: 1600 }}>
          <Splitter orientation="vertical">
              <Item maxSize={400}>
                <Scheduler />
              </Item>
              <Item>
                <Splitter>
                  <Item>
                    <DataGrid />
                  </Item>
                  <Item>
                    <PieChart />
                  </Item>
                </Splitter>
              </Item>
              <Item>
                  <DataGrid />
              </Item>
            </Splitter>
        </div>
    );
  }
}
