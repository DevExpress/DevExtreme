import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Card as InfernoCard } from "devextreme/esm/__internal/grids/new/card_view/content_view/card";
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

const Card = InfernoToReact<Props>(InfernoCard);

const meta: Meta<Props> = {
  title: "Grids/CardView/Card",
  component: Card,
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
};
