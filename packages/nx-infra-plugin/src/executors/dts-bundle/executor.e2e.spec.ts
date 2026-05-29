import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { DtsBundleExecutorSchema } from './schema';
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

const DX_ALL_CONTENT = `declare global {
  interface JQuery<TElement = HTMLElement> {}
  interface JQuery<TElement = HTMLElement> {
    dxButton(): JQuery;
    dxButton(options: string): any;
  }
}

declare namespace DevExpress {
  export interface Options {}
}
`;

const ALIASES_CONTENT = `declare namespace DevExpress {
  export type EventObject = object;
}
`;

const OPTIONS: DtsBundleExecutorSchema = {
  bundleSources: ['./ts/dx.all.d.ts', './ts/aliases.d.ts'],
  artifactPath: './artifacts/ts/dx.all.d.ts',
  packagePath: './artifacts/npm/devextreme/bundles/dx.all.d.ts',
  licenseTemplateFile: './build/gulp/license-header.txt',
  eulaUrl: 'https://js.devexpress.com/Licensing/',
};

describe('DtsBundleExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-dts-bundle-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');

    fs.mkdirSync(path.join(projectDir, 'ts'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'build', 'gulp'), { recursive: true });

    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'devextreme',
      version: '26.1.0',
    });

    await writeFileText(
      path.join(projectDir, 'build', 'gulp', 'license-header.txt'),
      LICENSE_TEMPLATE,
    );
    await writeFileText(path.join(projectDir, 'ts', 'dx.all.d.ts'), DX_ALL_CONTENT);
    await writeFileText(path.join(projectDir, 'ts', 'aliases.d.ts'), ALIASES_CONTENT);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should produce artifact bundle with bang-comment banner and stripped declare global wrapper', async () => {
    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const artifactContent = await readFileText(
      path.join(projectDir, 'artifacts', 'ts', 'dx.all.d.ts'),
    );

    expect(artifactContent).toMatch(/^\/\*!/);
    expect(artifactContent).not.toContain('declare global');
    expect(artifactContent).toContain('interface JQuery');
    expect(artifactContent).toContain('EventObject');
  });

  it('should produce package bundle with star-comment banner, footer, and stripped jQuery interface body', async () => {
    const result = await executor(OPTIONS, context);
    expect(result.success).toBe(true);

    const packageContent = await readFileText(
      path.join(projectDir, 'artifacts', 'npm', 'devextreme', 'bundles', 'dx.all.d.ts'),
    );

    expect(packageContent).toMatch(/^\/\*\*/);
    expect(packageContent).toContain('\nexport default DevExpress;');
    expect(packageContent).toContain('interface JQuery');
    expect(packageContent).not.toContain('dxButton()');
  });
});
