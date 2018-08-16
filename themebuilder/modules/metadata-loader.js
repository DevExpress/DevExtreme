class MetadataLoader {
    constructor() {
        this.fullMetadata = require("../data/metadata/dx-theme-builder-metadata");
    }

    groupMetadata(metadata) {
        let groups = {};
        metadata.forEach(item => {
            if(!groups[item.Group]) {
                groups[item.Group] = [];
            }

            groups[item.Group].push(item);
        });

        return groups;
    };

    load(theme, colorScheme) {
        let that = this;
        return new Promise((resolve) => {
            let metadata = this.fullMetadata[theme + "_" + colorScheme.replace("-", "_") + "_metadata"];
            resolve(that.groupMetadata(metadata));
        });
    };

    version() {
        return this.fullMetadata["_metadata_version"];
    };
};

module.exports = MetadataLoader;
