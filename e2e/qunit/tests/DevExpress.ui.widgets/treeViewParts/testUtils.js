import $ from 'jquery';
import CustomStore from 'data/custom_store';
import ArrayStore from 'data/array_store';

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
