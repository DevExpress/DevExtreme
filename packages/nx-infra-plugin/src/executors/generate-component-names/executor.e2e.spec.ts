import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { GenerateComponentNamesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText } from '../../utils';

function createComponentFixture(directoryPath: string, fileName: string, content: string): void {
  const filePath = path.join(directoryPath, fileName);
  writeFileText(filePath, content);
}

const COMPONENT_FILES_PATH = './src/';
const EXCLUDED_COMPONENTS = ['validation-group', 'validator', 'button-group'];
const CUSTOM_OUTPUT_PATH = './tests/src/server/custom-component-names.ts';

describe('GenerateComponentNamesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-generate-comp-names-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    const uiDir = path.join(projectDir, COMPONENT_FILES_PATH);
    fs.mkdirSync(uiDir, { recursive: true });

    createComponentFixture(uiDir, 'button.ts', 'export class DxButton {}');
    createComponentFixture(uiDir, 'text-box.ts', 'export class DxTextBox {}');
    createComponentFixture(uiDir, 'data-grid.ts', 'export class DxDataGrid {}');

    createComponentFixture(uiDir, 'validation-group.ts', 'export class DxValidationGroup {}');
    createComponentFixture(uiDir, 'validator.ts', 'export class DxValidator {}');
    createComponentFixture(uiDir, 'button-group.ts', 'export class DxButtonGroup {}');

    const popupDir = path.join(uiDir, 'popup');
    fs.mkdirSync(popupDir, { recursive: true });
    createComponentFixture(popupDir, 'popup.ts', 'export class DxPopup {}');

    const testDir = path.join(projectDir, 'tests', 'src', 'server');
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should generate component names file using real devextreme-internal-tools with custom configuration options', async () => {
    const options: GenerateComponentNamesExecutorSchema = {
      componentFilesPath: COMPONENT_FILES_PATH,
      excludedFileNames: EXCLUDED_COMPONENTS,
      outputFileName: CUSTOM_OUTPUT_PATH,
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const outputPath = path.join(tempDir, 'packages', 'test-lib', CUSTOM_OUTPUT_PATH);
    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, 'utf8');

    expect(content).toContain('export const componentNames');

    EXCLUDED_COMPONENTS.forEach((excludedComponent) => {
      expect(content).not.toContain(`'${excludedComponent}'`);
    });

    expect(content).toContain("'popup'");
  });
});
