
export function validateVersion(version: string | undefined): string {
  if (!version?.match(/(\d{2}\.\d+\.\d+)$/)) {
    throw new Error(`Error: Invalid version "${version}"! The version must satisfy devexpress version pattern (XX.X.X)`);
  }
  return version;
}

export function formatVersion(version: string | undefined): string | undefined {
  if (version === undefined) {
    return undefined;
  }

  if (version.length > 1000) {
    throw new Error("version string is too long");
  }

  return version.match(/(\d+\.\d+\.\d+)(\D|$)/)?.[1];
}

const MSECS_IN_MIN = 1000 * 60;
const MINS_IN_DAY = 60 * 24;

function getDayNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor(
    ((date.getTime() - start.getTime()) + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 1000 * 60) / MSECS_IN_MIN / MINS_IN_DAY,
  );
}

export function makeTimestamp(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const year = (date.getFullYear() % 100).toString().padStart(2, '0');
  const day = getDayNumber(date).toString().padStart(3, '0');
  return `${year}${day}-${hours}${minutes}`;
}

type BuildStage = 'alpha' | 'beta' | 'build' | '';

export function makeVersion(baseVersion: string, daily: boolean, date: Date): {
  fullVersion: string,
  baseVersion: string,
  build: string | undefined,
} {
  let [major, minor, patch] = validateVersion(baseVersion)
      .split('.')
      .map(n => Number(n));

  const stage: BuildStage = daily ?
      patch <= 1 ? 'alpha' : 'build' :
      patch <= 2 ? 'beta' : '';

  if (daily) {
    patch += 1;
  }

  const base = [major, minor, patch].join('.');
  const fullVersion = [base, stage];

  const timestamp = daily ? makeTimestamp(date) : undefined; 
  if (timestamp) {
    fullVersion.push(timestamp);
  }

  return {
    baseVersion,
    fullVersion: fullVersion.filter(v => v).join('-'),
    build: timestamp
  };
}
