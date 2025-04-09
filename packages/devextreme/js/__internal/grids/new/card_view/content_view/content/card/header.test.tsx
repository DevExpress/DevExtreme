/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { describe, expect, it } from '@jest/globals';
import { render } from 'inferno';

import { CardHeader, CLASSES } from './header';

describe('CardHeader', () => {
  it('should render with default properties', () => {
    const container = document.createElement('div');
    render(<CardHeader visible items={[{ location: 'before', text: 'Test Header' }]} />, container);

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
    render(<CardHeader visible={false} />, container);

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
        row={{ name: 'Card Title' }}
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
    const CustomTemplate = (items: any[]) => (
      <div className="custom-header">{items[0].text}</div>
    );

    render(
      <CardHeader
        visible
        template={CustomTemplate}
        items={[{ location: 'before', text: 'Custom Header' }]}
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
        row={{ name: 'Card Title' }}
      />,
      container,
    );

    const checkboxItem = container.querySelector('.dx-cardview-select-checkbox');
    expect(checkboxItem).not.toBeNull();
  });
});
