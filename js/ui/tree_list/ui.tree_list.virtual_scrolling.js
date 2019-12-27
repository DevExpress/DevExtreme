import gridCore from './ui.tree_list.core';
import dataSourceAdapter from './ui.tree_list.data_source_adapter';
import virtualScrollingModule from '../grid_core/ui.grid_core.virtual_scrolling';
import { extend } from '../../core/utils/extend';

const oldDefaultOptions = virtualScrollingModule.defaultOptions;
const originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data;
const originalDataSourceAdapterExtender = virtualScrollingModule.extenders.dataSourceAdapter;

virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
    _loadOnOptionChange: function() {
        const virtualScrollController = this._dataSource && this._dataSource._virtualScrollController;

        virtualScrollController && virtualScrollController.reset();
        this.callBase();
    }
});

virtualScrollingModule.extenders.dataSourceAdapter = extend({}, originalDataSourceAdapterExtender, {
    changeRowExpand: function() {
        return this.callBase.apply(this, arguments).done(() => {
            const viewportItemIndex = this.getViewportItemIndex();

            viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
        });
    }
});

gridCore.registerModule('virtualScrolling', extend({}, virtualScrollingModule, {
    defaultOptions: function() {
        return extend(true, oldDefaultOptions(), {
            scrolling: {
                mode: 'virtual'
            }
        });
    }
}));

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
