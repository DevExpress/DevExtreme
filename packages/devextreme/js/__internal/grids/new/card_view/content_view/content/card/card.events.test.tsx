import { describe, expect, it } from '@jest/globals';
import { createRef, render } from 'inferno';

import { Card, CLASSES } from './card';

const createMockCallback = () => ({
  called: false,
  call(): void {
    this.called = true;
  },
});

const mockSelectCard = createMockCallback();
const mockOnDblClick = createMockCallback();
const mockOnClick = createMockCallback();
const mockOnHold = createMockCallback();

const props = {
  card: {
    fields: [
      {
        column: {
          dataField: 'Name',
          name: 'Field',
          caption: 'Field',
        },
        value: 'devextreme',
        text: 'devextreme',
      },
    ],
    key: 0,
  },
  toolbar: [
    {
      location: 'before',
      widget: 'dxCheckBox',
    },
    {
      location: 'before',
      text: 'Card Header',
    },
    {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'edit',
        stylingMode: 'text',
      },
    },
    {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'trash',
        stylingMode: 'text',
      },
    },
  ],
  cover: {
    src: 'https://www.devexpress.com/support/demos/i/demo-thumbs/aspnetcore-grid.png',
    alt: 'Card Cover',
    className: 'card-cover',
  },
  hoverStateEnabled: true,
  maxWidth: 300,
  width: 300,
  minWidth: 300,
  selectCard: mockSelectCard.call.bind(mockSelectCard),
  onDblClick: mockOnDblClick.call.bind(mockOnDblClick),
  onClick: mockOnClick.call.bind(mockOnClick),
  onHold: mockOnHold.call.bind(mockOnHold),
};

describe('Callbacks', () => {
  describe('selectCard', () => {
    // @ts-expect-errors
    beforeEach(() => {
      mockSelectCard.called = false;
    });

    describe('when allowSelectOnClick = true', () => {
      it('should rise it', () => {
        const container = document.createElement('div');
        const newProps = { ...props, elementRef: createRef(), allowSelectOnClick: true };
        // @ts-expect-error
        render(<Card {...newProps} />, container);

        const cardElement = container.querySelector(`.${CLASSES.card}`);

        cardElement?.dispatchEvent(new MouseEvent('click'));

        expect(mockSelectCard.called).toBe(true);
      });
    });

    describe('when allowSelectOnClick = false', () => {
      it('should not rise it', () => {
        const container = document.createElement('div');
        const newProps = { ...props, elementRef: createRef(), allowSelectOnClick: false };
        // @ts-expect-error
        render(<Card {...newProps} />, container);

        const cardElement = container.querySelector(`.${CLASSES.card}`);

        cardElement?.dispatchEvent(new MouseEvent('click'));

        expect(mockSelectCard.called).toBe(false);
      });
    });
  });
});
