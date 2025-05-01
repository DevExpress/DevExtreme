import type {Meta, StoryObj} from "@storybook/react";

import dxCardView from "devextreme/ui/card_view";
import {wrapDxWithReact} from "../utils";
import Button from "devextreme/ui/button";

const CardView = wrapDxWithReact(dxCardView);

const imageTypes = ['none', 'placeholder', 'small', 'wide', 'tall'] as const
type ImageType = typeof imageTypes[number];

interface HumanReadableProps {
  headerShowCheckBox: boolean;
  headerShowEditingButton: boolean;
  headerShowDeleteButton: boolean;
  headerShowCardTitle: boolean;
  image: ImageType;
  cardFields: Record<string, string>,
  showCardFooterTemplate: boolean,
}

const DEFAULT_PROPS = {
  keyExpr: 'id',
  toolbar: {
    visible: false,
  },
  headerPanel: {
    visible: false,
  },
}

const CARD_TEXT_TITLE_TEMPLATE = () => {
  const container = document.createElement('div');

  container.innerText = 'Card Header';
  container.style.fontWeight = '600';
  container.style.fontSize = '16px';
  container.style.lineHeight = '20px';

  return container;
}

const CARD_FOOTER_TEMPLATE = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'space-evenly';
  container.style.padding = '8px';
  container.style.gap = '8px';

  const button1 = document.createElement('div');
  const button2 = document.createElement('div');

  container.append(button1, button2);

  new Button(button1, {text: 'button 1', type: 'default', width: '100%'});
  new Button(button2, {text: 'button 2', type: 'default', width: '100%'});

  return container;
};

const setImageProps = (
  props: Record<string, any>,
  image: ImageType,
): void => {
  switch (image) {
    case 'placeholder':
      props.cardCover = {imageExpr: 'image'};
      return;
    case 'small':
      props.cardCover = {imageExpr: () => 'images/card_view/cat_small_crop.jpg'};
      return;
    case 'wide':
      props.cardCover = {
        imageExpr: () => 'images/card_view/cat_wide.jpg',
      };
      return;
    case 'tall':
      props.cardCover = {imageExpr: () => 'images/card_view/cat_tall.jpg'};
      return;
    case 'none':
    default:
      props.cardCover = undefined;
      return;
  }
}

const mergeProps = (
  humanReadableProps: HumanReadableProps,
  defaultProps: Record<PropertyKey, any>,
): Record<PropertyKey, any> => {
  const result = {...defaultProps};
  const {
    headerShowCheckBox,
    headerShowEditingButton,
    headerShowDeleteButton,
    headerShowCardTitle,
    image,
    cardFields,
    showCardFooterTemplate
  } = humanReadableProps;

  result.dataSource = [cardFields];

  result.selection = {
    mode: headerShowCheckBox ? 'multiple' : 'none'
  }

  result.editing = {
    allowUpdating: headerShowEditingButton,
    allowDeleting: headerShowDeleteButton,
  }

  result.cardHeader = headerShowCardTitle
    ? {
      items: [
        {
          location: 'before',
          template: CARD_TEXT_TITLE_TEMPLATE,
        },
      ]
    }
    : undefined;

  setImageProps(result, image);

  result.cardFooterTemplate = showCardFooterTemplate
    ? CARD_FOOTER_TEMPLATE
    : undefined;

  return result;
}

const CardViewHumanReadableWrapper = (
  humanReadableProps: HumanReadableProps,
) => {
  const props = mergeProps(humanReadableProps, DEFAULT_PROPS);
  return CardView(props);
}

const meta: Meta<typeof CardView> = {
  title: "Grids/CardView/Card",
  component: CardViewHumanReadableWrapper,
  argTypes: {
    headerShowCheckBox: {
      control: 'boolean',
    },
    headerShowEditingButton: {
      control: 'boolean'
    },
    headerShowDeleteButton: {
      control: 'boolean',
    },
    headerShowCardTitle: {
      control: 'boolean',
    },
    image: {
      control: 'select',
      options: imageTypes,
    },
    cardFields: {
      control: 'object',
    },
    showCardFooterTemplate: {
      control: 'boolean',
    },
  }
};

export default meta;

type Story = StoryObj<typeof CardView>;

export const Playground: Story = {
  args: {
    headerShowCheckBox: true,
    headerShowEditingButton: true,
    headerShowDeleteButton: true,
    headerShowCardTitle: true,
    image: 'none',
    cardFields: {
      id: 0,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@google.com',
      gender: 'Male',
      birthDate: '1983/11/07',
    },
    // TODO: Check, template rendered twice on first render
    showCardFooterTemplate: false,
  }
}

