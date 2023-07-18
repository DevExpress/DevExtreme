import { createSassForSwatch } from '../../src/modules/pre-compiler';

describe('PreCompiler', () => {
  test('createSassForSwatch', () => {
    const swatchSass = createSassForSwatch('test-theme-name', 'sass');
    expect(swatchSass.sass).toBe('.dx-swatch-test-theme-name { sass };');
    expect(swatchSass.selector).toBe('.dx-swatch-test-theme-name');
  });

  test('createSassForSwatch clean sass from encoding', () => {
    const swatchSass = createSassForSwatch('test-theme-name', '@charset "UTF-8";\nsass');
    expect(swatchSass.sass).toBe('.dx-swatch-test-theme-name { \nsass };');
    expect(swatchSass.selector).toBe('.dx-swatch-test-theme-name');
  });

  test('createSassForSwatch moves imports and font-faces before swatch selector', () => {
    const sourceCss = `
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700";

.dx-validationsummary-item-content {
  border-bottom: 1px dashed;
  display: inline-block;
  line-height: normal;
}
@font-face {
  font-family: RobotoFallback;
  font-style: normal;
  font-weight: 300;
  src: local("Roboto Light"),local("Roboto-Light"),url(fonts/Roboto-300.woff2) format("woff2"),url(fonts/Roboto-300.woff) format("woff"),url(fonts/Roboto-300.ttf) format("truetype");
}
@font-face {
  font-family: RobotoFallback;
  font-style: normal;
  font-weight: 400;
  src: local("Roboto"),local("Roboto-Regular"),url(fonts/Roboto-400.woff2) format("woff2"),url(fonts/Roboto-400.woff) format("woff"),url(fonts/Roboto-400.ttf) format("truetype");
}
.dx-theme-material-typography {
  background-color: #fff;
  color: rgba(0,0,0,.87);
  font-weight: 400;
  font-size: 14px;
  font-family: Roboto,RobotoFallback,"Noto Kufi Arabic",Helvetica,Arial,sans-serif;
  line-height: 1.2857;
}`;

    const expectedCss = `@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700";
@font-face {
  font-family: RobotoFallback;
  font-style: normal;
  font-weight: 300;
  src: local("Roboto Light"),local("Roboto-Light"),url(fonts/Roboto-300.woff2) format("woff2"),url(fonts/Roboto-300.woff) format("woff"),url(fonts/Roboto-300.ttf) format("truetype");
}
@font-face {
  font-family: RobotoFallback;
  font-style: normal;
  font-weight: 400;
  src: local("Roboto"),local("Roboto-Regular"),url(fonts/Roboto-400.woff2) format("woff2"),url(fonts/Roboto-400.woff) format("woff"),url(fonts/Roboto-400.ttf) format("truetype");
}
.dx-swatch-test-theme-name {${' '}

.dx-validationsummary-item-content {
  border-bottom: 1px dashed;
  display: inline-block;
  line-height: normal;
}
.dx-theme-material-typography {
  background-color: #fff;
  color: rgba(0,0,0,.87);
  font-weight: 400;
  font-size: 14px;
  font-family: Roboto,RobotoFallback,"Noto Kufi Arabic",Helvetica,Arial,sans-serif;
  line-height: 1.2857;
} };`;
    const swatchSass = createSassForSwatch('test-theme-name', sourceCss);
    expect(swatchSass.sass).toBe(expectedCss);
    expect(swatchSass.selector).toBe('.dx-swatch-test-theme-name');
  });
});
