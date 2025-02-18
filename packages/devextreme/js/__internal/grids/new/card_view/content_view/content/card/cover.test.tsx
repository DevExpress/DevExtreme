/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from '@jest/globals';
import { render } from 'inferno';

import { Cover } from './cover';

describe('Cover', () => {
  it('should render the image correctly', () => {
    const container = document.createElement('div');
    const props = {
      imageSrc: 'https://www.devexpress.com/support/demos/i/demo-thumbs/aspnetcore-grid.png',
      alt: 'Card Cover',
      className: 'cover-image',
    };

    render(<Cover {...props} />, container);

    const image = container.querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.src).toBe(props.imageSrc);
    expect(image?.alt).toBe(props.alt);
    expect(image?.className).toContain(props.className);
  });
});
