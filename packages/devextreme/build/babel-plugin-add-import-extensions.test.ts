import { transformSync } from '@babel/core';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const addImportExtensions = require('./babel-plugin-add-import-extensions');

describe('babel-plugin-add-import-extensions', () => {
  let root: string;

  const write = (relativePath: string, content = ''): void => {
    const filePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  };

  const transform = (code: string, relativeFile: string, sourceRoots: object[] = []): string => {
    const result = transformSync(code, {
      filename: path.join(root, relativeFile),
      babelrc: false,
      configFile: false,
      plugins: [[addImportExtensions, { sourceRoots }]],
    });

    return result?.code ?? '';
  };

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'add-import-extensions-'));

    write('js/ui/button.js');
    write('js/ui/widget/ui.errors.js');
    write('js/__internal/ui/button/index.ts');
    write('js/__internal/ui/button/wrapper.tsx');
    write('js/__internal/core/m_config.ts');
    write('js/viz/funnel.ts');
    write('js/viz/funnel/index.ts');
    write('js/localization/messages/en.json');
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('appends .js to file imports, including names that contain a dot', () => {
    const code = transform(
      "import Button from './button';\nimport errors from './widget/ui.errors';",
      'js/ui/component.js',
    );

    expect(code).toContain("from './button.js'");
    expect(code).toContain("from './widget/ui.errors.js'");
  });

  it('resolves .ts and .tsx sources to .js output', () => {
    const code = transform("import config from './m_config';\nimport Wrapper from '../ui/button/wrapper';", 'js/__internal/core/consumer.ts');

    expect(code).toContain("from './m_config.js'");
    expect(code).toContain("from '../ui/button/wrapper.js'");
  });

  it('points directory imports at index.js', () => {
    const code = transform("import Button from '../__internal/ui/button';", 'js/ui/button.js');

    expect(code).toContain("from '../__internal/ui/button/index.js'");
  });

  it('prefers a file over a directory with the same name, like TypeScript', () => {
    const code = transform("import funnel from './funnel';", 'js/viz/chart.ts');

    expect(code).toContain("from './funnel.js'");
  });

  it('rewrites re-exports and dynamic imports', () => {
    const code = transform(
      "export * from './button';\nexport { default } from './button';\nconst lazy = () => import('./button');",
      'js/ui/index.js',
    );

    expect(code).toContain("export * from './button.js'");
    expect(code).toContain("export { default } from './button.js'");
    expect(code).toContain("import('./button.js')");
  });

  it('keeps the original quote style', () => {
    const code = transform('import Button from "./button";', 'js/ui/component.js');

    expect(code).toContain('from "./button.js"');
  });

  it('leaves package imports and existing extensions untouched', () => {
    const code = transform(
      "import $ from 'jquery';\nimport helper from '@babel/runtime/helpers/extends';\nimport en from '../localization/messages/en.json';",
      'js/ui/button.js',
    );

    expect(code).toContain("from 'jquery'");
    expect(code).toContain("from '@babel/runtime/helpers/extends'");
    expect(code).toContain("from '../localization/messages/en.json'");
  });

  it('resolves files compiled to another folder against their sources', () => {
    write('artifacts/dist_ts/__internal/ui/button/wrapper.js');

    const code = transform(
      "import errors from '../../../ui/widget/ui.errors';\nimport config from '../../core/m_config';",
      'artifacts/dist_ts/__internal/ui/button/wrapper.js',
      [{ from: path.join(root, 'artifacts/dist_ts'), to: path.join(root, 'js') }],
    );

    expect(code).toContain("from '../../../ui/widget/ui.errors.js'");
    expect(code).toContain("from '../../core/m_config.js'");
  });

  it('fails the build on an import that does not resolve', () => {
    expect(() => transform("import missing from './missing';", 'js/ui/button.js'))
      .toThrow(/Cannot resolve '\.\/missing'/);
  });
});
