import type { Meta, StoryObj } from '@storybook/react';

import CardView from 'devextreme-react/card-view';
import { items } from './data';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof CardView> = {
  title: 'Grids/CardView',
  component: CardView,
};

export default meta;


type Story = StoryObj<typeof CardView>;

export const DefaultMode: Story = {
  args: {
    dataSource: items,
    paging: {
      pageIndex: 0,
      pageSize: 5,
    },
    columns: [
      {
        dataField: 'column1',
        alignment: 'right',
      },
      {
        dataField: 'column2',
      }
    ]
  },
};
