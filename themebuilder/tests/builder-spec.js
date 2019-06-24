/* global __dirname */
const fs = require("fs");
const path = require("path");
const assert = require("chai").assert;
const buildTheme = require("../modules/builder").buildTheme;
const commands = require("../modules/commands");

const fileReader = (filename) => {
    filename = filename.replace("devextreme-themebuilder/", "");
    return new Promise((resolve) => {
        fs.readFile(filename, "utf8", (error, data) => {
            resolve(data);
        });
    });
};

const normalizeCss = (css) => css
    .toLowerCase()
    .replace(/\s*\/\*[\s\S]*?\*\//g, "")
    .trim();

const lessCompiler = require("less/lib/less-node");

describe("Builder - testing exported function", () => {
    it("Build base theme with swatch", () => {
        const config = {
            command: commands.BUILD_THEME,
            reader: fileReader,
            lessCompiler: lessCompiler,
            makeSwatch: true
        };

        return buildTheme(config).then((result) => {
            assert.notEqual(result.css, "", "Has css in result");
            assert.equal(result.swatchSelector, ".dx-swatch-custom-scheme");
        });
    }).timeout(5000);

    it("Build theme according to bootstrap", () => {
        const config = {
            command: commands.BUILD_THEME,
            reader: fileReader,
            lessCompiler: lessCompiler,
            inputFile: "some.less",
            data: ""
        };

        return buildTheme(config).then((result) => {
            assert.notEqual(result.css, "", "Has css in result");
        });
    }).timeout(5000);

    it("Build theme with changed color constants (generic)", () => {
        const config = {
            command: commands.BUILD_THEME,
            reader: fileReader,
            lessCompiler: lessCompiler,
            items: [{ key: "@base-bg", value: "#abcdef" }]
        };

        return buildTheme(config).then((result) => {
            assert.notEqual(result.css, "", "Has css in result");
            assert.ok(/#abcdef/.test(result.css), "Color was changed");
        });
    }).timeout(5000);

    it("Build theme with changed color constants (material)", () => {
        const config = {
            command: commands.BUILD_THEME,
            reader: fileReader,
            lessCompiler: lessCompiler,
            baseTheme: "material.blue.light",
            items: [{ key: "@base-bg", value: "#abcdef" }]
        };

        return buildTheme(config).then((result) => {
            assert.notEqual(result.css, "", "Has css in result");
            assert.ok(/#abcdef/.test(result.css), "Color was changed");
        });
    }).timeout(5000);

    it("Theme built without parameters is the same that in distribution (generic)", () => {
        const config = {
            command: commands.BUILD_THEME,
            reader: fileReader,
            lessCompiler: lessCompiler,
            items: []
        };

        return buildTheme(config).then((result) => {
            const themeBuilderCss = normalizeCss(result.css);
            const distributionCss = normalizeCss(fs.readFileSync(path.join(__dirname, "../../artifacts/css/dx.light.css"), "utf8"));
            assert.ok(themeBuilderCss === distributionCss);
        });
    }).timeout(5000);

    it("Theme built without parameters is the same that in distribution (material)", () => {
        const config = {
            command: commands.BUILD_THEME,
            reader: fileReader,
            lessCompiler: lessCompiler,
            baseTheme: "material.blue.light",
            items: []
        };

        return buildTheme(config).then((result) => {
            const themeBuilderCss = normalizeCss(result.css);
            const distributionCss = normalizeCss(fs.readFileSync(path.join(__dirname, "../../artifacts/css/dx.material.blue.light.css"), "utf8"));
            assert.ok(themeBuilderCss === distributionCss);
        });
    }).timeout(5000);
});


