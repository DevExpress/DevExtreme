import gridCore from "./ui.tree_list.core";
import columnFixingModule from "../grid_core/ui.grid_core.row_dragging";
import { extend } from '../../core/utils/extend';

var oldDefaultOptions = columnFixingModule.defaultOptions;

gridCore.registerModule("rowDragging", extend({}, columnFixingModule, {
    defaultOptions: function() {
        return extend(true, oldDefaultOptions.apply(this, arguments), {
            rowDragging: {
                /**
                 * @name dxTreeListOptions.rowDragging.allowDropInsideItem
                 * @type boolean
                 * @default true
                 */
                allowDropInsideItem: true
            }
        });
    }
}));
