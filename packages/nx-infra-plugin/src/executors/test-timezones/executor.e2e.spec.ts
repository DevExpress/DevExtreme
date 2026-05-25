import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@nx/devkit';
import executor from './executor';
import { TestTimezonesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText } from '../../utils';
import { extractTimezoneList, validateTimezoneList } from './test-timezones.impl';

const VALID_TIMEZONE_LIST_CONTENT = `export default {
  value: [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
  ],
};
`;

const INVALID_TIMEZONE_LIST_CONTENT = `export default {
  value: [
    'America/New_York',
    'Invalid/Timezone',
    'Europe/London',
    'Fake/Zone',
  ],
};
`;

const MOCK_MOMENT_DATA = {
  version: '2024a',
  zones: [
    { name: 'America/New_York', abbrs: ['EST', 'EDT'], untils: [null], offsets: [-300, -240] },
    { name: 'America/Los_Angeles', abbrs: ['PST', 'PDT'], untils: [null], offsets: [-480, -420] },
    { name: 'Europe/London', abbrs: ['GMT', 'BST'], untils: [null], offsets: [0, -60] },
    { name: 'Asia/Tokyo', abbrs: ['JST'], untils: [null], offsets: [-540] },
  ],
  links: ['US/Eastern|America/New_York', 'US/Pacific|America/Los_Angeles'],
};

describe('TestTimezonesExecutor', () => {
  describe('extractTimezoneList', () => {
    it('should parse timezone names from TypeScript export', () => {
      const result = extractTimezoneList(VALID_TIMEZONE_LIST_CONTENT);

      expect(result).toEqual([
        'America/New_York',
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Tokyo',
      ]);
    });

    it('should ignore commented-out timezone entries', () => {
      const contentWithComments = `export default {
  value: [
    'America/New_York',
    // Not supported in CI tests
    // 'US/Pacific-New',
    'US/Pacific',
  ],
};
`;
      const result = extractTimezoneList(contentWithComments);

      expect(result).toEqual(['America/New_York', 'US/Pacific']);
    });

    it('should throw when file does not match expected pattern', () => {
      expect(() => extractTimezoneList('const x = 42;')).toThrow('Could not parse timezone list');
    });
  });

  describe('validateTimezoneList', () => {
    it('should return empty array when all timezones are valid', () => {
      const bundledTimezones = [
        'America/New_York',
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Tokyo',
      ];

      const result = validateTimezoneList(bundledTimezones, MOCK_MOMENT_DATA as any);

      expect(result).toEqual([]);
    });

    it('should return invalid timezones not found in moment data', () => {
      const bundledTimezones = ['America/New_York', 'Invalid/Timezone', 'Fake/Zone'];

      const result = validateTimezoneList(bundledTimezones, MOCK_MOMENT_DATA as any);

      expect(result).toEqual(['Invalid/Timezone', 'Fake/Zone']);
    });

    it('should recognize timezone link aliases as valid', () => {
      const bundledTimezones = ['US/Eastern', 'US/Pacific'];

      const result = validateTimezoneList(bundledTimezones, MOCK_MOMENT_DATA as any);

      expect(result).toEqual([]);
    });
  });

  describe('E2E', () => {
    let tempDir: string;
    let context: ReturnType<typeof createMockContext>;
    let projectDir: string;
    let errorSpy: jest.SpyInstance;
    let mockServer: { close: () => void } | null = null;

    beforeEach(() => {
      tempDir = createTempDir('nx-test-timezones-e2e-');
      context = createMockContext({ root: tempDir });
      projectDir = path.join(tempDir, 'packages', 'test-lib');
      fs.mkdirSync(projectDir, { recursive: true });
      errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
      errorSpy.mockRestore();
      cleanupTempDir(tempDir);
      if (mockServer) {
        mockServer.close();
        mockServer = null;
      }
    });

    it('should succeed when all bundled timezones exist in fetched data', async () => {
      const timezoneFile = path.join(projectDir, 'timezone_list.ts');
      await writeFileText(timezoneFile, VALID_TIMEZONE_LIST_CONTENT);

      // Start a local HTTP server to serve mock data
      const http = await import('http');
      const server = http.createServer((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(MOCK_MOMENT_DATA));
      });

      await new Promise<void>((resolve) => {
        server.listen(0, '127.0.0.1', resolve);
      });
      const address = server.address() as { port: number };
      mockServer = server;

      const options: TestTimezonesExecutorSchema = {
        timezoneListFile: './timezone_list.ts',
        momentTimezoneUrl: `http://127.0.0.1:${address.port}/latest.json`,
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);
    });

    it('should fail when bundled timezones are not found in fetched data', async () => {
      const timezoneFile = path.join(projectDir, 'timezone_list.ts');
      await writeFileText(timezoneFile, INVALID_TIMEZONE_LIST_CONTENT);

      const http = await import('http');
      const server = http.createServer((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(MOCK_MOMENT_DATA));
      });

      await new Promise<void>((resolve) => {
        server.listen(0, '127.0.0.1', resolve);
      });
      const address = server.address() as { port: number };
      mockServer = server;

      const options: TestTimezonesExecutorSchema = {
        timezoneListFile: './timezone_list.ts',
        momentTimezoneUrl: `http://127.0.0.1:${address.port}/latest.json`,
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
      const errorMessage = String(errorSpy.mock.calls[0][0]);
      expect(errorMessage).toContain('Invalid/Timezone');
      expect(errorMessage).toContain('Fake/Zone');
    });

    it('should fail when timezone list file does not exist', async () => {
      const options: TestTimezonesExecutorSchema = {
        timezoneListFile: './nonexistent.ts',
        momentTimezoneUrl: 'http://127.0.0.1:1/unused',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });

    it('should fail when remote URL is unreachable', async () => {
      const timezoneFile = path.join(projectDir, 'timezone_list.ts');
      await writeFileText(timezoneFile, VALID_TIMEZONE_LIST_CONTENT);

      const options: TestTimezonesExecutorSchema = {
        timezoneListFile: './timezone_list.ts',
        momentTimezoneUrl: 'http://127.0.0.1:1/nonexistent',
      };

      const result = await executor(options, context);

      expect(result.success).toBe(false);
    });
  });
});
