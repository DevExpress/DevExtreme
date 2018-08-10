var mock = require("mock-require");
var assert = require("chai").assert;
var MetadataLoader = require("../modules/metadata-loader");
var MetadataRepository = require("../modules/metadata-repository");
var themes = require("./test-themes");
var metadata = require("./test-metadata");

var expectedLightMetadata = {
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

var expectedLightMetadataAfterUpdate = {
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

describe("MetadataRepository", function() {
    this.beforeEach(function() {
        mock("../data/metadata/dx-theme-builder-metadata", metadata);
    });
    it("Init", function() {
        var metadataRepository = new MetadataRepository(new MetadataLoader());
        return metadataRepository.init(themes).then(function() {
            var genericLightMetadata = metadataRepository.getData({
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

});
