import {
  beforeEach, describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('LegacyForm', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  it('should be false by default', async () => {
    const { scheduler } = await createScheduler({ });

    // @ts-expect-error private option
    expect(scheduler.option('editing').legacyForm).toBe(false);
  });

  it('should be true when explicitly set', async () => {
    const { scheduler } = await createScheduler({ editing: { legacyForm: true } });

    // @ts-expect-error private option
    expect(scheduler.option('editing').legacyForm).toBe(true);
  });

  it('should be changed by option()', async () => {
    const { scheduler } = await createScheduler({});

    scheduler.option('editing', { legacyForm: true });

    // @ts-expect-error private option
    expect(scheduler.option('editing').legacyForm).toBe(true);
  });
});
