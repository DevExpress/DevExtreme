import type { MockHandler } from '../types';
import nodes from '../fixtures/treeViewData.json';

// GET /api/TreeViewData?parentId=<node id>
// The TreeView loads one level per request, so the fixture maps a parent id to
// its children; the root is requested with an empty parentId. The service lists
// the demo server's own file system, which drifts on its own.

const requestedParentId = (url: string): string => {
  const match = url.match(/[?&]parentId=([^&]*)/);

  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
};

export const treeViewDataHandler: MockHandler = {
  matches: (req) => /\/api\/TreeViewData(?:\?|$)/i.test(req.url),
  respond: (req) => nodes[requestedParentId(req.url)] ?? [],
};
