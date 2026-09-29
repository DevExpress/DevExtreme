import { transformSync } from '@babel/core';
import * as fs from 'fs';
import * as path from 'path';

const terser = require(require.resolve('terser', {
  paths: [path.dirname(require.resolve('terser-webpack-plugin'))],
}));

const GRIDS_NEW = path.join(__dirname, '../js/__internal/grids/new');

/** A read of `.value`, with its receiver chain so failures name the culprit. */
const VALUE_READ = /[\w$.]*\.value\b(?!\s*=(?!=))/g;

/** `.tsx` is excluded - widen the filter if a JSX parser is ever added. */
function listModules(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return listModules(entryPath);
    }

    const isTestSupport = /\.(test|mock|test_utils)\./.test(entry.name);
    return entry.name.endsWith('.ts') && !isTestSupport ? [entryPath] : [];
  });
}

const MODULES = listModules(GRIDS_NEW);

function stripTypes(absPath: string): string {
  const result = transformSync(fs.readFileSync(absPath, 'utf8'), {
    filename: absPath,
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-typescript'],
  });

  return result!.code!;
}

async function minify(absPath: string, pureGetters: boolean): Promise<string> {
  const result = await terser.minify(stripTypes(absPath), {
    module: true,
    // Keeps property names and locals readable, so a lost read can be named in the failure.
    // It is `compress`, not `mangle`, that deletes reads — this does not weaken the guard.
    mangle: false,
    compress: { pure_getters: pureGetters },
  });

  return result.code as string;
}

/** Multiset difference: reads present in `before` that `after` no longer has. */
function lostReads(before: string, after: string): string[] {
  const remaining = after.match(VALUE_READ) ?? [];

  return (before.match(VALUE_READ) ?? []).filter((read) => {
    const at = remaining.indexOf(read);
    if (at === -1) {
      return true;
    }
    remaining.splice(at, 1);
    return false;
  });
}

describe('compress.pure_getters must not drop signal subscriptions (T1334012)', () => {
  // Guards the harness itself: a module with no `.value` reads passes trivially, so a broken
  // directory walk or an empty transform would turn the whole suite green.
  it('finds a corpus of modules that actually read .value', async () => {
    expect(MODULES.length).toBeGreaterThan(0);

    const totalReads = (
      await Promise.all(
        MODULES.map(async (m) => ((await minify(m, false)).match(VALUE_READ) ?? []).length),
      )
    ).reduce((total, n) => total + n, 0);

    expect(totalReads).toBeGreaterThan(0);
  });

  it.each(MODULES.map((m) => [path.relative(GRIDS_NEW, m), m]))(
    '%s',
    async (_name: string, absPath: string) => {
      // Every module is minified twice and the two outputs are compared. Any `.value` read
      // that survives without `pure_getters` but disappears with it is a lost subscription.
      const [before, after] = await Promise.all([minify(absPath, false), minify(absPath, true)]);

      expect(lostReads(before, after)).toEqual([]);
    },
  );
});
