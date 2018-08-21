const assert = require("chai").assert;
const LessTemplateLoader = require("../modules/less-template-loader");
const themeName = "generic";
const colorScheme = "light";
let metadata = {
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

const emptyHeader = () => { return ""; };

describe("LessTemplateLoader", () => {
    it("analyzeBootstrapTheme - bootstrap 3", () => {
        let lessFileContent = "@body-bg: #000;";
        let config = {
            isBootstrap: true,
            bootstrapVersion: 3,
            lessCompiler: require("less/lib/less-node"),
            reader: () => {
                // data/less/theme-builder-generic-light.less
                return new Promise(resolve => {
                    resolve("@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;div { color: @base-bg; }");
                });
            }
        };
        let bootstrapMetadata = require("../data/bootstrap-metadata/bootstrap-metadata.js");
        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.analyzeBootstrapTheme(
            themeName,
            colorScheme,
            metadata,
            bootstrapMetadata,
            lessFileContent,
            config.bootstrapVersion).then(data => {
                assert.equal(data.compiledMetadata["@base-bg"], "#000");
                assert.equal(data.compiledMetadata["@base-font-family"], "\'default\'");
                assert.equal(data.compiledMetadata["@base-text-color"], "#0f0");
                assert.equal(data.css, "div {\n  color: #000;\n}\n");
            });
    });

    it("analyzeBootstrapTheme - bootstrap 4", () => {
        let sassFileContent = "$body-bg: #000;";
        let config = {
            isBootstrap: true,
            bootstrapVersion: 4,
            lessCompiler: require("less/lib/less-node"),
            reader: (filename) => {
                let content = "";
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

                return new Promise((resolve) => {
                    resolve(content);
                });
            }
        };
        let bootstrapMetadata = require("../data/bootstrap-metadata/bootstrap4-metadata.js");
        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.analyzeBootstrapTheme(
            themeName,
            colorScheme,
            metadata,
            bootstrapMetadata,
            sassFileContent,
            config.bootstrapVersion).then((data) => {
                assert.equal(data.compiledMetadata["@base-bg"], "#000");
                assert.equal(data.compiledMetadata["@base-font-family"], "\'default\'");
                assert.equal(data.compiledMetadata["@base-text-color"], "#212529");
                assert.equal(data.css, "div {\n  color: #000;\n  background: #212529;\n}\n");
            });
    });

    it("load - variable change", () => {
        let config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            reader: () => {
                // data/less/theme-builder-generic-light.less
                return new Promise(resolve => {
                    resolve("@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;div { color: @base-bg; }");
                });
            }
        };

        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        metadata["base.common"][0].Value = "green";
        metadata["base.common"][0].isModified = true;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
                assert.equal(data.compiledMetadata["@base-bg"], "green");
                assert.equal(data.compiledMetadata["@base-font-family"], "\'default\'");
                assert.equal(data.compiledMetadata["@base-text-color"], "#0f0");
                assert.equal(data.css, "div {\n  color: green;\n}\n");

                delete metadata["base.common"][0].Value;
                delete metadata["base.common"][0].isModified;
            });
    });

    it("load - variable change, color swatch", () => {
        let config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            swatchSelector: ".swatch-class",
            reader: () => {
                // data/less/theme-builder-generic-light.less
                return new Promise(resolve => {
                    resolve("@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;div { color: @base-bg; }");
                });
            }
        };

        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        metadata["base.common"][0].Value = "green";
        metadata["base.common"][0].isModified = true;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
                assert.equal(data.compiledMetadata["@base-bg"], "green");
                assert.equal(data.css, ".swatch-class div {\n  color: green;\n}\n\n");
                delete metadata["base.common"][0].Value;
                delete metadata["base.common"][0].isModified;
            });
    });

    it("load - variable change, color swatch, typography and special classes", () => {
        let config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            swatchSelector: ".swatch-class",
            reader: () => {
                // data/less/theme-builder-generic-light.less
                return new Promise(resolve => {
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

        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
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

    it("compileLess", () => {
        let config = {
            isBootstrap: false,
            lessCompiler: require("less/lib/less-node"),
            swatchSelector: ".swatch-class"
        };

        let less = `@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
        div { color: @base-bg; }
        .dx-theme-generic-typography { color: @base-bg; }
        .dx-viewport.dx-theme-generic {
            .dx-theme-accent-as-text-color {
                color: @base-bg;
            }
        }`;

        let metadataVariables = {};

        for(let key in metadata) {
            if(metadata.hasOwnProperty(key)) {
                let group = metadata[key];
                group.forEach(groupItem => {
                    metadataVariables[groupItem.Key.replace("@", "")] = groupItem.Key;
                });
            }
        }

        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.compileLess(less, {}, metadataVariables).then(data => {
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

    it("compileScss", () => {
        let config = {
            isBootstrap: false
        };

        let scss = `$body-bg: #fff; $body-color:#0f0;
        div { color: $body-bg; }
        .dx-theme-generic-typography { color: $body-color; }
        .dx-viewport.dx-theme-generic {
            .dx-theme-accent-as-text-color {
                color: $body-bg;
            }
        }`;

        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.compileScss(scss, {
            "base-bg": "$body-bg",
            "base-text-color": "$body-color"
        }).then(data => {

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

    it("_makeInfoHeader", () => {
        let lessTemplateLoader = new LessTemplateLoader({}, "18.2.0");
        let expectedHeader = "/*\n* Generated by the DevExpress Theme Builder\n* Version: 18.2.0\n* http://js.devexpress.com/themebuilder/\n*/\n\n";
        assert.equal(lessTemplateLoader._makeInfoHeader(), expectedHeader);
    });
});
