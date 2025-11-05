/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line max-classes-per-file
export class GanttTreeListNodeState {
  collapsed: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parentKey: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parent?: any;

  constructor(treeListNode: GanttTreeListNodeState) {
    this.collapsed = false;
    this.key = treeListNode.key;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.children = treeListNode.children.map((node) => node.key);
    this.parentKey = treeListNode.parent?.key;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  removeChild(state): void {
    const index = this.children.indexOf(state.key);
    if (index > -1) {
      this.children = this.children.splice(index, 1);
    }
  }

  equal(state): boolean {
    if (
      !state
      || state.key !== this.key
      || state.parentKey !== this.parentKey
    ) {
      return false;
    }
    if (
      this.children.length !== state.children.length
      || this.children.some((value, index): boolean => value !== state.children[index])
    ) {
      return false;
    }
    return true;
  }
}

export class GanttTreeListNodesState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _rootValue?: any;

  _hasCollapsed?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _nodeHash?: any;

  constructor() {
    this._resetHash();
  }

  clear(): void {
    this._resetHash();
  }

  applyNodes(nodes, rootValue): void {
    if (this._rootValue !== rootValue) {
      this._resetHash();
      this._rootValue = rootValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this._removeNonExistentNodes(nodes.map((node) => node.key));
    nodes.forEach((node) => this._applyNode(node));
    this._validateHash();
  }

  saveExpandedState(expandedKeys): void {
    this._hasCollapsed = false;
    this._forEachState((state): void => {
      if (state.hasChildren() && !expandedKeys.includes(state.key)) {
        state.collapsed = true;
        this._hasCollapsed = true;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getExpandedKeys() {
    if (this._hasCollapsed) {
      const keys = [];
      this._forEachState((state) => {
        if (state.hasChildren() && !state.collapsed) {
          // @ts-expect-error ts-error
          keys.push(state.key);
        }
      });
      return keys;
    }
    return null;
  }

  _resetHash(): void {
    this._nodeHash = {};
    this._hasCollapsed = false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getNodeState(key) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._nodeHash[key];
  }

  _removeNonExistentNodes(existingKeys): void {
    if (existingKeys) {
      this._forEachState((state) => {
        if (!existingKeys.includes(state.key)) {
          this._removeStateWithChildren(state);
        }
      });
    }
  }

  _removeStateWithChildren(key): void {
    const state = this._getNodeState(key);
    if (state) {
      state.children.forEach((child) => this._removeStateWithChildren(child));
      const parent = this._getNodeState(state.parentKey);
      if (parent) {
        parent.removeChild(state);
      }
      delete this._nodeHash?.[key];
    }
  }

  _applyNode(node): void {
    const nodeState = new GanttTreeListNodeState(node);
    const oldState = this._getNodeState(node.key);
    if (!oldState?.equal(nodeState)) {
      this._nodeHash[node.key] = nodeState;
      this._expandTreelineToNode(node.key);
    }
  }

  _expandTreelineToNode(key): void {
    const state = this._getNodeState(key);
    let parent = this._getNodeState(state?.parentKey);
    while (parent) {
      parent.collapsed = false;
      parent = this._getNodeState(parent.parentKey);
    }
  }

  _validateHash(): void {
    Object.keys(this._nodeHash).forEach((key): void => {
      const state = this._getNodeState(key);
      const parentKey = state?.parentKey;
      if (parentKey !== this._rootValue && !this._getNodeState(parentKey)) {
        this._removeStateWithChildren(key);
      }
    });
  }

  _forEachState(callback: Function): void {
    Object.keys(this._nodeHash).forEach((key): void => {
      const state = this._nodeHash?.[key];
      if (state) {
        callback(state);
      }
    });
  }
}
