import type { Meta, StoryObj } from '@storybook/react';

import React, { useCallback, useState } from 'react';
import CardView, { CardViewTypes } from 'devextreme-react/card-view';
import { items } from './data';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof CardView> = {
  title: 'Grids/CardView',
  component: CardView,
  tags: ['autodocs'],
};

export default meta;


type Story = StoryObj<typeof CardView>;

export const DefaultMode: Story = {
  args: {
    dataSource: items,
    paging: {
      pageIndex: 0,
      pageSize: 5,
    }
  },
};
