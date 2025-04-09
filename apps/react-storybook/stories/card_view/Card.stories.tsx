import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Card as InfernoCard } from "devextreme/esm/__internal/grids/new/card_view/content_view/content/card/card";
import { wrapInfernoWithReact } from "../utils";

interface Props {
  row: {
    key: unknown;
    cells: {
      value: unknown;
      column: {
        alignment: "left" | "right" | "center";
        caption: string;
      };
    }[];
  };
}

const Card = wrapInfernoWithReact<Props>(InfernoCard);

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
            caption: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            caption: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            caption: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            caption: 'asd',
          },
        },
        {
          value: 1,
          column: {
            alignment: 'left',
            caption: 'asd',
          },
        },
      ],
      key: 1,
    },
  },
};
