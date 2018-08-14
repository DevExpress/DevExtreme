const mock = require("mock-require");
const assert = require("chai").assert;
const MetadataLoader = require("../modules/metadata-loader");
const metadata = require("./test-metadata");

let expectedGroupedLightMetadata = {
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

let expectedGroupedDarkMetadata = {
    "base.typography": [
        {
            "Name": "2. Font family",
            "Key": "@base-font-family",
            "Group": "base.typography",
        }
    ],
    "base.common": [
        {
            "Name": "51. Background color",
            "Key": "@base-bg",
            "Group": "base.common",
        }
    ]
};

describe("MetadataLoader", () => {
    beforeEach(() => {
        mock("../data/metadata/dx-theme-builder-metadata", metadata);
    });
    it("Group metadata", () => {
        let metadataLoader = new MetadataLoader();
        let groupedMetadata = metadataLoader.groupMetadata(metadata["generic_light_metadata"]);
        assert.deepEqual(groupedMetadata, expectedGroupedLightMetadata, "group function works");
    });

    it("Load metadata", () => {
        let metadataLoader = new MetadataLoader();
        return metadataLoader.load("generic", "dark").then(data => {
            assert.deepEqual(data, expectedGroupedDarkMetadata, "load function works");
        });
    });

    it("Version", () => {
        let metadataLoader = new MetadataLoader();
        assert.equal(metadataLoader.version(), "18.2.0");
    });
});

