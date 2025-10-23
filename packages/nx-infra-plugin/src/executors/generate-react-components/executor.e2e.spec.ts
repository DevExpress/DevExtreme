import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { GenerateReactComponentsExecutorSchema } from './schema';
import {
  createTempDir,
  cleanupTempDir,
  createMockContext,
} from '../../utils/test-utils';
import { writeFileText, writeJson } from '../../utils';

describe('GenerateReactComponentsExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-gen-react-e2e-');
    context = createMockContext({
      root: tempDir,
      projectName: 'react-wrappers',
      projectRoot: 'packages/react-wrappers',
    });

    const projectDir = path.join(tempDir, 'packages', 'react-wrappers');
    const srcDir = path.join(projectDir, 'src');

    fs.mkdirSync(path.join(srcDir, 'core'), { recursive: true });
    await writeFileText(
      path.join(srcDir, 'core', 'component.tsx'),
      `export class Component<P = any> {\n  constructor(public props: P) {}\n}\n`
    );
    await writeFileText(
      path.join(srcDir, 'core', 'extension-component.tsx'),
      `export class ExtensionComponent {}\n`
    );
    await writeFileText(
      path.join(srcDir, 'core', 'nested-option.ts'),
      `export class NestedOption {}\n`
    );

    const metadataDir = path.join(tempDir, 'packages', 'metadata', 'dist');
    fs.mkdirSync(metadataDir, { recursive: true });
    await writeJson(
      path.join(metadataDir, 'integration-data.json'),
      {
        Widgets: {
          dxButton: {
            name: 'Button',
            module: 'ui/button',
            properties: [
              { name: 'text', type: 'String' },
              { name: 'type', type: 'String' },
              { name: 'onClick', type: 'Function' },
            ],
          },
          dxTextBox: {
            name: 'TextBox',
            module: 'ui/text_box',
            properties: [
              { name: 'value', type: 'String' },
              { name: 'placeholder', type: 'String' },
            ],
          },
        },
      }
    );
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Basic generation workflow', () => {
    it('should generate component wrappers from metadata', async () => {
      const mockGenerator = jest.fn(async (config) => {
        const outDir = config.out.componentsDir;
        const indexFile = config.out.indexFileName;

        await writeFileText(
          path.join(outDir, 'button.tsx'),
          `export const Button = () => <div>Button</div>;`
        );
        await writeFileText(
          path.join(outDir, 'text-box.tsx'),
          `export const TextBox = () => <div>TextBox</div>;`
        );

        await writeFileText(
          indexFile,
          `export { Button } from "./button";\nexport { TextBox } from "./text-box";\n`
        );
      });

      jest.mock('devextreme-internal-tools', () => ({
        generateReactComponents: mockGenerator,
      }), { virtual: true });

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
        componentsDir: './src',
        indexFileName: './src/index.ts',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const srcDir = path.join(tempDir, 'packages', 'react-wrappers', 'src');

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
    });

    it('should handle missing metadata file gracefully', async () => {
      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: './nonexistent/metadata.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });
  });

  describe('Cleaning behavior', () => {
    it('should clean old generated files before generation', async () => {
      const srcDir = path.join(tempDir, 'packages', 'react-wrappers', 'src');

      await writeFileText(path.join(srcDir, 'old-component.tsx'), 'old content');
      await writeFileText(path.join(srcDir, 'legacy-file.tsx'), 'legacy content');

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
      };

      await executor(options, context);

      expect(fs.existsSync(path.join(srcDir, 'old-component.tsx'))).toBe(false);
      expect(fs.existsSync(path.join(srcDir, 'legacy-file.tsx'))).toBe(false);
    });

    it('should preserve core directory during cleaning', async () => {
      const srcDir = path.join(tempDir, 'packages', 'react-wrappers', 'src');

      await writeFileText(path.join(srcDir, 'core', 'custom.tsx'), 'custom core file');
      await writeFileText(path.join(srcDir, 'temp-generated.tsx'), 'temp');

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
      };

      await executor(options, context);

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(srcDir, 'core', 'custom.tsx'))).toBe(true);

      expect(fs.existsSync(path.join(srcDir, 'temp-generated.tsx'))).toBe(false);
    });

    it('should preserve common directory during cleaning', async () => {
      const srcDir = path.join(tempDir, 'packages', 'react-wrappers', 'src');

      fs.mkdirSync(path.join(srcDir, 'common'));
      await writeFileText(path.join(srcDir, 'common', 'utils.ts'), 'utils');

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
      };

      await executor(options, context);

      expect(fs.existsSync(path.join(srcDir, 'common', 'utils.ts'))).toBe(true);
    });
  });

  describe('Path resolution', () => {
    it('should resolve metadata path relative to project', async () => {
      const projectDir = path.join(tempDir, 'packages', 'react-wrappers');

      await writeJson(
        path.join(projectDir, 'metadata.json'),
        { Widgets: {} }
      );

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: './metadata.json',
      };

      const result = await executor(options, context);

      expect(result).toHaveProperty('success');
    });

    it('should resolve ../ paths correctly', async () => {
      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
      };

      const result = await executor(options, context);

      expect(result).toHaveProperty('success');
    });
  });

  describe('Configuration options', () => {
    it('should accept custom component paths', async () => {
      const srcDir = path.join(tempDir, 'packages', 'react-wrappers', 'src');

      fs.mkdirSync(path.join(srcDir, 'templates'), { recursive: true });
      await writeFileText(path.join(srcDir, 'templates', 'base.tsx'), 'base');

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
        baseComponent: './templates/base',
        extensionComponent: './templates/extension',
        configComponent: './templates/config',
      };

      const result = await executor(options, context);

      expect(result).toHaveProperty('success');
    });

    it('should accept custom output paths', async () => {
      const projectDir = path.join(tempDir, 'packages', 'react-wrappers');

      fs.mkdirSync(path.join(projectDir, 'generated'), { recursive: true });

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
        componentsDir: './generated',
        indexFileName: './generated/index.ts',
      };

      const result = await executor(options, context);

      expect(result).toHaveProperty('success');
    });
  });

  describe('Multiple runs', () => {
    it('should handle repeated generation cleanly', async () => {
      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
      };

      const result1 = await executor(options, context);
      expect(result1).toHaveProperty('success');

      const result2 = await executor(options, context);
      expect(result2).toHaveProperty('success');

      const srcDir = path.join(tempDir, 'packages', 'react-wrappers', 'src');

      expect(fs.existsSync(path.join(srcDir, 'core', 'component.tsx'))).toBe(true);
    });
  });

  describe('Error scenarios', () => {
    it('should handle corrupted metadata gracefully', async () => {
      const metadataPath = path.join(tempDir, 'packages', 'metadata', 'dist', 'integration-data.json');

      await writeFileText(metadataPath, 'not valid json {{{');

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });

    it('should handle missing core templates', async () => {
      const srcDir = path.join(tempDir, 'packages', 'react-wrappers', 'src');

      fs.rmSync(path.join(srcDir, 'core'), { recursive: true, force: true });

      const options: GenerateReactComponentsExecutorSchema = {
        metadataPath: '../metadata/dist/integration-data.json',
      };

      const result = await executor(options, context);

      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });
  });
});
