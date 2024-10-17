import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import dxPager from "devextreme/ui/pager";
import { wrapDxWithReact } from "./utils";

interface Props {
  pageSize?: number;
  pageIndex?: number;
  totalCount?: number;
  displayMode?: 'adaptive' | 'compact' | 'full';
}

const Pager = wrapDxWithReact<Props>(dxPager);

const meta: Meta<Props> = {
  title: "Components/Pager",
  component: Pager,
  argTypes: {
    displayMode: {
      options: ['adaptive', 'compact', 'full'],
      control: { type: 'radio' }
    }
  }
};

export default meta;

type Story = StoryObj<Props>;

export const DefaultMode: Story = {
  args: {
    pageIndex: 0,
    pageSize: 10,
    totalCount: 100,
    displayMode: 'adaptive',
  },
};
