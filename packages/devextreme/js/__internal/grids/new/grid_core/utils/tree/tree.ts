import { extend } from '@ts/core/utils/m_extend';
import { isPlainObject } from '@ts/core/utils/m_type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TreeNodeChild = any;
type TreeNodeType = Record<string, TreeNodeChild> | TreeNodeChild[] | TreeNodeChild;

export const shallowCopyTree = (
  tree: TreeNodeType | undefined,
): TreeNodeType => {
  if (isPlainObject(tree)) {
    return { ...tree };
  } if (Array.isArray(tree)) {
    return [...tree];
  }

  return tree;
};

// NOTE: Maybe we can use "structuredClone" build-in function here
// instead of this custom function
export const deepCopyTreeNode = (
  treeNode: TreeNodeType,
): TreeNodeType => {
  switch (true) {
    case isPlainObject(treeNode):
      return extend(true, {}, treeNode);
    case Array.isArray(treeNode):
      return extend(true, [], treeNode);
    default:
      return treeNode;
  }
};

export const deepMergeTrees = (
  firstTree: TreeNodeType | undefined,
  secondTree: TreeNodeType | undefined,
): TreeNodeType | undefined => {
  if (isPlainObject(secondTree) && isPlainObject(firstTree)) {
    return extend(true, {}, firstTree, secondTree);
  }

  if (secondTree !== undefined) {
    return deepCopyTreeNode(secondTree);
  }

  return deepCopyTreeNode(firstTree);
};

export const getTreeNodeParentByPath = (
  tree: TreeNodeType,
  path: string[],
): TreeNodeType | undefined => {
  let currentNode = tree;

  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const nextNodePath = path[idx];
    currentNode = currentNode[nextNodePath];

    if (currentNode === undefined) {
      return undefined;
    }
  }

  return currentNode;
};

export const getTreeNodeByPath = (
  tree: TreeNodeType,
  path: string[],
): TreeNodeType => {
  const [lastNodePath] = path.slice(-1);
  const subtree = getTreeNodeParentByPath(tree, path);

  return subtree?.[lastNodePath];
};

export const shallowCopySubtreePath = (
  tree: TreeNodeType,
  path: string[],
): TreeNodeType => {
  const shallowCopiedTree = shallowCopyTree(tree);
  let currentNode = shallowCopiedTree;

  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const nextNodePath = path[idx];
    const nextNode = currentNode?.[nextNodePath];

    if (nextNode === undefined) {
      break;
    }

    currentNode[nextNodePath] = shallowCopyTree(nextNode);
    currentNode = nextNode;
  }

  return shallowCopiedTree;
};

export const createOrShallowCopySubtreePath = (
  tree: TreeNodeType,
  path: string[],
): TreeNodeType => {
  const shallowCopiedTree = shallowCopyTree(tree);
  let currentNode = shallowCopiedTree;

  for (let idx = 0; idx < path.length; idx += 1) {
    const isLastPath = idx === path.length - 1;
    const nextNodePath = path[idx];

    if (currentNode[nextNodePath] === undefined) {
      currentNode[nextNodePath] = !isLastPath
        ? {}
        : undefined;
    } else {
      currentNode[nextNodePath] = shallowCopyTree(currentNode[nextNodePath]);
    }

    currentNode = currentNode[nextNodePath];
  }

  return shallowCopiedTree;
};

export const mergeOptionTrees = (
  internalTree: TreeNodeType,
  publicTree: TreeNodeType,
  defaultTree: TreeNodeType,
  pathToMerge: string[],
): TreeNodeType => {
  const [lastNodePath] = pathToMerge.slice(-1);
  const result = createOrShallowCopySubtreePath(internalTree, pathToMerge);
  const targetNodeParent = getTreeNodeParentByPath(result, pathToMerge);

  const newNodeValue = getTreeNodeByPath(publicTree, pathToMerge);
  const defaultNodeValue = getTreeNodeByPath(defaultTree, pathToMerge);

  targetNodeParent[lastNodePath] = deepMergeTrees(defaultNodeValue, newNodeValue);

  return result;
};

export const setTreeNodeByPath = (
  tree: TreeNodeType,
  node: TreeNodeType,
  path: string[],
): TreeNodeType => {
  const [lastNodePath] = path.slice(-1);
  const shallowCopiedTree = createOrShallowCopySubtreePath(tree, path);
  const subtree = getTreeNodeParentByPath(shallowCopiedTree, path);

  subtree[lastNodePath] = node;
  return shallowCopiedTree;
};
