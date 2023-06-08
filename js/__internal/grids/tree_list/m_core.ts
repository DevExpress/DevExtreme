import { extend } from '@js/core/utils/extend';
import modules from '@js/ui/grid_core/ui.grid_core.modules';

export default extend({}, modules, {
  modules: [],

  foreachNodes(nodes, callBack, ignoreHasChildren) {
    for (let i = 0; i < nodes.length; i++) {
      if (callBack(nodes[i]) !== false && (ignoreHasChildren || nodes[i].hasChildren) && nodes[i].children.length) {
        this.foreachNodes(nodes[i].children, callBack, ignoreHasChildren);
      }
    }
  },
});
