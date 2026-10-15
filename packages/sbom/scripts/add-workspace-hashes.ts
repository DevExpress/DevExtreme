import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { addHashes } from '@devexpress/sbom-toolkit';
import type { AddHashesEntry, CycloneDXBom } from '@devexpress/sbom-toolkit';

const INTERNAL_PACKAGES = ['devextreme-metadata', 'eslint-migration-utils'];

interface AddWorkspaceHashesConfig {
  distDir: string;
  repoRoot: string;
  packages: { fullName: string; tarball?: string }[];
}

export function addWorkspaceHashes({ distDir, repoRoot, packages }: AddWorkspaceHashesConfig): void {
  const tarballs = new Map(packages.flatMap(({ fullName, tarball }) => (tarball ? [[fullName, tarball]] : [])));
  const packDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sbom-pack-'));

  const getTarball = (name: string): string | undefined => {
    if (!tarballs.has(name) && INTERNAL_PACKAGES.includes(name)) {
      tarballs.set(name, pack(path.join(repoRoot, 'packages', name), path.join(packDir, name)));
    }
    return tarballs.get(name);
  };

  try {
    const entries: AddHashesEntry[] = fs.readdirSync(distDir)
      .filter((file) => file.endsWith('.cdx.json'))
      .flatMap((file) => {
        const sbomPath = path.join(distDir, file);
        const { components = [] }: CycloneDXBom = JSON.parse(fs.readFileSync(sbomPath, 'utf-8'));
        return components.flatMap((component) => {
          const name = component.group ? `${component.group}/${component.name}` : component.name;
          const tarball = component.hashes?.length ? undefined : getTarball(name);
          return tarball ? [{ sbomPath, component: component['bom-ref'], tarball }] : [];
        });
      });

    if (entries.length) {
      addHashes({ packages: entries });
    }
  } finally {
    fs.rmSync(packDir, { recursive: true, force: true });
  }
}

function pack(dir: string, destination: string): string {
  execFileSync('pnpm', ['pack', '--pack-destination', destination], { cwd: dir, stdio: 'ignore' });
  return path.join(destination, fs.readdirSync(destination)[0]);
}
