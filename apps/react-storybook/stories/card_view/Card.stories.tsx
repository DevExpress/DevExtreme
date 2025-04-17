import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {generatedData} from './generatedData';

import { Card as InfernoCard } from "devextreme/esm/__internal/grids/new/card_view/content_view/content/card/card";
import { wrapInfernoWithReact } from "../utils";
import { Footer } from "./templates";

interface Props {
  allowSelectOnClick: boolean;
  showSelectCheckBox: boolean;
  showImage: boolean;
  showFooter: boolean;
}

const data = generatedData[0];
const columns = Object.keys(data);

const row = {
  key: 1,
  cells: columns.map((column) => ({
    column: {
      caption: column,
    },
    text: data[column]
  }))
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
    allowSelectOnClick: true,
    showSelectCheckBox: true,
    showImage: true,
    showFooter: true,
  },

  render(props) {
    const cover = props.showImage ? {
      imageExpr: function(data) {console.log(arguments)},
      altExpr: function(data) {console.log(arguments)},
    } : {};

    const footer = props.showFooter && Footer;

    return <Card
      allowSelectOnClick={props.allowSelectOnClick}
      isCheckBoxesRendered={props.showSelectCheckBox}
      row={row}
      cover={cover}
    />
  }
};
