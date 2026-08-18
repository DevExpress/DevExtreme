import { DATA_URI_SCSS_REGEX, encodeDataUriContent, encodeDataUriForCssUrl } from './scss-data-uri';

describe('scss-data-uri', () => {
  it.each([
    ['data-uri("image/svg+xml;charset=UTF-8", "images/a.svg")', 'image/svg+xml;charset=UTF-8', 'images/a.svg'],
    ["data-uri('image/svg+xml;charset=UTF-8', 'images/a.svg')", 'image/svg+xml;charset=UTF-8', 'images/a.svg'],
    ['data-uri("images/a.png")', undefined, 'images/a.png'],
    ["data-uri('images/a.png')", undefined, 'images/a.png'],
  ])('regex parses %s regardless of quote style', (input, mime, filePath) => {
    const matches = [...input.matchAll(DATA_URI_SCSS_REGEX)];
    expect(matches).toHaveLength(1);
    expect(matches[0][1]).toBe(mime);
    expect(matches[0][2]).toBe(filePath);
  });

  it('encodes svg as utf-8 data uri', () => {
    const buffer = Buffer.from('<svg></svg>');
    expect(encodeDataUriContent(buffer, 'icon.svg')).toBe(
      'data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C%2Fsvg%3E',
    );
  });

  it('encodes raster images as base64', () => {
    const buffer = Buffer.from('png-bytes');
    expect(encodeDataUriContent(buffer, 'icon.png')).toBe('data:image/png;base64,cG5nLWJ5dGVz');
  });

  it('wraps payload for css url() replacement', () => {
    const buffer = Buffer.from('x');
    expect(encodeDataUriForCssUrl(buffer, 'a.png')).toBe('"data:image/png;base64,eA=="');
  });
});
