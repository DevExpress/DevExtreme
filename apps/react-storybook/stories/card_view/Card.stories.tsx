import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "devextreme/esm/__internal/grids/new/card_view/content_view/card";
import { InfernoToReact } from "../utils";

interface Props {
  row: {
    key: unknown;
    cells: {
      value: unknown;
      column: {
        alignment: "left" | "right" | "center";
        name: string;
      };
    }[];
  };
}

const meta: Meta<Props> = {
  title: "Grids/CardView/Card",
};

export default meta;

type Story = StoryObj<Props>;



export const DefaultMode: Story = {
  args: {
    row: {
      cells: [
        {
          value: 1,
          column: {
            alignment: 'left',
            name: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            name: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            name: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            name: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            name: 'asd',
          },
        },
      ],
      key: 1,
    },
  },
  render: (props) => <InfernoToReact component={Card} props={props} />,
};
