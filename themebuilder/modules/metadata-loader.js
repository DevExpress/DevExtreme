const semver = require("semver");

class MetadataLoader {
    constructor() {
        this.fullMetadata = require("../data/metadata/dx-theme-builder-metadata");
        this.migrationMetadata = require("../data/migration-metadata/migration-metadata");
    }

    load(theme, colorScheme) {
        return new Promise((resolve) => {
            let metadata = this.fullMetadata[theme + "_" + colorScheme.replace("-", "_") + "_metadata"];

            if(semver.gte(this.version(), "18.2.8") && this.migrationMetadata[theme]) {
                for(let i = 0; i < this.migrationMetadata[theme].length; i++) {
                    metadata.push(
                        { "Key": this.migrationMetadata[theme][i] }
                    );
                }
            }

            resolve(metadata);
        });
    }

    version() {
        return this.fullMetadata["_metadata_version"];
    }
}

module.exports = MetadataLoader;
