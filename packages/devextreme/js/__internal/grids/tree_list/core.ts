import { extend } from '@js/core/utils/extend';
import modules from '@ts/grids/grid_core/m_modules';

export default extend({}, modules, {
  modules: [],

  foreachNodes(nodes, callBack, ignoreHasChildren) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of -- callBack may mutate nodes
    for (let i = 0; i < nodes.length; i += 1) {
      if (callBack(nodes[i]) !== false && (ignoreHasChildren || nodes[i].hasChildren)
        && nodes[i].children.length) {
        this.foreachNodes(nodes[i].children, callBack, ignoreHasChildren);
      }
    }
  },
});
