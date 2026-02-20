import * as fs from 'fs';
import * as path from 'path';

export class SideEffectFinder {
  private checkedPaths: Map<string, Set<string>> = new Map();
  private recursiveHandlingPaths: Set<string> = new Set();

  getModuleSideEffectFiles(moduleFilePath: string): string[] {
    try {
      const moduleSideEffectFiles = [...this.findSideEffectsInModule(moduleFilePath)].map(
        (importPath) => importPath.replace(/\\/g, '/'),
      );
      return moduleSideEffectFiles;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(
        `Exception while checking side effects in ${moduleFilePath}\nException: ${message}`,
      );
    }
  }

  private findSideEffectsInModule(moduleFilePath: string): Set<string> {
    let foundPaths = this.checkedPaths.get(moduleFilePath);

    if (!foundPaths) {
      if (!fs.existsSync(moduleFilePath)) {
        return new Set();
      }

      const code = fs.readFileSync(moduleFilePath, 'utf8');
      foundPaths = this.findSideEffectsInImports(moduleFilePath, code);
    }

    foundPaths = foundPaths || new Set();
    this.checkedPaths.set(moduleFilePath, foundPaths);

    return foundPaths;
  }

  private findSideEffectsInImports(modulePath: string, code: string): Set<string> {
    const relativePathRegExp = /['"]\.?\.\/.+['"]/;
    const isSideEffectImportRegExp = /^\s*import\s+['"]/ms;

    const imports = code.match(/^\s*import[^;]+;/gm) || [];
    let foundPaths = new Set<string>();

    imports
      .filter((str) => relativePathRegExp.test(str))
      .forEach((str) => {
        const match = str.match(relativePathRegExp);
        if (!match) return;

        let importPath = match[0].replace(/(^['"]|['"]$)/g, '');
        importPath = path.join(path.dirname(modulePath), importPath) + '.js';

        if (!fs.existsSync(importPath)) {
          importPath = importPath.replace(/\.js$/, '/index.js');
        }

        if (isSideEffectImportRegExp.test(str)) {
          foundPaths.add(importPath);
        }

        const isInLoop = this.recursiveHandlingPaths.has(importPath);

        if (!isInLoop) {
          this.recursiveHandlingPaths.add(importPath);
          foundPaths = new Set([...foundPaths, ...this.findSideEffectsInModule(importPath)]);
          this.recursiveHandlingPaths.delete(importPath);
        }
      });

    return foundPaths;
  }
}
