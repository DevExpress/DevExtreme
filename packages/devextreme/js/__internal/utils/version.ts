import errors from '@js/core/errors';

const MAX_MINOR_VERSION = 2;
const MIN_MINOR_VERSION = 1;

interface AssertedVersion {
  packageName: string;
  version: string;
}

const assertedVersions: AssertedVersion[] = [];

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

const VERSION_SPLITTER = '.';

export function stringifyVersion(version: Version): string {
  const { major, minor, patch } = version;

  return [major, minor, patch].join(VERSION_SPLITTER);
}

export function parseVersion(version: string): Version {
  const [major, minor, patch] = version.split('.').map(Number);

  return {
    major,
    minor,
    patch,
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
    && versionA.patch === versionB.patch;
}

export function getPreviousMajorVersion({ major, minor, patch }: Version): Version {
  const previousMajorVersion = minor === MIN_MINOR_VERSION
    ? {
      major: major - 1,
      minor: MAX_MINOR_VERSION,
      patch,
    }
    : {
      major,
      minor: minor - 1,
      patch,
    };

  return previousMajorVersion;
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
