/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { describe, expect, it } from '@jest/globals';
import { render } from 'inferno';

import { CardHeader, CLASSES } from './header';

describe('CardHeader', () => {
  it('should render with default properties', () => {
    const container = document.createElement('div');
    render(<CardHeader card={{} as any} visible items={[{ location: 'before', text: 'Test Header' }]} />, container);

    // Verify the rendered element
    const header = container.querySelector(`.${CLASSES.cardHeader}`);
    expect(header).not.toBeNull();

    // Verify the item text
    const headerItem = container.querySelector('.dx-toolbar-item');
    expect(headerItem).not.toBeNull();
    expect(headerItem?.textContent).toBe('Test Header');
  });

  it('should not render when visible is false', () => {
    const container = document.createElement('div');
    render(<CardHeader card={{} as any} visible={false} />, container);

    // Verify the header is not rendered
    const header = container.querySelector(CLASSES.cardHeader);
    expect(header).toBeNull();
  });

  it('should render with caption from captionExpr', () => {
    const container = document.createElement('div');
    render(
      <CardHeader
        visible
        captionExpr="name"
        // @ts-expect-error
        card={{ name: 'Card Title' }}
      />,
      container,
    );

    // Verify the caption text
    const captionItem = container.querySelector('.dx-toolbar-item');
    expect(captionItem).not.toBeNull();
    expect(captionItem?.textContent).toBe('Card Title');
  });

  it('should render with a custom template', () => {
    const container = document.createElement('div');
    const CustomTemplate = () => (
      <div className="custom-header">Custom Header</div>
    );

    render(
      <CardHeader
        visible
        card={{} as any}
        template={CustomTemplate}
      />,
      container,
    );

    // Verify the custom template
    const customHeader = container.querySelector('.custom-header');
    expect(customHeader).not.toBeNull();
    expect(customHeader?.textContent).toBe('Custom Header');
  });

  it('should render a selection checkbox', () => {
    const container = document.createElement('div');
    render(
      <CardHeader
        visible
        isCheckBoxesRendered
        // @ts-expect-error
        card={{ name: 'Card Title' }}
      />,
      container,
    );

    const checkboxItem = container.querySelector('.dx-cardview-select-checkbox');
    expect(checkboxItem).not.toBeNull();
  });
});
