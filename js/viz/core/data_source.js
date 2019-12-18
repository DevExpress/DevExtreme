var noop = require('../../core/utils/common').noop,
    DataHelperMixin = require('../../data_helper'),
    postCtor = DataHelperMixin.postCtor,
    name,
    members = {
        _dataSourceLoadErrorHandler: function() {
            this._dataSourceChangedHandler();
        },

        _dataSourceOptions: function() {
            return { paginate: false };
        },

        _updateDataSource: function() {
            this._refreshDataSource();
            if(!this.option('dataSource')) {
                this._dataSourceChangedHandler();
            }
        },

        _dataIsLoaded: function() {
            return !this._dataSource || this._dataSource.isLoaded();
        },

        _dataSourceItems: function() {
            return this._dataSource && this._dataSource.items();
        }
    };

for(name in DataHelperMixin) {
    if(name === 'postCtor') {
        continue;
    }

    members[name] = DataHelperMixin[name];
}

exports.plugin = {
    name: 'data_source',
    init: function() {
        postCtor.call(this);
    },
    dispose: noop,
    members: members
};
