import PostCompiler from '../../src/modules/post-compiler';

describe('PostCompiler', () => {
  test('addBasePath', () => {
    expect(PostCompiler.addBasePath('font: url(fonts/roboto.ttf);', 'base')).toBe('font: url(base/fonts/roboto.ttf);');
    expect(PostCompiler.addBasePath('font: url(fonts/roboto.ttf);', 'base/')).toBe('font: url(base/fonts/roboto.ttf);');
    expect(PostCompiler.addBasePath('font: url(fonts/roboto.ttf);', 'c:\\base\\')).toBe('font: url(c:\\base/fonts/roboto.ttf);');

    expect(PostCompiler.addBasePath('font: url(fonts/r.ttf),url(fonts/r.woff);', 'base/')).toBe('font: url(base/fonts/r.ttf),url(base/fonts/r.woff);');
    expect(PostCompiler.addBasePath('font: url(\'fonts/roboto.ttf\');', 'base/')).toBe('font: url(\'base/fonts/roboto.ttf\');');
    expect(PostCompiler.addBasePath('font: url("fonts/roboto.ttf");', 'base/')).toBe('font: url("base/fonts/roboto.ttf");');

    expect(PostCompiler.addBasePath('font: url(icons/roboto.ttf);', 'base/')).toBe('font: url(base/icons/roboto.ttf);');
    expect(PostCompiler.addBasePath(Buffer.from('font: url(icons/roboto.ttf);'), 'base/')).toBe('font: url(base/icons/roboto.ttf);');

    expect(PostCompiler.addBasePath('font: url(data:BASE64);', 'base/')).toBe('font: url(data:BASE64);');
    expect(PostCompiler.addBasePath('font: url(image SVG);', 'base/')).toBe('font: url(image SVG);');
  });
});
