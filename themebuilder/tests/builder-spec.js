
const fs = require("fs");
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
});


