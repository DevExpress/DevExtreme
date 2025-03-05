/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from '@jest/globals';
import { render } from 'inferno';

import { Card } from './card';

const mockOnDblClick = {
  called: false,
  call() {
    this.called = true;
  },
};

const mockOnClick = {
  called: false,
  call() {
    this.called = true;
  },
};

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
  onDblClick: mockOnDblClick.call(),
  onClick: mockOnClick.call(),
};

const CLASSES = {
  card: 'dx-cardview-card',
};

describe('Events', () => {
  let container: HTMLDivElement;
  // @ts-expect-error
  beforeEach(() => {
    container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);
  });

  it('should trigger onClick event', () => {
    // @ts-expect-error
    render(<Card {...props} />, container);

    const cardElement = container.querySelector(`.${CLASSES.card}`);
    cardElement?.dispatchEvent(new MouseEvent('click'));

    expect(mockOnClick.called).toBe(true);
  });

  it('should trigger onDblClick event', () => {
    // @ts-expect-error
    render(<Card {...props} />, container);

    const cardElement = container.querySelector(`.${CLASSES.card}`);
    cardElement?.dispatchEvent(new MouseEvent('dblclick'));

    expect(mockOnDblClick.called).toBe(true);
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

  it('should apply correct minWidth, maxWidth, and width styles', () => {
    const cardElement = container.querySelector('.dx-cardview-card');
    const style = cardElement?.getAttribute('style');

    expect(style).toContain('min-width: 300px');
    expect(style).toContain('max-width: 300px');
    expect(style).toContain('width: 300px');
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
