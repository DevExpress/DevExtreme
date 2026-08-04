import type { MockHandler } from '../types';
import nodes from '../fixtures/treeViewPlainData.json';

// GET /api/TreeViewPlainData?filter=["CategoryId",<parent id or null>]
// The TreeView loads one level per request, so the handler returns the children
// of the requested parent out of the flat fixture.

const requestedCategoryId = (url: string): string | null => {
  const match = url.match(/[?&]filter=([^&]*)/);
  if (!match) {
    return null;
  }
  const [, categoryId] = JSON.parse(decodeURIComponent(match[1]));
  return categoryId;
};

export const treeViewPlainDataHandler: MockHandler = {
  matches: (req) => /\/api\/TreeViewPlainData\b/i.test(req.url),
  respond: (req) => {
    const categoryId = requestedCategoryId(req.url);

    return {
      data: nodes.filter((node) => node.CategoryId === categoryId),
      totalCount: -1,
      groupCount: -1,
    };
  },
};
