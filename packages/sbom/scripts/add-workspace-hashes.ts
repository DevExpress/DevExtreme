import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { addHashes } from '@devexpress/sbom-toolkit';
import type { AddHashesEntry, CycloneDXBom, Hash } from '@devexpress/sbom-toolkit';

const INTERNAL_PACKAGES: Record<string, string> = {
  'devextreme-metadata': 'packages/devextreme-metadata/dist',
  'eslint-migration-utils': 'packages/eslint-migration-utils/src',
};

const contentHashes = new Map<string, Hash>();

interface AddWorkspaceHashesConfig {
  sbomPath: string;
  repoRoot: string;
  tarballs: Map<string, string>;
}

export function addWorkspaceHashes({ sbomPath, repoRoot, tarballs }: AddWorkspaceHashesConfig): void {
  const getContentHash = (name: string): Hash | undefined => {
    if (!contentHashes.has(name) && name in INTERNAL_PACKAGES) {
      contentHashes.set(name, contentHash(path.join(repoRoot, INTERNAL_PACKAGES[name])));
    }
    return contentHashes.get(name);
  };

  const { components = [] }: CycloneDXBom = JSON.parse(fs.readFileSync(sbomPath, 'utf-8'));
  const entries = components.flatMap((component): AddHashesEntry[] => {
    if (component.hashes?.length) {
      return [];
    }
    const name = component.group ? `${component.group}/${component.name}` : component.name;
    const target = { sbomPath, component: component['bom-ref'] };
    const tarball = tarballs.get(name);
    if (tarball) {
      return [{ ...target, tarball }];
    }
    const hash = getContentHash(name);
    return hash ? [{ ...target, hashes: [hash] }] : [];
  });

  if (entries.length) {
    addHashes({ packages: entries });
  }
}

function contentHash(dir: string): Hash {
  const hash = createHash('sha512');
  fs.readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((file) => fs.statSync(path.join(dir, file)).isFile())
    .map((file) => file.split(path.sep).join('/'))
    .sort()
    .forEach((file) => {
      const content = fs.readFileSync(path.join(dir, file));
      // Delimit path and size so different file layouts can't produce the same byte stream.
      hash.update(`${file}\0${content.length}\0`).update(content);
    });
  return { alg: 'SHA-512', content: hash.digest('hex') };
}
