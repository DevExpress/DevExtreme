import * as path from 'path';
import { buildLicenseBannerRenderer } from './license-banner';
import { createTempDir, cleanupTempDir } from './test-utils';
import { writeFileText } from './file-operations';

it('buildLicenseBannerRenderer compiles template once and returns a sync renderer per file', async () => {
  const tempDir = createTempDir('nx-license-renderer-e2e-');
  try {
    const templatePath = path.join(tempDir, 'license.txt');
    await writeFileText(
      templatePath,
      `/*<%= commentType %>\n* <%= file.relative %>\n* Version: <%= version %>\n*/\n`,
    );
    const pkg = { name: 'test-pkg', version: '1.0.0' };
    const render = await buildLicenseBannerRenderer({ templatePath, pkg, commentType: '*' });

    const banner1 = render('foo.d.ts');
    const banner2 = render('bar/baz.d.ts');

    expect(banner1).toMatch(/^\/\*\*/);
    expect(banner1).toContain('foo.d.ts');
    expect(banner1).toContain('Version: 1.0.0');
    expect(banner2).toMatch(/^\/\*\*/);
    expect(banner2).toContain('bar/baz.d.ts');
    expect(banner2).not.toContain('foo.d.ts');
  } finally {
    cleanupTempDir(tempDir);
  }
});

it('buildLicenseBannerRenderer uses default banner template when templatePath is omitted', async () => {
  const pkg = {
    name: 'devextreme',
    version: '26.1.0',
    repository: 'https://github.com/DevExpress/DevExtreme',
  };
  const render = await buildLicenseBannerRenderer({ pkg, commentType: '!' });

  const banner = render('events/hover.d.ts');

  expect(banner).toMatch(/^\/\*!/);
  expect(banner).toContain('devextreme');
  expect(banner).toContain('26.1.0');
  expect(banner).toContain('Developer Express Inc.');
});
