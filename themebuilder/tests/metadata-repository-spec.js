const mock = require("mock-require");
const assert = require("chai").assert;
const MetadataLoader = require("../modules/metadata-loader");
const MetadataRepository = require("../modules/metadata-repository");
const themes = require("./test-themes");
const metadata = require("./test-metadata");

let expectedLightMetadata = {
    "base.common": [
        {
            "Name": "50. Background color",
            "Key": "@base-bg",
            "Group": "base.common",
        }
    ],
    "base.typography": [
        {
            "Name": "1. Font family",
            "Key": "@base-font-family",
            "Group": "base.typography",
        }
    ]
};

let expectedLightMetadataAfterUpdate = {
    "base.common": [
        {
            "Name": "50. Background color",
            "Key": "@base-bg",
            "Group": "base.common",
            "Value": "#fff"
        }
    ],
    "base.typography": [
        {
            "Name": "1. Font family",
            "Key": "@base-font-family",
            "Group": "base.typography",
        }
    ]
};

describe("MetadataRepository", () => {
    beforeEach(() => {
        mock("../data/metadata/dx-theme-builder-metadata", metadata);
    });
    it("Init", () => {
        let metadataRepository = new MetadataRepository(new MetadataLoader());
        return metadataRepository.init(themes).then(() => {
            let genericLightMetadata = metadataRepository.getData({
                name: "generic",
                colorScheme: "light"
            });

            assert.deepEqual(genericLightMetadata, expectedLightMetadata, "right metadata for theme");

            metadataRepository.updateData([
                { key: "@base-bg", value: "#fff" }
            ], {
                name: "generic",
                colorScheme: "light"
            });

            genericLightMetadata = metadataRepository.getData({
                name: "generic",
                colorScheme: "light"
            });

            assert.deepEqual(genericLightMetadata, expectedLightMetadataAfterUpdate, "right metadata for theme");
        });
    });

    it("Version", () => {
        let metadataRepository = new MetadataRepository(new MetadataLoader());
        assert.equal(metadataRepository.getVersion(), "18.2.0");
    });

});
