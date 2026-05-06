import * as path from 'path';
import { buildLicenseBannerRenderer, extractGitHubUrl } from './license-banner';
import { createTempDir, cleanupTempDir } from './test-utils';
import { writeFileText } from './file-operations';

describe('buildLicenseBannerRenderer', () => {
  it('compiles template once and returns a sync renderer per file', async () => {
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

  it('interpolates eulaUrl and year into the rendered banner', async () => {
    const tempDir = createTempDir('nx-license-renderer-eula-e2e-');
    try {
      const templatePath = path.join(tempDir, 'license.txt');
      await writeFileText(
        templatePath,
        `/*<%= commentType %>\n* Copyright (c) 2012 - <%= year %> Developer Express Inc.\n* Read about DevExtreme licensing here: <%= eula %>\n*/\n`,
      );
      const pkg = { name: 'devextreme', version: '26.1.0' };
      const render = await buildLicenseBannerRenderer({
        templatePath,
        pkg,
        eulaUrl: 'https://js.devexpress.com/Licensing/',
        commentType: '!',
      });

      const banner = render('events/hover.d.ts');
      const currentYear = new Date().getFullYear();

      expect(banner).toMatch(/^\/\*!/);
      expect(banner).toContain('Developer Express Inc.');
      expect(banner).toContain(`2012 - ${currentYear}`);
      expect(banner).toContain('https://js.devexpress.com/Licensing/');
    } finally {
      cleanupTempDir(tempDir);
    }
  });

  it('should extract github URL from string repository field', () => {
    const result = extractGitHubUrl('git+https://github.com/foo/bar.git', '/fake/path.json');
    expect(result).toBe('https://github.com/foo/bar');
  });

  it('should extract github URL from object repository field', () => {
    const result = extractGitHubUrl(
      { url: 'git+https://github.com/foo/bar.git' },
      '/fake/path.json',
    );
    expect(result).toBe('https://github.com/foo/bar');
  });

  it('should preserve URLs without git+ prefix or .git suffix', () => {
    const result = extractGitHubUrl('https://github.com/foo/bar', '/fake/path.json');
    expect(result).toBe('https://github.com/foo/bar');
  });

  it('should throw when repository is missing', () => {
    expect(() => extractGitHubUrl(undefined, '/fake/path.json')).toThrow(
      "Missing 'repository' field",
    );
  });

  it('should throw when repository.url is missing on object form', () => {
    expect(() => extractGitHubUrl({}, '/fake/path.json')).toThrow("Invalid 'repository' format");
  });

  it('normalizes CRLF in template to LF so banner output is identical across Windows and Linux runners', async () => {
    const tempDir = createTempDir('nx-license-renderer-crlf-e2e-');
    try {
      const templatePath = path.join(tempDir, 'license.txt');
      await writeFileText(
        templatePath,
        `/*<%= commentType %>\r\n* <%= file.relative %>\r\n* Version: <%= version %>\r\n*/\r\n`,
      );
      const pkg = { name: 'test-pkg', version: '1.0.0' };
      const render = await buildLicenseBannerRenderer({ templatePath, pkg, commentType: '*' });

      const banner = render('foo.d.ts');

      expect(banner).not.toContain('\r');
      expect(banner.split('\n').length).toBeGreaterThan(1);
    } finally {
      cleanupTempDir(tempDir);
    }
  });
});
