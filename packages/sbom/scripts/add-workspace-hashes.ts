import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { addHashes } from '@devexpress/sbom-toolkit';
import type { AddHashesEntry, CycloneDXBom, Hash } from '@devexpress/sbom-toolkit';

export const INTERNAL_PACKAGES: Record<string, string> = {
  'devextreme-metadata': 'packages/devextreme-metadata',
  'eslint-migration-utils': 'packages/eslint-migration-utils/src',
};

let contentHashes: Record<string, Hash> | undefined;

interface AddWorkspaceHashesConfig {
  sbomPath: string;
  repoRoot: string;
}

export function addWorkspaceHashes({ sbomPath, repoRoot }: AddWorkspaceHashesConfig): void {
  contentHashes ??= Object.entries(INTERNAL_PACKAGES).reduce<Record<string, Hash>>(
    (acc, [name, dir]) => ({ ...acc, [name]: contentHash(repoRoot, dir) }),
    {},
  );
  const hashes = contentHashes;

  const { components = [] }: CycloneDXBom = JSON.parse(fs.readFileSync(sbomPath, 'utf-8'));
  const entries = components
    .filter((component) => Object.hasOwn(INTERNAL_PACKAGES, componentName(component)))
    .map((component): AddHashesEntry => {
      const name = componentName(component);
      assert(!component.hashes?.length, `Unexpected pre-existing hash for internal package "${name}" in ${sbomPath}`);
      assert(name in hashes, `Missing computed content hash for internal package "${name}"`);
      return { sbomPath, component: component['bom-ref'], hashes: [hashes[name]] };
    });

  if (entries.length) {
    addHashes({ packages: entries });
  }
}

function componentName({ group, name }: CycloneDXBom['components'][number]): string {
  return group ? `${group}/${name}` : name;
}

function contentHash(repoRoot: string, dir: string): Hash {
  const files = execFileSync('git', ['ls-files', '-z', '--', dir], { cwd: repoRoot, encoding: 'utf-8' })
    .split('\0')
    .filter(Boolean)
    .sort();
  if (!files.length) {
    throw new Error(`No files to hash in ${dir}`);
  }

  const hash = createHash('sha512');
  files.forEach((file) => {
    const content = fs.readFileSync(path.join(repoRoot, file));
    hash.update(`${path.posix.relative(dir, file)}\0${content.length}\0`).update(content);
  });
  return { alg: 'SHA-512', content: hash.digest('hex') };
}
