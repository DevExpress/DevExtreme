function isChildNode(node: Node): node is ChildNode {
  return typeof (node as Partial<ChildNode>).remove === 'function';
}

function revertMutation({ type, addedNodes }: MutationRecord): void {
  switch (type) {
    case 'childList':
      addedNodes.forEach((n) => isChildNode(n) && n.remove());
      break;
    default:
      break;
  }
}

export function recordMutations(target: Node, func: () => unknown): () => void {
  const observer = new MutationObserver(() => {});
  // eslint-disable-next-line spellcheck/spell-checker
  observer.observe(target, { childList: true, subtree: false });

  func();

  const mutations = observer.takeRecords();
  observer.disconnect();

  return () => mutations.forEach(revertMutation);
}
