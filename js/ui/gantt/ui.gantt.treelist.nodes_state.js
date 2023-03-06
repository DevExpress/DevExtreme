export class GanttTreeListNodeState {
    constructor(treeListNode) {
        this.collapsed = false;
        this.key = treeListNode.key;
        this.children = treeListNode.children.map(node => node.key);
        this.parentKey = treeListNode.parent?.key;
    }
    hasChildren() {
        return this.children.length > 0;
    }
    removeChild(state) {
        const index = this.children.indexOf(state.key);
        if(index > -1) {
            this.children = this.children.splice(index, 1);
        }
    }
    equal(state) {
        if(!state || state.key !== this.key || state.parentKey !== this.parentKey) {
            return false;
        }
        if(this.children.length !== state.children.length || this.children.some((value, index) => value !== state.children[index])) {
            return false;
        }
        return true;
    }
}

export class GanttTreeListNodesState {
    constructor() {
        this._resetHash();
    }
    clear() {
        this._resetHash();
    }
    applyNodes(nodes, rootValue) {
        if(this._rootValue !== rootValue) {
            this._resetHash();
            this._rootValue = rootValue;
        }

        this._removeNonExistentNodes(nodes.map(node => node.key));
        nodes.forEach(node => this._applyNode(node));
        this._validateHash();
    }
    saveExpandedState(expandedKeys) {
        this._hasCollapsed = false;
        this._forEachState(state => {
            if(state.hasChildren() && !expandedKeys.includes(state.key)) {
                state.collapsed = true;
                this._hasCollapsed = true;
            }
        });
    }
    getExpandedKeys() {
        if(this._hasCollapsed) {
            const keys = [];
            this._forEachState((state) => {
                if(state.hasChildren() && !state.collapsed) {
                    keys.push(state.key);
                }
            });
            return keys;
        }
        return null;
    }
    _resetHash() {
        this._nodeHash = { };
        this._hasCollapsed = false;
    }
    _getNodeState(key) {
        return this._nodeHash[key];
    }
    _removeNonExistentNodes(existingKeys) {
        if(existingKeys) {
            this._forEachState(state => {
                if(!existingKeys.includes(state.key)) {
                    this._removeStateWithChildren(state);
                }
            });
        }
    }
    _removeStateWithChildren(key) {
        const state = this._getNodeState(key);
        if(state) {
            state.children.forEach(child => this._removeStateWithChildren(child));
            const parent = this._getNodeState(state.parentKey);
            if(parent) {
                parent.removeChild(state);
            }
            delete this._nodeHash[key];
        }
    }
    _applyNode(node) {
        const nodeState = new GanttTreeListNodeState(node);
        const oldState = this._getNodeState(node.key);
        if(!oldState?.equal(nodeState)) {
            this._nodeHash[node.key] = nodeState;
            this._expandTreelineToNode(node.key);
        }
    }
    _expandTreelineToNode(key) {
        const state = this._getNodeState(key);
        let parent = this._getNodeState(state?.parentKey);
        while(parent) {
            parent.collapsed = false;
            parent = this._getNodeState(parent.parentKey);
        }
    }
    _validateHash() {
        Object.keys(this._nodeHash).forEach(key => {
            const state = this._getNodeState(key);
            const parentKey = state?.parentKey;
            if(parentKey !== this._rootValue && !this._getNodeState(parentKey)) {
                this._removeStateWithChildren(key);
            }
        });
    }
    _forEachState(callback) {
        Object.keys(this._nodeHash).forEach(key => {
            const state = this._nodeHash[key];
            if(state) {
                callback(state);
            }
        });
    }
}
