var MetadataRepository = function(metadataLoader) {
    var repositoryData = {};

    var findDataItemInGroupItems = function(key, items) {
        var result = null;
        items.forEach(function(item) {
            if(item.Key === key) {
                result = item;
                return false;
            }
        });

        return result;
    };

    var getDataItemByKey = function(key, theme) {
        var result = null;
        var themeData = repositoryData[theme.name + "-" + theme.colorScheme];

        for(var theme in themeData) {
            if(themeData.hasOwnProperty(theme)) {
                var groups = themeData[theme];
                result = findDataItemInGroupItems(key, groups);
                if(result) break;
            }
        }

        return result;
    };

    this.init = function(themes) {
        var promises = [];

        themes.forEach(function(theme) {
            promises.push(new Promise(function(resolve, reject) {
                metadataLoader
                    .load(theme.name, theme.colorScheme)
                    .then(function(metadata) {
                        repositoryData[theme.name + "-" + theme.colorScheme] = metadata;
                        resolve();
                    });
            }));
        });

        return Promise.all(promises);
    };

    this.getData = function(theme) {
        if(!theme) return repositoryData;
        return repositoryData[theme.name + "-" + theme.colorScheme];
    };

    this.updateData = function(data, theme) {
        data.forEach(function(item) {
            var dataItem = getDataItemByKey(item.key, theme);
            if(item) dataItem.Value = item.value;
        });
    };
};

module.exports = MetadataRepository;
