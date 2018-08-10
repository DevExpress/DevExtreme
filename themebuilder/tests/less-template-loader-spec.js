var assert = require("chai").assert;
var LessTemplateLoader = require("../modules/less-template-loader");
var themeName = "generic";
var colorScheme = "light";
var metadata = {
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

describe("LessTemplateLoader", function() {
    it("analyzeBootstrapTheme", function() {
        var lessFileContent = "@body-bg: #000;";
        var config = {
            isBootstrap: true,
            bootstrapVersion: 3,
            lessCompiler: require("less/lib/less-node"),
            reader: function() {
                // data/less/theme-builder-generic-light.less
                return new Promise(function(resolve) {
                    resolve("@base-bg: #fff;@base-font-family:'default';div { color: @base-bg; }");
                });
            }
        };
        var bootstrapMetadata = require("../data/bootstrap-metadata/bootstrap-metadata.js");
        var lessTemplateLoader = new LessTemplateLoader(config);
        return lessTemplateLoader.analyzeBootstrapTheme(
            themeName,
            colorScheme,
            metadata,
            bootstrapMetadata,
            lessFileContent,
            config.bootstrapVersion).then(function(data) {
                assert.equal(data.compiledMetadata["@base-bg"], "#000");
                assert.equal(data.compiledMetadata["@base-font-family"], "\'default\'");
                assert.equal(data.css, "div {\n  color: #000;\n}\n");
            });
    });

});
