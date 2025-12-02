import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { compileGetter } from '@js/common/data';
import { Guid } from '@ts/core/m_guid';
import { render } from 'inferno';

import { Card } from './card';

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
    data: {
      Field: 'Name',
      img: 'https://www.devexpress.com/support/demos/i/demo-thumbs/aspnetcore-grid.png',
      alt: 'Card Cover',
    },
  },
  header: {
    items: [
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
  },
  cover: {
    imageExpr: compileGetter('img'),
    altExpr: compileGetter('alt'),
  },
};

describe('Rendering', () => {
  beforeEach(() => {
    jest.spyOn(Guid.prototype, '_normalize').mockReturnValue('guidmock');
  });

  afterEach(() => {
    jest.spyOn(Guid.prototype, '_normalize').mockRestore();
  });
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

describe('Cover', () => {
  it('should be rendered', () => {
    const container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);

    const image = container.querySelector('img');
    expect(image).not.toBeNull();
  });

  it('should be rendered if imageExpr is not defined but template is defined', () => {
    const container = document.createElement('div');
    const localProps = {
      ...props,
      cover: {
        template: () => <img className='myTemplate'/>,
      },
    };

    // @ts-expect-error
    render(<Card {...localProps} />, container);

    expect(container.querySelector('.myTemplate')).toBeTruthy();
  });
});

describe('Field Template', () => {
  it('should render field template correctly', () => {
    const container = document.createElement('div');
    // @ts-expect-error
    render(<Card {...props} />, container);

    const fieldName = container.querySelector('.dx-cardview-field-caption');
    const fieldValue = container.querySelector('.dx-cardview-field-value');

    expect(fieldName?.textContent).toBe('Field:');
    expect(fieldValue?.textContent).toBe('devextreme');
  });
});
