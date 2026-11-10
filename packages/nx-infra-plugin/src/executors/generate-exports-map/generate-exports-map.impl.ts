import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { readJson, writeJson } from '../../utils/file-operations';
import { toPosixPath } from '../../utils/path-resolver';
import { ExportsTarget, GenerateExportsMapExecutorSchema } from './schema';

type ExportsMap = Record<string, ExportsTarget>;

interface ModuleStub {
  main?: string;
  module?: string;
  typings?: string;
}

const PACKAGE_JSON = 'package.json';
const DTS_EXTENSION = '.d.ts';

const ERROR_DUPLICATE_SUBPATH = (subpath: string) =>
  `extraExports redefines a generated subpath: ${subpath}`;
const ERROR_MISSING_TARGETS = (missing: string[]) =>
  `The exports map points to files that do not exist:\n${missing.join('\n')}`;

function toSubpath(packageDir: string, absolutePath: string): string {
  const relative = toPosixPath(path.relative(packageDir, absolutePath));
  return relative ? `./${relative}` : '.';
}

// `module` comes first, so bundlers resolve both import and require() to esm/, as they do through
// the stub's `module` field today, and an app never loads two copies of the package.
// Node and Jest ignore `module` and keep loading cjs/ through require().
export function createStubEntry(
  stubPath: string,
  stub: ModuleStub,
  packageDir: string,
): ExportsTarget | null {
  const stubDir = path.dirname(stubPath);
  const resolveTarget = (file?: string) =>
    file ? toSubpath(packageDir, path.resolve(stubDir, file)) : undefined;

  const esm = resolveTarget(stub.module);
  const cjs = resolveTarget(stub.main);
  const types = resolveTarget(stub.typings);
  const fallback = esm ?? cjs;

  if (!fallback) {
    return null;
  }

  return {
    ...(types && { types }),
    ...(esm && { module: esm, import: esm }),
    ...(cjs && { require: cjs }),
    default: fallback,
  };
}

// './ui/button_types.d.ts' -> './ui/button_types', './data/index.d.ts' -> './data'
export function toTypeOnlySubpath(dtsSubpath: string): string {
  const withoutExtension = dtsSubpath.slice(0, -DTS_EXTENSION.length);
  return withoutExtension.endsWith('/index')
    ? withoutExtension.slice(0, -'/index'.length)
    : withoutExtension;
}

function collectTargets(target: ExportsTarget): string[] {
  return typeof target === 'string' ? [target] : Object.values(target);
}

function findMissingTargets(packageDir: string, exportsMap: ExportsMap): string[] {
  return Object.entries(exportsMap)
    .filter(([subpath]) => !subpath.includes('*'))
    .flatMap(([subpath, target]) =>
      collectTargets(target)
        .filter((file) => !fs.existsSync(path.join(packageDir, file)))
        .map((file) => `${subpath} -> ${file}`),
    );
}

interface ResolvedGenerateExportsMap {
  packageDir: string;
  ignore: string[];
  extraExports: ExportsMap;
}

export default createExecutor<GenerateExportsMapExecutorSchema, ResolvedGenerateExportsMap>({
  name: 'GenerateExportsMap',
  resolve: (options, { projectRoot }) => ({
    packageDir: path.resolve(projectRoot, options.packageDir),
    ignore: options.ignore ?? [],
    extraExports: options.extraExports ?? {},
  }),
  run: async ({ packageDir, ignore, extraExports }) => {
    const rootPackageJsonPath = path.join(packageDir, PACKAGE_JSON);
    const pkg = await readJson<Record<string, unknown>>(rootPackageJsonPath);
    const globIgnore = ['node_modules/**', ...ignore.map((dir) => `${dir}/**`)];

    const exportsMap: ExportsMap = {};

    if (typeof pkg['types'] === 'string') {
      exportsMap['.'] = { types: toSubpath(packageDir, path.resolve(packageDir, pkg['types'])) };
    }
    exportsMap['./package.json'] = './package.json';

    const stubPaths = await glob(`**/${PACKAGE_JSON}`, {
      cwd: packageDir,
      absolute: true,
      ignore: [PACKAGE_JSON, ...globIgnore],
    });
    let stubCount = 0;

    for (const stubPath of stubPaths.sort()) {
      const entry = createStubEntry(stubPath, await readJson<ModuleStub>(stubPath), packageDir);
      if (entry) {
        exportsMap[toSubpath(packageDir, path.dirname(stubPath))] = entry;
        stubCount += 1;
      }
    }

    // Declarations without a stub are type-only modules, such as ui/button_types
    const dtsFiles = await glob(`**/*${DTS_EXTENSION}`, {
      cwd: packageDir,
      posix: true,
      ignore: globIgnore,
    });
    let typeOnlyCount = 0;

    // Sorted so that 'data.d.ts' wins over 'data/index.d.ts', as in TypeScript resolution
    for (const dtsFile of dtsFiles.sort()) {
      const types = `./${dtsFile}`;
      const subpath = toTypeOnlySubpath(types);
      if (!(subpath in exportsMap)) {
        exportsMap[subpath] = { types };
        typeOnlyCount += 1;
      }
    }

    for (const [subpath, target] of Object.entries(extraExports)) {
      if (subpath in exportsMap) {
        throw new Error(ERROR_DUPLICATE_SUBPATH(subpath));
      }
      exportsMap[subpath] = target;
    }

    const missing = findMissingTargets(packageDir, exportsMap);
    if (missing.length > 0) {
      throw new Error(ERROR_MISSING_TARGETS(missing));
    }

    pkg['exports'] = exportsMap;
    await writeJson(rootPackageJsonPath, pkg);

    logger.verbose(
      `Generated exports in ${rootPackageJsonPath}: ${stubCount} modules, ${typeOnlyCount} type-only modules, `
        + `${Object.keys(extraExports).length} extra entries`,
    );
  },
});
