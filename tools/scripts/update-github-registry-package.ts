import assert from 'node:assert';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REGISTRY = 'https://npm.pkg.github.com';

const workspaceFile = path.resolve(__dirname, '../../pnpm-workspace.yaml');
assert.ok(fs.existsSync(workspaceFile), `❌ Cannot find pnpm-workspace.yaml at ${workspaceFile}`);

const [, , pkgName, pkgVersion] = process.argv;
assert.ok(pkgName, '❌ Package name is required');
assert.ok(pkgVersion, '❌ Package version is required');

const tarballUrl = getTarballUrl(`${pkgName}@${pkgVersion}`);

let workspaceFileContent = fs.readFileSync(workspaceFile, 'utf8');
const entryPattern = new RegExp(`(["|']${pkgName}["|']\\s*:\\s*).*$`, 'm');

assert.ok(entryPattern.test(workspaceFileContent), `❌ Cannot find an entry for package '${pkgName}' in pnpm-workspace.yaml`);
workspaceFileContent = workspaceFileContent.replace(entryPattern, `$1${tarballUrl}`);
fs.writeFileSync(workspaceFile, workspaceFileContent);

console.log(`📝 "${pkgName}": ${tarballUrl}`);
console.log(`✅ Done`);

function getTarballUrl(specifier: string): string {
  try {
    console.log(`⏳ Fetching tarball URL from ${REGISTRY}...`);
    const tarballUrl = childProcess.execSync(`pnpm view ${specifier} dist.tarball --registry=${REGISTRY}`, { encoding: 'utf8' }).trim();
    assert.ok(tarballUrl, `❌ No tarball URL returned for ${specifier}`);
    return tarballUrl;
  } catch (error) {
    assert.fail(`❌ Failed to fetch tarball for ${specifier}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
