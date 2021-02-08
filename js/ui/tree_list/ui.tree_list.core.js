import { extend } from '../../core/utils/extend';
import modules from '../grid_core/ui.grid_core.modules';

extend(exports, modules, {
    modules: [],

    foreachNodes: function(nodes, callBack, ignoreHasChildren) {
        for(let i = 0; i < nodes.length; i++) {
            if(callBack(nodes[i]) !== false && (ignoreHasChildren || nodes[i].hasChildren) && nodes[i].children.length) {
                this.foreachNodes(nodes[i].children, callBack, ignoreHasChildren);
            }
        }
    }
});

