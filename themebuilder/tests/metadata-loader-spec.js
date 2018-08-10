var mock = require("mock-require");
var assert = require("chai").assert;
var MetadataLoader = require("../modules/metadata-loader");
var metadata = require("./test-metadata");

var expectedGroupedLightMetadata = {
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

var expectedGroupedDarkMetadata = {
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

describe("MetadataLoader", function() {
    this.beforeEach(function() {
        mock("../data/metadata/dx-theme-builder-metadata", metadata);
    });
    it("Group metadata", function() {
        var metadataLoader = new MetadataLoader();
        var groupedMetadata = metadataLoader.groupMetadata(metadata["generic_light_metadata"]);
        assert.deepEqual(groupedMetadata, expectedGroupedLightMetadata, "group function works");
    });
    it("Load metadata", function() {
        var metadataLoader = new MetadataLoader();
        return metadataLoader.load("generic", "dark").then(function(data) {
            assert.deepEqual(data, expectedGroupedDarkMetadata, "load function works");
        });
    });
});

