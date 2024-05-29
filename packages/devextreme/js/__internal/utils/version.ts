const MAX_MINOR_VERSION = 2;
const MIN_MINOR_VERSION = 1;

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export const VERSION_SPLITTER = '.';

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

export function versionsEqual(versionAStr: string, versionBStr: string): boolean {
  const versionAComponents = versionAStr.split('.').map(Number);
  const versionBComponents = versionBStr.split('.').map(Number);

  if (versionAComponents.length !== versionBComponents.length) {
    return false;
  }

  const [majorA, minorA, patchA] = versionAComponents;
  const [majorB, minorB, patchB] = versionBComponents;

  return majorA === majorB
    && minorA === minorB
    && patchA === patchB;
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
