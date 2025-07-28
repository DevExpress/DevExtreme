import fs from 'fs';
import path from 'path';

export interface TestFile {
  name: string;
  path: string;
  relativePath: string;
  fullPath: string;
  category: string;
}

export interface TestDirectory {
  name: string;
  path: string;
  tests: TestFile[];
  subdirectories: TestDirectory[];
}

export class TemplateRenderer {
  private templateCache = new Map<string, string>();
  private templateDir: string;

  constructor(baseDir: string) {
    this.templateDir = path.join(baseDir, 'testing/test-environment/templates');
  }

  private loadTemplate(templateName: string): string {
    if (!this.templateCache.has(templateName)) {
      const templatePath = path.join(this.templateDir, templateName);
      const content = fs.readFileSync(templatePath, 'utf-8');
      this.templateCache.set(templateName, content);
    }
    return this.templateCache.get(templateName)!;
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    return result;
  }

  renderMainPage(
    totalTests: number,
    totalFolders: number,
    folderListHTML: string
  ): string {
    const template = this.loadTemplate('main-page.html');
    return this.replaceVariables(template, {
      TOTAL_TESTS: totalTests.toString(),
      TOTAL_FOLDERS: totalFolders.toString(),
      FOLDER_LIST: folderListHTML,
    });
  }

  renderTestPage(testFile: TestFile): string {
    const template = this.loadTemplate('test-page.html');
    return this.replaceVariables(template, {
      TEST_NAME: testFile.name,
      TEST_RELATIVE_PATH: testFile.relativePath,
    });
  }
}

export function generateFolderListHTML(directory: TestDirectory, currentPath: string = ''): string {
  let html = '';
  
  directory.subdirectories.forEach(subdir => {
    const fullPath = currentPath ? `${currentPath}/${subdir.name}` : subdir.name;
    const testsCount = getAllTestsInDirectory(subdir).length;
    
    html += `
      <div class="folder-item" data-path="${fullPath}">
        <div class="folder-header" onclick="toggleFolder('${fullPath}')">
          <span class="folder-icon">📁</span>
          <span class="folder-name">${subdir.name}</span>
          <span class="tests-count">(${testsCount} tests)</span>
          <span class="toggle-arrow">▶</span>
        </div>
        <div class="folder-tests" id="tests-${fullPath}" style="display: none;">
          ${generateTestsList(subdir)}
        </div>
      </div>
    `;
  });
  
  if (directory.tests.length > 0) {
    html += `
      <div class="folder-item">
        <div class="folder-header">
          <span class="folder-icon">📄</span>
          <span class="folder-name">Root tests</span>
          <span class="tests-count">(${directory.tests.length} tests)</span>
        </div>
        <div class="folder-tests" style="display: block;">
          ${directory.tests.map(test => `
            <div class="test-item" onclick="openTest('${test.relativePath}')">
              <span class="test-icon">🧪</span>
              <span class="test-name">${test.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  return html;
}

export function getAllTestsInDirectory(directory: TestDirectory): TestFile[] {
  let allTests = [...directory.tests];
  directory.subdirectories.forEach(subdir => {
    allTests = allTests.concat(getAllTestsInDirectory(subdir));
  });
  return allTests;
}

function generateTestsList(directory: TestDirectory): string {
  const allTests = getAllTestsInDirectory(directory);
  return allTests.map(test => `
    <div class="test-item" onclick="openTest('${test.relativePath}')">
      <span class="test-icon">🧪</span>
      <span class="test-name">${test.name}</span>
      <span class="test-path">${test.relativePath}</span>
    </div>
  `).join('');
}