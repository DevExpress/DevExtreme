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

  test('addInfoHeader', () => {
    expect(PostCompiler.addInfoHeader('css', '1.1.1'))
      .toBe('/** Generated by the DevExpress ThemeBuilder\n'
      + '* Version: 1.1.1\n'
      + '* http://js.devexpress.com/ThemeBuilder/\n'
      + '*/\n\n'
      + 'css');
  });

  test('addInfoHeader - css has @charset at-rule', () => {
    expect(PostCompiler.addInfoHeader('@charset "UTF-8";\ncss', '1.1.1'))
      .toBe('@charset "UTF-8";\n'
      + '/** Generated by the DevExpress ThemeBuilder\n'
      + '* Version: 1.1.1\n'
      + '* http://js.devexpress.com/ThemeBuilder/\n'
      + '*/\n\n'
      + 'css');
  });

  test('cleanCss', async () => {
    expect(await PostCompiler.cleanCss('.c1 { color: #F00; } .c2 { color: #F00; }'))
      .toBe('.c1,\n.c2 {\n  color: red;\n}');
  });

  test('autoPrefixer', async () => {
    expect(await PostCompiler.autoPrefix('.c1 { box-shadow: none; }'))
      .toBe('.c1 { -webkit-box-shadow: none; box-shadow: none; }');
  });
});
