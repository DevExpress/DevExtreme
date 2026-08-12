import type { MockHandler } from '../types';
import { numberParam, skipOf } from '../utils';
import groups from '../fixtures/listData.json';

// GET /api/ListData?skip=&take=&sort=&group=&filter=
// The fixture was recorded with the sort/group/filter the demo always sends,
// so the handler only has to page over the recorded groups.

export const listDataHandler: MockHandler = {
  matches: (req) => /\/api\/ListData\b/i.test(req.url),
  respond: (req) => {
    const skip = skipOf(req.url);
    const take = numberParam(req.url, 'take', groups.length);

    return {
      data: groups.slice(skip, skip + take),
      totalCount: -1,
      groupCount: -1,
    };
  },
};
