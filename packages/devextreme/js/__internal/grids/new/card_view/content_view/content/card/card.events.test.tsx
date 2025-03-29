/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

/* eslint-disable @typescript-eslint/init-declarations */

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
  row: {
    cells: [
      {
        column: {
          dataField: 'Name',
          name: 'Field',
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

describe('Events', () => {
  let container: HTMLDivElement;
  // @ts-expect-error
  beforeEach(() => {
    container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...{ ...props, elementRef: createRef() } } />, container);
  });

  it('should trigger onClick event', () => {
    const cardElement = container.querySelector(`.${CLASSES.card}`);
    cardElement?.dispatchEvent(new MouseEvent('click'));

    expect(mockOnClick.called).toBe(true);
  });

  it.skip('should trigger onDblClick event', () => {
    const cardElement = container.querySelector(`.${CLASSES.card}`);

    cardElement?.dispatchEvent(new MouseEvent('dblclick'));

    expect(mockOnDblClick.called).toBe(true);
  });

  it('should trigger onHold event', () => {
    const cardElement = container.querySelector(`.${CLASSES.card}`);

    cardElement?.dispatchEvent(new MouseEvent('dxhold'));

    expect(mockOnHold.called).toBe(true);
  });

  it('should trigger onHoverChanged event on mouse enter', () => {
    const mockHover: { called: boolean; fn: ({ isHovered }: { isHovered: boolean }) => void } = {
      called: false,
      fn: ({ isHovered }: { isHovered: boolean }) => {
        mockHover.called = true;
        expect(isHovered).toBe(true);
      },
    };

    const newProps = { ...props, hoverStateEnabled: true, onHoverChanged: mockHover.fn };
    // @ts-expect-error
    render(<Card {...newProps} />, container);

    const cardElement = container.querySelector(`.${CLASSES.card}`);
    cardElement?.dispatchEvent(new MouseEvent('mouseenter'));

    expect(mockHover.called).toBe(true);
  });

  it('should trigger onHoverChanged event on mouse leave', () => {
    const mockHover: { called: boolean; fn: ({ isHovered }: { isHovered: boolean }) => void } = {
      called: false,
      fn: ({ isHovered }: { isHovered: boolean }) => {
        mockHover.called = true;
        expect(isHovered).toBe(false);
      },
    };

    const newProps = { ...props, hoverStateEnabled: true, onHoverChanged: mockHover.fn };
    // @ts-expect-error
    render(<Card {...newProps} />, container);

    const cardElement = container.querySelector(`.${CLASSES.card}`);
    cardElement?.dispatchEvent(new MouseEvent('mouseleave'));

    expect(mockHover.called).toBe(true);
  });

  it('should handle hoverStateEnabled prop correctly', () => {
    const cardElement = container.querySelector('.dx-cardview-card');
    cardElement?.dispatchEvent(new MouseEvent('mouseenter'));

    const classList = cardElement?.getAttribute('class') || '';
    expect(classList).toContain('dx-cardview-card-hover');
  });

  it('should render field template correctly', () => {
    const fieldName = container.querySelector('.dx-cardview-field-name');
    const fieldValue = container.querySelector('.dx-cardview-field-value');

    expect(fieldName?.textContent).toBe('Field:');
    expect(fieldValue?.textContent).toBe('devextreme');
  });
});

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
