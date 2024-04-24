const MAX_MINOR_VERSION = 2;

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

export function getPreviousMajorVersion({ major, minor, patch }: Version): Version {
  const previousMajorVersion = minor === 1
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
