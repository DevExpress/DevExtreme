import type { MockHandler } from '../types';
import { param } from '../utils';
import treeListData from '../fixtures/treeListData.json';

const nodes = treeListData as { parentId: string }[];
const requestedParentIds = (url: string): string[] => (param(url, 'parentIds') ?? '').split(',');

export const treeListDataHandler: MockHandler = {
  matches: (req) => /\/api\/treeListData(?:\?|$)/i.test(req.url),
  respond: (req) => {
    const parentIds = requestedParentIds(req.url);

    return nodes.filter((node) => parentIds.includes(node.parentId));
  },
};
