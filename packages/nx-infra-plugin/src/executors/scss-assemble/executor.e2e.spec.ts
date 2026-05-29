import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { ScssAssembleExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { readFileText, writeFileText } from '../../utils/file-operations';

const SVG_CONTENT = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>';
const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const OPTIONS: ScssAssembleExecutorSchema = {
  scssPackagePath: '../devextreme-scss',
  outputDir: './artifacts/npm/devextreme/scss',
};

describe('ScssAssembleExecutor E2E', () => {
  let tempDir: string;
  let scssPackageDir: string;
  let outputDir: string;

  beforeEach(() => {
    tempDir = createTempDir('nx-scss-assemble-e2e-');
    scssPackageDir = path.join(tempDir, 'packages', 'devextreme-scss');
    outputDir = path.join(
      tempDir,
      'packages',
      'test-lib',
      'artifacts',
      'npm',
      'devextreme',
      'scss',
    );

    fs.mkdirSync(path.join(scssPackageDir, 'scss'), { recursive: true });
    fs.mkdirSync(path.join(scssPackageDir, 'fonts'), { recursive: true });
    fs.mkdirSync(path.join(scssPackageDir, 'icons', 'material'), { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should copy fonts and icons preserving directory structure under widgets/', async () => {
    fs.writeFileSync(
      path.join(scssPackageDir, 'fonts', 'dx-font.woff'),
      Buffer.from([0x00, 0x01, 0x00, 0x00]),
    );
    fs.writeFileSync(path.join(scssPackageDir, 'icons', 'material', 'icon.svg'), SVG_CONTENT);
    await writeFileText(path.join(scssPackageDir, 'scss', 'placeholder.scss'), '.a {}');

    const context = createMockContext({ root: tempDir });
    const result = await executor(OPTIONS, context);

    expect(result.success).toBe(true);
    expect(
      fs.existsSync(
        path.join(outputDir, 'widgets', 'material', 'typography', 'fonts', 'dx-font.woff'),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(outputDir, 'widgets', 'base', 'icons', 'material', 'icon.svg')),
    ).toBe(true);
  });

  it('should inline data-uri references in scss files (svg url-encoded, png base64)', async () => {
    fs.mkdirSync(path.join(scssPackageDir, 'icons'), { recursive: true });
    await writeFileText(path.join(scssPackageDir, 'icons', 'foo.svg'), SVG_CONTENT);
    fs.writeFileSync(path.join(scssPackageDir, 'icons', 'bar.png'), PNG_BYTES);
    await writeFileText(
      path.join(scssPackageDir, 'scss', 'main.scss'),
      ".a { background: data-uri('icons/foo.svg'); }\n.b { background: data-uri('icons/bar.png'); }\n",
    );

    const context = createMockContext({ root: tempDir });
    const result = await executor(OPTIONS, context);

    expect(result.success).toBe(true);

    const content = await readFileText(path.join(outputDir, 'main.scss'));
    const expectedSvg = `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(SVG_CONTENT)}")`;
    const expectedPng = `url("data:image/png;base64,${PNG_BYTES.toString('base64')}")`;

    expect(content).toContain(expectedSvg);
    expect(content).toContain(expectedPng);
  });
});
