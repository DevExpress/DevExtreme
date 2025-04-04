import { extend } from '@ts/core/utils/m_extend';
import { isPlainObject } from '@ts/core/utils/m_type';

export const shallowCopyTree = <T extends Record<string, unknown> | unknown[]>(
  tree: T,
): T => (Array.isArray(tree)
    ? [...tree] as T
    : { ...tree });

export const getSubTree = <T extends Record<string, unknown> | unknown[]>(
  tree: T,
  path: string[],
): T | undefined => {
  let currentNode = tree;

  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const nextNodePath = path[idx];
    currentNode = currentNode[nextNodePath];
  }

  return currentNode;
};

export const getTreeLeaf = <T extends Record<string, unknown> | unknown[]>(
  tree: T,
  path: string[],
): unknown | undefined => {
  const [lastNodePath] = path.slice(-1);
  const subtree = getSubTree(tree, path);

  return subtree?.[lastNodePath];
};

export const deepCopyTreeLeaf = <T extends Record<string, unknown> | unknown[]>(
  tree: T,
  path: string[],
): unknown | undefined => {
  const leaf = getTreeLeaf(tree, path);

  return isPlainObject(leaf)
    ? extend(true, {}, leaf)
    : leaf;
};

export const shallowCopySubtreePath = <T extends Record<string, unknown> | unknown[]>(
  tree: T,
  path: string[],
): T => {
  const shallowCopiedTree = shallowCopyTree(tree);
  let currentNode = shallowCopiedTree;

  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const nextNodePath = path[idx];
    const nextNode = currentNode[nextNodePath] as T;

    currentNode[nextNodePath] = shallowCopyTree(nextNode);
    currentNode = nextNode;
  }

  return shallowCopiedTree;
};

export const mergeOptionTrees = <T extends Record<string, unknown> | unknown[]>(
  internalTree: T,
  publicTree: T,
  defaultTree: T,
  pathToMerge: string[],
): T => {
  const [lastNodePath] = pathToMerge.slice(-1);
  const result = shallowCopySubtreePath(internalTree, pathToMerge);
  const targetSubtree = getSubTree(result, pathToMerge);
  const updatedValue = deepCopyTreeLeaf(publicTree, pathToMerge);
  const defaultValue = deepCopyTreeLeaf(defaultTree, pathToMerge);

  if (targetSubtree) {
    /*
      NOTE: it is better not to use '??' operator,
      because result will be different if value is 'null'.
      Some code works differently if undefined is passed instead of null,
      for example dataSource's getter-setter `.filter()`
    */
    targetSubtree[lastNodePath] = updatedValue !== undefined
      ? updatedValue
      : defaultValue;
  }

  return result;
};
