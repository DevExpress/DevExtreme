import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import dxPager from "devextreme/ui/pager";
import { DxToReact } from "./utils";

interface Props {
  pageSize?: number;
  pageIndex?: number;
  displayMode?: 'adaptive' | 'compact' | 'full';
}

const Pager = DxToReact<Props>(dxPager);

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
    displayMode: 'adaptive',
  },
};
