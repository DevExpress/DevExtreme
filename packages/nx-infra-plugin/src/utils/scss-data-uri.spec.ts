import { encodeDataUriContent, encodeDataUriForCssUrl } from './scss-data-uri';

describe('scss-data-uri', () => {
  it('encodes svg as utf-8 data uri', () => {
    const buffer = Buffer.from('<svg></svg>');
    expect(encodeDataUriContent(buffer, 'icon.svg')).toBe(
      'data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C%2Fsvg%3E',
    );
  });

  it('encodes raster images as base64', () => {
    const buffer = Buffer.from('png-bytes');
    expect(encodeDataUriContent(buffer, 'icon.png')).toBe(
      'data:image/png;base64,cG5nLWJ5dGVz',
    );
  });

  it('wraps payload for css url() replacement', () => {
    const buffer = Buffer.from('x');
    expect(encodeDataUriForCssUrl(buffer, 'a.png')).toBe('"data:image/png;base64,eA=="');
  });
});
