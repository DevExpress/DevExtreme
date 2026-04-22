import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  VectorMapDataItem,
} from './types';

interface VectorMapServiceOptions {
  packageRoot: string;
  testingRoot: string;
  vectorDataDirectory: string;
}

export interface VectorMapService {
  readThemeCssFiles: () => string[];
  readVectorMapTestData: () => VectorMapDataItem[];
}

export function createVectorMapService({
  packageRoot,
  vectorDataDirectory,
}: VectorMapServiceOptions): VectorMapService {
  function readThemeCssFiles(): string[] {
    const bundlesPath = path.join(packageRoot, 'scss', 'bundles');
    const result: string[] = [];

    if (!fs.existsSync(bundlesPath)) {
      return result;
    }

    fs.readdirSync(bundlesPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .forEach((entry) => {
        const bundleDirectory = path.join(bundlesPath, entry.name);
        fs.readdirSync(bundleDirectory, { withFileTypes: true })
          .filter((file) => file.isFile() && file.name.endsWith('.scss'))
          .forEach((file) => {
            result.push(`${path.basename(file.name, '.scss')}.css`);
          });
      });

    return result;
  }

  function readVectorMapTestData(): VectorMapDataItem[] {
    if (!fs.existsSync(vectorDataDirectory)) {
      return [];
    }

    return fs.readdirSync(vectorDataDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.txt'))
      .map((entry) => {
        const filePath = path.join(vectorDataDirectory, entry.name);
        return {
          name: path.basename(entry.name, '.txt'),
          expected: fs.readFileSync(filePath, 'utf8'),
        };
      });
  }

  return {
    readThemeCssFiles,
    readVectorMapTestData,
  };
}
