import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Pager from "devextreme/ui/pager";
import { DxToReact } from "./utils";

interface Props {
  pageSize: number;
  pageIndex: number;
}

const meta: Meta<Props> = {
  title: "Components/Pager",
};

export default meta;

type Story = StoryObj<Props>;

export const DefaultMode: Story = {
  args: {
    pageIndex: 0,
    pageSize: 10
  },
  render: (props) => <DxToReact component={Pager} props={props} />,
};
