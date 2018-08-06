var fullMetadata = require("../data/metadata/dx-theme-builder-metadata");

var MetadataLoader = function() {
    this.groupMetadata = function(metadata) {
        var groups = {};
        metadata.forEach(function(item) {
            if(!groups[item.Group]) {
                groups[item.Group] = [];
            }

            groups[item.Group].push(item);
        });

        return groups;
    };

    this.load = function(theme, colorScheme) {
        var that = this;
        return new Promise(function(resolve, reject) {
            var metadata = fullMetadata[theme + "_" + colorScheme.replace("-", "_") + "_metadata"];
            resolve(that.groupMetadata(metadata));
        });
    };
};

module.exports = MetadataLoader;
