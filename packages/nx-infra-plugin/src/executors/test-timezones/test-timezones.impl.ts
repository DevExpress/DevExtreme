import * as path from 'path';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { readFileText } from '../../utils/file-operations';
import { TestTimezonesExecutorSchema } from './schema';

const DEFAULT_MOMENT_TIMEZONE_URL =
  'https://raw.githubusercontent.com/moment/moment-timezone/develop/data/unpacked/latest.json';

interface MomentTimezoneZone {
  name: string;
  abbrs: string[];
  untils: (number | null)[];
  offsets: number[];
}

interface MomentTimezoneData {
  zones: MomentTimezoneZone[];
  links: string[];
  version: string;
}

interface ResolvedTestTimezones {
  projectRoot: string;
  timezoneListFilePath: string;
  momentTimezoneUrl: string;
}

export function extractTimezoneList(fileContent: string): string[] {
  const listMatch = fileContent.match(/value\s*:\s*\[([\s\S]*?)\]/);
  if (!listMatch) {
    throw new Error('Could not parse timezone list: expected "value: [...]" export pattern');
  }

  const rawList = listMatch[1];
  const timezones = rawList
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, '').trim()) // strip inline comments
    .join(',')
    .split(',')
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
    .filter((entry) => entry.length > 0 && !entry.startsWith('//'));

  return timezones;
}

export async function fetchMomentTimezoneData(url: string): Promise<MomentTimezoneData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch moment-timezone data from ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as Promise<MomentTimezoneData>;
}

export function validateTimezoneList(
  bundledTimezones: string[],
  momentData: MomentTimezoneData,
): string[] {
  const momentZoneNames = new Set(momentData.zones.map((zone) => zone.name));

  // Also include link targets (aliases)
  for (const link of momentData.links) {
    const [, alias] = link.split('|');
    if (alias) {
      momentZoneNames.add(alias);
    }
    // Also add the link source
    const [source] = link.split('|');
    if (source) {
      momentZoneNames.add(source);
    }
  }

  const invalidTimezones: string[] = [];
  for (const timezone of bundledTimezones) {
    if (!momentZoneNames.has(timezone)) {
      invalidTimezones.push(timezone);
    }
  }

  return invalidTimezones;
}

export default createExecutor<TestTimezonesExecutorSchema, ResolvedTestTimezones>({
  name: 'TestTimezones',
  resolve: (options, { projectRoot }) => {
    const timezoneListFilePath = path.resolve(projectRoot, options.timezoneListFile);
    const momentTimezoneUrl = options.momentTimezoneUrl || DEFAULT_MOMENT_TIMEZONE_URL;
    return { projectRoot, timezoneListFilePath, momentTimezoneUrl };
  },
  run: async (resolved) => {
    logger.verbose('Reading bundled timezone list...');
    const fileContent = await readFileText(resolved.timezoneListFilePath);
    const bundledTimezones = extractTimezoneList(fileContent);
    logger.verbose(`Found ${bundledTimezones.length} timezones in bundled list`);

    logger.verbose(`Fetching latest moment-timezone data from ${resolved.momentTimezoneUrl}...`);
    const momentData = await fetchMomentTimezoneData(resolved.momentTimezoneUrl);
    logger.verbose(
      `Fetched moment-timezone data (version: ${momentData.version}, ${momentData.zones.length} zones, ${momentData.links.length} links)`,
    );

    const invalidTimezones = validateTimezoneList(bundledTimezones, momentData);

    if (invalidTimezones.length > 0) {
      const label = invalidTimezones.length === 1 ? 'timezone' : 'timezones';
      const list = invalidTimezones.map((tz) => `  - ${tz}`).join('\n');
      throw new Error(
        `Timezone validation failed: ${invalidTimezones.length} bundled ${label} not found in moment-timezone latest data:\n${list}`,
      );
    }

    logger.info(
      `All ${bundledTimezones.length} bundled timezones are valid according to moment-timezone data`,
    );
  },
});
