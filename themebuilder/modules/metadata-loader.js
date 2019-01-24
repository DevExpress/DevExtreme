class MetadataLoader {
    constructor() {
        this.fullMetadata = require("../data/metadata/dx-theme-builder-metadata");
    }

    load(theme, colorScheme) {
        return new Promise((resolve) => {
            let metadata = this.fullMetadata[theme + "_" + colorScheme.replace("-", "_") + "_metadata"];
            resolve(metadata);
        });
    }

    version() {
        return this.fullMetadata["_metadata_version"];
    }
}

module.exports = MetadataLoader;
