import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@nx/devkit';
import executor from './executor';
import { LicenseCheckExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText } from '../../utils';

const TEST_NOTICE = `/* !
 * synthetic-lib.js - Library for verifying the license-check executor.
 * https://example.com/synthetic-lib
 *
 * Copyright 2026, Synthetic Author
 * Licensed under the Test license.
 * https://example.com/synthetic-lib/LICENSE
 *
 */
`;

const TEST_LICENSE: LicenseCheckExecutorSchema['licenses'][number] = {
  name: 'synthetic-lib.js - Library for verifying the license-check executor.',
  homepageUrl: 'https://example.com/synthetic-lib',
  copyright: 'Copyright 2026, Synthetic Author',
  licenseType: 'Licensed under the Test license.',
  licenseUrl: 'https://example.com/synthetic-lib/LICENSE',
};

describe('LicenseCheckExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    tempDir = createTempDir('nx-license-check-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });
    errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    errorSpy.mockRestore();
    cleanupTempDir(tempDir);
  });

  it('should succeed when configured license notices are present in the bundle', async () => {
    const filePath = path.join(projectDir, 'bundle.js');
    await writeFileText(filePath, `// prologue\n${TEST_NOTICE}// epilogue\n`);

    const result = await executor({ files: ['./bundle.js'], licenses: [TEST_LICENSE] }, context);

    expect(result.success).toBe(true);
  });

  it('should fail and report the missing license name when a notice is absent', async () => {
    const filePath = path.join(projectDir, 'bundle.js');
    await writeFileText(filePath, '// no notice here\n');

    const result = await executor({ files: ['./bundle.js'], licenses: [TEST_LICENSE] }, context);

    expect(result.success).toBe(false);
    const reportedMessage = String(errorSpy.mock.calls[0][0]);
    expect(reportedMessage).toContain(TEST_LICENSE.name);
    expect(reportedMessage).toContain('bundle.js');
  });

  it('should aggregate misses across multiple files and only list failing files', async () => {
    const passingPath = path.join(projectDir, 'bundle-a.js');
    const failingPath = path.join(projectDir, 'bundle-b.js');
    await writeFileText(passingPath, `${TEST_NOTICE}`);
    await writeFileText(failingPath, '// missing notice\n');

    const result = await executor(
      { files: ['./bundle-a.js', './bundle-b.js'], licenses: [TEST_LICENSE] },
      context,
    );

    expect(result.success).toBe(false);
    const reportedMessage = String(errorSpy.mock.calls[0][0]);
    expect(reportedMessage).toContain('bundle-b.js');
    expect(reportedMessage).not.toContain('bundle-a.js');
  });
});
