var assert = require("chai").assert;
var LessTemplateLoader = require("../modules/less-template-loader");
var themeName = "generic";
var colorScheme = "light";
var metadata = {
    "base.common": [
        {
            "Name": "50. Background color",
            "Key": "@base-bg",
            "Group": "base.common"
        }
    ],
    "base.typography": [
        {
            "Name": "1. Font family",
            "Key": "@base-font-family",
            "Group": "base.typography"
        },
        {
            "Name": "2. Text Color",
            "Key": "@base-text-color",
            "Group": "base.typography"
        }
    ]
};

describe("LessTemplateLoader", function() {
    it("analyzeBootstrapTheme - bootstrap 3", function() {
        var lessFileContent = "@body-bg: #000;";
        var config = {
            isBootstrap: true,
            bootstrapVersion: 3,
            lessCompiler: require("less/lib/less-node"),
            reader: function() {
                // data/less/theme-builder-generic-light.less
                return new Promise(function(resolve) {
                    resolve("@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;div { color: @base-bg; }");
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
                assert.equal(data.compiledMetadata["@base-text-color"], "#0f0");
                assert.equal(data.css, "div {\n  color: #000;\n}\n");
            });
    });

    it("analyzeBootstrapTheme - bootstrap 4", function() {
        var sassFileContent = "$body-bg: #000;";
        var config = {
            isBootstrap: true,
            bootstrapVersion: 4,
            lessCompiler: require("less/lib/less-node"),
            reader: function(filename) {
                var content = "";
                switch(filename) {
                    case "data/less/theme-builder-generic-light.less":
                        content = "@base-bg: #fff;@base-font-family:'default';@base-text-color: #fff;div { color: @base-bg; background: @base-text-color; }";
                        break;
                    case "node_modules/bootstrap/scss/_variables.scss":
                        content = "$gray-900: #212529 !default;$body-color: $gray-900 !default;";
                        break;
                    case "node_modules/bootstrap/scss/_functions.scss":
                        break;
                }

                return new Promise(function(resolve) {
                    resolve(content);
                });
            }
        };
        var bootstrapMetadata = require("../data/bootstrap-metadata/bootstrap4-metadata.js");
        var lessTemplateLoader = new LessTemplateLoader(config);
        return lessTemplateLoader.analyzeBootstrapTheme(
            themeName,
            colorScheme,
            metadata,
            bootstrapMetadata,
            sassFileContent,
            config.bootstrapVersion).then(function(data) {
                assert.equal(data.compiledMetadata["@base-bg"], "#000");
                assert.equal(data.compiledMetadata["@base-font-family"], "\'default\'");
                assert.equal(data.compiledMetadata["@base-text-color"], "#212529");
                assert.equal(data.css, "div {\n  color: #000;\n  background: #212529;\n}\n");
            });
    });

    it("load - variable change", function() {
        var config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            reader: function() {
                // data/less/theme-builder-generic-light.less
                return new Promise(function(resolve) {
                    resolve("@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;div { color: @base-bg; }");
                });
            }
        };

        var lessTemplateLoader = new LessTemplateLoader(config);
        metadata["base.common"][0].Value = "green";
        metadata["base.common"][0].isModified = true;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(function(data) {
                assert.equal(data.compiledMetadata["@base-bg"], "green");
                assert.equal(data.compiledMetadata["@base-font-family"], "\'default\'");
                assert.equal(data.compiledMetadata["@base-text-color"], "#0f0");
                assert.equal(data.css, "div {\n  color: green;\n}\n");

                delete metadata["base.common"][0].Value;
                delete metadata["base.common"][0].isModified;
            });
    });

    it("load - variable change, color swatch", function() {
        var config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            swatchSelector: ".swatch-class",
            reader: function() {
                // data/less/theme-builder-generic-light.less
                return new Promise(function(resolve) {
                    resolve("@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;div { color: @base-bg; }");
                });
            }
        };

        var lessTemplateLoader = new LessTemplateLoader(config);
        metadata["base.common"][0].Value = "green";
        metadata["base.common"][0].isModified = true;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(function(data) {
                assert.equal(data.compiledMetadata["@base-bg"], "green");
                assert.equal(data.css, ".swatch-class div {\n  color: green;\n}\n\n");
                delete metadata["base.common"][0].Value;
                delete metadata["base.common"][0].isModified;
            });
    });

    it("load - variable change, color swatch, typography and special classes", function() {
        var config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            swatchSelector: ".swatch-class",
            reader: function() {
                // data/less/theme-builder-generic-light.less
                return new Promise(function(resolve) {
                    resolve(`@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
                    div { color: @base-bg; }
                    .dx-theme-generic-typography { color: @base-bg; }
                    .dx-viewport.dx-theme-generic {
                        .dx-theme-accent-as-text-color {
                            color: @base-bg;
                        }
                    }`);
                });
            }
        };

        var lessTemplateLoader = new LessTemplateLoader(config);
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(function(data) {
                assert.equal(data.css, `.swatch-class div {
  color: #fff;
}
.swatch-class {
  color: #fff;
}
.dx-viewport.dx-theme-generic .swatch-class .dx-theme-accent-as-text-color {
  color: #fff;
}

`);
            });
    });

    it("compileLess", function() {
        var config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            swatchSelector: ".swatch-class"
        };

        var less = `@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
        div { color: @base-bg; }
        .dx-theme-generic-typography { color: @base-bg; }
        .dx-viewport.dx-theme-generic {
            .dx-theme-accent-as-text-color {
                color: @base-bg;
            }
        }`;

        var metadataVariables = {};

        for(var key in metadata) {
            if(metadata.hasOwnProperty(key)) {
                var group = metadata[key];
                group.forEach(function(groupItem) {
                    metadataVariables[groupItem.Key.replace("@", "")] = groupItem.Key;
                });
            }
        }

        var lessTemplateLoader = new LessTemplateLoader(config);
        return lessTemplateLoader.compileLess(less, {}, metadataVariables).then(function(data) {
            assert.equal(data.css, `.swatch-class div {
  color: #fff;
}
.swatch-class {
  color: #fff;
}
.dx-viewport.dx-theme-generic .swatch-class .dx-theme-accent-as-text-color {
  color: #fff;
}

`);
        });
    });

    it("compileScss", function() {
        var config = {
            isBootstrap: false
        };

        var scss = `$body-bg: #fff; $body-color:#0f0;
        div { color: $body-bg; }
        .dx-theme-generic-typography { color: $body-color; }
        .dx-viewport.dx-theme-generic {
            .dx-theme-accent-as-text-color {
                color: $body-bg;
            }
        }`;

        var lessTemplateLoader = new LessTemplateLoader(config);
        return lessTemplateLoader.compileScss(scss, {
            "base-bg": "$body-bg",
            "base-text-color": "$body-color"
        }).then(function(data) {

            assert.equal(data.css, `div {
  color: #fff;
}

.dx-theme-generic-typography {
  color: #0f0;
}

.dx-viewport.dx-theme-generic .dx-theme-accent-as-text-color {
  color: #fff;
}

#devexpress-metadata-compiler {
  base-bg: #fff;
  base-text-color: #0f0;
}`);
        });
    });
});
