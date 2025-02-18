/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from '@jest/globals';
import { compileGetter } from '@js/common/data';
import { render } from 'inferno';

import { Card } from './card';

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
    data: {
      Field: 'Name',
      img: 'https://www.devexpress.com/support/demos/i/demo-thumbs/aspnetcore-grid.png',
      alt: 'Card Cover',
    },
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
    imageExpr: compileGetter('img'),
    altExpr: compileGetter('alt'),
  },
};

describe('Rendering', () => {
  it('should be rendered correctly', () => {
    const container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);

    expect(container).toMatchSnapshot();
  });

  it('should render content correctly', () => {
    const container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);

    const fieldValue = container.querySelector('.dx-cardview-field-value');
    expect(fieldValue?.textContent).toEqual('devextreme');
  });
});

describe('Card Header', () => {
  it('should render the card header components correctly', () => {
    const container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);

    const cardHeaderText = container.querySelector('.dx-toolbar-label .dx-toolbar-item-content > div');
    expect(cardHeaderText?.textContent).toBe('Card Header');

    const checkbox = container.querySelectorAll('.dx-checkbox');
    expect(checkbox).toHaveLength(1);

    const editButton = container.querySelectorAll('.dx-icon-edit');
    expect(editButton).toHaveLength(1);

    const trashButton = container.querySelectorAll('.dx-icon-trash');
    expect(trashButton).toHaveLength(1);
  });
});

describe('Image', () => {
  it('should render the image correctly', () => {
    const container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);

    const image = container.querySelector('img');
    expect(image).not.toBeNull();
  });
});

describe('Field Template', () => {
  it('should render field template correctly', () => {
    const container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);

    const fieldName = container.querySelector('.dx-cardview-field-name');
    const fieldValue = container.querySelector('.dx-cardview-field-value');

    expect(fieldName?.textContent).toBe('Field:');
    expect(fieldValue?.textContent).toBe('devextreme');
  });
});
