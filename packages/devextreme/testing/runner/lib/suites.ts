/* eslint-disable @typescript-eslint/no-use-before-define */
import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  CategoryInfo,
  ConstellationFilter,
  ConstellationName,
  RunSuiteModel,
  SuiteInfo,
  isConstellationName,
} from './types';

export interface GetAllSuitesOptions {
  deviceMode: boolean;
  constellation: ConstellationFilter;
  includeCategories: ReadonlySet<string> | null;
  excludeCategories: ReadonlySet<string> | null;
  excludeSuites: ReadonlySet<string> | null;
  partIndex: number;
  partCount: number;
}

export interface SuitesService {
  buildRunSuiteModel: (catName: string, suiteName: string) => RunSuiteModel;
  getAllSuites: (options: GetAllSuitesOptions) => SuiteInfo[];
  readCategories: () => CategoryInfo[];
  readSuites: (catName: string) => SuiteInfo[];
}

interface SuitesServiceOptions {
  knownConstellations: ReadonlySet<ConstellationName>;
  testsRoot: string;
}

interface CategoryMetaPayload {
  constellation?: string | number | boolean;
  explicit?: unknown;
  runOnDevices?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toPrimitiveString(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

function isNotEmptyDir(dirPath: string): boolean {
  try {
    return fs.readdirSync(dirPath).length > 0;
  } catch {
    return false;
  }
}

function readCategoryMeta(metaPath: string): CategoryMetaPayload {
  const parsed = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as unknown;

  if (!isRecord(parsed)) {
    throw new Error(`Invalid test category metadata: ${metaPath}`);
  }

  const rawConstellation = parsed.constellation;
  const constellationValue = typeof rawConstellation === 'string'
    || typeof rawConstellation === 'number'
    || typeof rawConstellation === 'boolean'
    ? rawConstellation
    : undefined;

  return {
    constellation: constellationValue,
    explicit: parsed.explicit,
    runOnDevices: parsed.runOnDevices,
  };
}

function parseConstellation(
  rawValue: unknown,
  metaPath: string,
  knownConstellations: ReadonlySet<ConstellationName>,
): ConstellationName {
  const constellationValue = toPrimitiveString(rawValue);

  if (!isConstellationName(constellationValue) || !knownConstellations.has(constellationValue)) {
    throw new Error(`Unknown constellation (group of categories):${constellationValue} in ${metaPath}`);
  }

  return constellationValue;
}

export function createSuitesService({
  knownConstellations,
  testsRoot,
}: SuitesServiceOptions): SuitesService {
  function readCategories(): CategoryInfo[] {
    return fs.readdirSync(testsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(testsRoot, entry.name))
      .filter(isNotEmptyDir)
      .map(categoryFromPath)
      .sort((a, b) => a.Name.localeCompare(b.Name));
  }

  function readSuites(catName: string): SuiteInfo[] {
    if (!catName) {
      throw new Error('Category name is required.');
    }

    const catPath = path.join(testsRoot, catName);

    const subDirs = fs.readdirSync(catPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    subDirs.forEach((dirName) => {
      if (!dirName.endsWith('Parts')) {
        throw new Error(`Unexpected sub-directory in the test category: ${path.join(catPath, dirName)}`);
      }
    });

    return fs.readdirSync(catPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
      .map((entry) => suiteFromPath(catName, path.join(catPath, entry.name)))
      .sort((a, b) => a.ShortName.localeCompare(b.ShortName));
  }

  function getAllSuites({
    deviceMode,
    constellation,
    includeCategories,
    excludeCategories,
    excludeSuites,
    partIndex,
    partCount,
  }: GetAllSuitesOptions): SuiteInfo[] {
    const includeSpecified = (includeCategories?.size ?? 0) > 0;
    const excludeSpecified = (excludeCategories?.size ?? 0) > 0;
    const result: SuiteInfo[] = [];

    readCategories().forEach((category) => {
      if (deviceMode && !category.RunOnDevices) {
        return;
      }

      if (constellation !== '' && category.Constellation !== constellation) {
        return;
      }

      if (includeSpecified && !includeCategories?.has(category.Name)) {
        return;
      }

      if (category.Explicit && !includeCategories?.has(category.Name)) {
        return;
      }

      if (excludeSpecified && excludeCategories?.has(category.Name)) {
        return;
      }

      let index = 0;
      readSuites(category.Name).forEach((suite) => {
        if (partCount > 1 && (index % partCount) !== partIndex) {
          index += 1;
          return;
        }

        index += 1;

        if (excludeSuites?.has(suite.FullName)) {
          return;
        }

        result.push(suite);
      });
    });

    return result;
  }

  function buildRunSuiteModel(catName: string, suiteName: string): RunSuiteModel {
    return {
      Title: suiteName,
      ScriptVirtualPath: getSuiteVirtualPath(catName, suiteName),
    };
  }

  function getSuiteVirtualPath(catName: string, suiteName: string): string {
    return `/packages/devextreme/testing/tests/${catName}/${suiteName}`;
  }

  function categoryFromPath(categoryPath: string): CategoryInfo {
    const name = path.basename(categoryPath);
    const metaPath = path.join(categoryPath, '__meta.json');
    const meta = readCategoryMeta(metaPath);

    return {
      Name: name,
      Constellation: parseConstellation(meta.constellation, metaPath, knownConstellations),
      Explicit: Boolean(meta.explicit),
      RunOnDevices: Boolean(meta.runOnDevices),
    };
  }

  function suiteFromPath(catName: string, suitePath: string): SuiteInfo {
    const suiteName = path.basename(suitePath);
    const shortName = path.basename(suitePath, '.js');

    return {
      ShortName: shortName,
      FullName: `${catName}/${suiteName}`,
      Url: `/run/${encodeURIComponent(catName)}/${encodeURIComponent(suiteName)}`,
    };
  }

  return {
    buildRunSuiteModel,
    getAllSuites,
    readCategories,
    readSuites,
  };
}
