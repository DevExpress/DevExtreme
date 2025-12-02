import $ from 'jquery';
import { CustomStore } from 'common/data/custom_store';
import ArrayStore from 'common/data/array_store';
import { isFunction } from 'core/utils/type';

export const initTree = (options) => {
    return $('#treeView').dxTreeView(options);
};

export const stripFunctions = (obj) => {
    const result = $.extend(true, {}, obj);
    $.each(result, function(field, value) {
        if(isFunction(value)) {
            delete result[field];
        }

        if(field === 'parent' && result.parent) {
            result.parent = stripFunctions(result.parent);
        }

    });

    return result;
};

export const makeSlowDataSource = (data) => {
    return {
        store: new CustomStore({
            load: function(loadOptions) {
                return $.Deferred(function(d) {
                    setTimeout(function() {
                        new ArrayStore(data).load(loadOptions).done(function() {
                            d.resolve.apply(d, arguments);
                        });
                    }, 300);
                }).promise();
            }
        })
    };
};
