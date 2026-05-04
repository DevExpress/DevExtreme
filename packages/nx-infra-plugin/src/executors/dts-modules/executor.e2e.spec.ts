import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { DtsModulesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, readFileText, writeJson } from '../../utils';

const LICENSE_TEMPLATE = `/*<%= commentType %>
* DevExtreme (<%= file.relative.replace(/\\\\/g, '/') %>)
* Version: <%= version %>
* Build date: <%= (new Date()).toDateString() %>
*
* Copyright (c) 2012 - <%= (new Date()).getFullYear() %> Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: <%= eula %>
*/
`;

const DEBUG_CONTENT = `export declare function accordion(): void;
//#DEBUG
export declare function debugHelper(): void;
//#ENDDEBUG
`;

const HOVER_TEMPLATE = `import DevExpress from '../bundles/dx.all';`;
const DX_ALL_JS_TEMPLATE = `// This file is required to compile devextreme-angular`;

const OPTIONS: DtsModulesExecutorSchema = {
  sourceDir: './js',
  outputDir: './artifacts/npm/devextreme',
  templatesDir: './build/npm-templates',
  licenseTemplateFile: './build/gulp/license-header.txt',
  eulaUrl: 'https://js.devexpress.com/Licensing/',
};

describe('DtsModulesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-dts-modules-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');

    fs.mkdirSync(path.join(projectDir, 'js', 'ui'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'build', 'gulp'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'build', 'npm-templates', 'events'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'build', 'npm-templates', 'bundles'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'build', 'npm-templates', 'integration'), {
      recursive: true,
    });

    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'devextreme',
      version: '26.1.0',
    });

    await writeFileText(
      path.join(projectDir, 'build', 'gulp', 'license-header.txt'),
      LICENSE_TEMPLATE,
    );

    await writeFileText(path.join(projectDir, 'js', 'accordion.d.ts'), DEBUG_CONTENT);
    await writeFileText(
      path.join(projectDir, 'js', 'ui', 'button.d.ts'),
      'export declare class Button {}',
    );

    await writeFileText(
      path.join(projectDir, 'build', 'npm-templates', 'events', 'hover.d.ts'),
      HOVER_TEMPLATE,
    );
    await writeFileText(
      path.join(projectDir, 'build', 'npm-templates', 'bundles', 'dx.all.js'),
      DX_ALL_JS_TEMPLATE,
    );
    await writeFileText(
      path.join(projectDir, 'build', 'npm-templates', 'integration', 'jquery.d.ts'),
      "import 'jquery';",
    );
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should produce the expected file tree with banners applied and debug blocks stripped', async () => {
    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');

    const accordionContent = await readFileText(path.join(outDir, 'accordion.d.ts'));
    expect(accordionContent).toMatch(/^\/\*\*/);
    expect(accordionContent).toContain('accordion');

    const hoverContent = await readFileText(path.join(outDir, 'events', 'hover.d.ts'));
    expect(hoverContent).toContain(HOVER_TEMPLATE);

    const dxAllJsContent = await readFileText(path.join(outDir, 'bundles', 'dx.all.js'));
    expect(dxAllJsContent).toContain('DevExtreme (dx.all.js)');
    expect(dxAllJsContent).not.toContain('DevExtreme (bundles/dx.all.js)');
    expect(dxAllJsContent).toContain(DX_ALL_JS_TEMPLATE);

    expect(fs.existsSync(path.join(outDir, 'bundles', 'dx.all.d.ts'))).toBe(false);
  });

  it('should overwrite a template when a real source d.ts exists at the same relative path', async () => {
    const REAL_CONTENT = 'export declare function click(): void;';
    await writeFileText(path.join(projectDir, 'js', 'events', 'click.d.ts'), REAL_CONTENT);
    await writeFileText(
      path.join(projectDir, 'build', 'npm-templates', 'events', 'click.d.ts'),
      'import DevExpress from "../bundles/dx.all";',
    );

    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    const clickContent = await readFileText(path.join(outDir, 'events', 'click.d.ts'));

    expect(clickContent).toContain(REAL_CONTENT);
    expect(clickContent).not.toContain('import DevExpress from "../bundles/dx.all"');
  });

  it('should be idempotent across two runs', async () => {
    const result1 = await executor(OPTIONS, context);
    expect(result1.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    const contentAfterFirst = await readFileText(path.join(outDir, 'accordion.d.ts'));

    const result2 = await executor(OPTIONS, context);
    expect(result2.success).toBe(true);

    const contentAfterSecond = await readFileText(path.join(outDir, 'accordion.d.ts'));

    expect(contentAfterFirst).toBe(contentAfterSecond);
    expect((contentAfterFirst.match(/\/\*\*/g) ?? []).length).toBe(1);
  });

  it('should use the bundled template when licenseTemplateFile is omitted', async () => {
    const options: DtsModulesExecutorSchema = {
      sourceDir: './js',
      outputDir: './artifacts/npm/devextreme',
      templatesDir: './build/npm-templates',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'artifacts', 'npm', 'devextreme');
    const accordionContent = await readFileText(path.join(outDir, 'accordion.d.ts'));
    expect(accordionContent).toMatch(/^\/\*\*/);
  });
});
