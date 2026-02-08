import type { VersionAssertion } from '@js/common';
import config from '@js/core/config';
import errors from '@js/core/errors';

const MAX_MINOR_VERSION = 2;
const MIN_MINOR_VERSION = 1;

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

export function getAssertedVersions(): VersionAssertion[] {
  return config()?.versionAssertions ?? [];
}

export function assertDevExtremeVersion(packageName: string, version: string): void {
  config({ versionAssertions: [...getAssertedVersions(), { packageName, version }] });
}

export function clearAssertedVersions(): void {
  /// #DEBUG
  config({ versionAssertions: [] });
  /// #ENDDEBUG
}

function stringifyVersionList(assertedVersionList: VersionAssertion[]): string {
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
  const mismatchingVersions = getAssertedVersions().filter(
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
