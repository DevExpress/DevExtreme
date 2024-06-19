import errors from '@js/core/errors';

interface AssertedVersion {
  packageName: string;
  version: string;
}

const assertedVersions: AssertedVersion[] = [];

export interface Version {
  major: number;
  minor: number;
  patch: number;
  buildParts?: number[];
}

const VERSION_SPLITTER = '.';

function stringifyVersion(version: Version): string {
  const { major, minor, patch } = version;

  return [major, minor, patch].join(VERSION_SPLITTER);
}

export function parseVersion(version: string): Version {
  const [major, minor, patch, ...rest] = version.split('.').map(Number);

  return {
    major,
    minor,
    patch,
    buildParts: rest || [],
  };
}

export function assertDevExtremeVersion(packageName: string, version: string): void {
  assertedVersions.push({
    packageName,
    version,
  });
}

export function clearAssertedVersions(): void {
  /// #DEBUG
  assertedVersions.splice(0);
  /// #ENDDEBUG
}

function stringifyVersionList(assertedVersionList: AssertedVersion[]): string {
  return assertedVersionList
    .map((assertedVersion) => `${assertedVersion.packageName}: ${assertedVersion.version}`)
    .join('\n');
}

function versionsEqual(versionA: Version, versionB: Version): boolean {
  return versionA.major === versionB.major
    && versionA.minor === versionB.minor
    && versionA.patch === versionB.patch
    && versionA.buildParts?.length === versionB.buildParts?.length
    && (!versionA.buildParts?.length
      || versionA.buildParts?.every(
        (buildPart, index) => buildPart === versionB.buildParts?.[index],
      )
    );
}

export function assertedVersionsCompatible(currentVersion: Version): boolean {
  const mismatchingVersions = assertedVersions.filter(
    (assertedVersion) => !versionsEqual(
      parseVersion(assertedVersion.version),
      currentVersion,
    ),
  );

  if (mismatchingVersions.length) {
    errors.log('W0023', stringifyVersionList([
      {
        packageName: 'devextreme',
        version: stringifyVersion(currentVersion),
      },
      ...mismatchingVersions,
    ]));
    return false;
  }

  return true;
}
