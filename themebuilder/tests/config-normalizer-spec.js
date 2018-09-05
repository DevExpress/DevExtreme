const mock = require("mock-require");
const assert = require("chai").assert;
const normalizeConfig = require("../modules/config-normalizer");
const commands = require("../modules/commands");

const deleteUnchanged = (config) => {
    delete config.data;
    delete config.items;
    delete config.reader;
    delete config.lessCompiler;
};

describe("Cli arguments normalizer", () => {
    after(() => {
        mock.stopAll();
    });

    it("Commands stay unchanged", () => {
        let config = normalizeConfig({ command: "build-theme" });
        assert.equal(config.command, commands.BUILD_THEME);

        config = normalizeConfig({ command: "build-theme-vars" });
        assert.equal(config.command, commands.BUILD_VARS);
    });

    it("build-theme default parameters", () => {
        const config = normalizeConfig({ command: "build-theme" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme-vars default parameters", () => {
        const config = normalizeConfig({ command: "build-theme-vars" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.generic.custom-scheme.less",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme bootstrap configuration", () => {
        let config = normalizeConfig({ command: "build-theme", inputFile: "vars.less" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 3,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "dx.generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });


        config = normalizeConfig({ command: "build-theme", inputFile: "vars.scss" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 4,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "dx.generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme-vars bootstrap configuration", () => {
        let config = normalizeConfig({ command: "build-theme-vars", inputFile: "vars.less" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 3,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "dx.generic.custom-scheme.less",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });


        config = normalizeConfig({ command: "build-theme-vars", inputFile: "vars.scss" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 4,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "dx.generic.custom-scheme.less",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });


        config = normalizeConfig({ command: "build-theme-vars", inputFile: "vars.scss", outputFile: "./dir/file.scss" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 4,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "scss",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "./dir/file.scss",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme output parameters (file and color scheme)", () => {
        const config = normalizeConfig({ command: "build-theme", outputFile: "./dir/file.css", outputColorScheme: "green" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "./dir/file.css",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme output parameters (color scheme only)", () => {
        const config = normalizeConfig({ command: "build-theme", outputColorScheme: "green" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.generic.green.css",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme output parameters (color scheme, swatch, base)", () => {
        const config = normalizeConfig({ command: "build-theme", outputColorScheme: "green", makeSwatch: true, base: true });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": true,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": true,
            "out": "dx.generic.green.css",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme output parameters (color scheme not valid)", () => {
        const config = normalizeConfig({ command: "build-theme", outputColorScheme: "$#@green" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme-vars output parameters (color scheme)", () => {
        const config = normalizeConfig({ command: "build-theme-vars", outputColorScheme: "green" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.generic.green.less",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme-vars output parameters (color scheme, output file: less)", () => {
        const config = normalizeConfig({ command: "build-theme-vars", outputColorScheme: "green", outputFile: "vars.less" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "vars.less",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme-vars output parameters (color scheme, output file: scss)", () => {
        const config = normalizeConfig({ command: "build-theme-vars", outputColorScheme: "green", outputFile: "vars.scss" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "scss",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "vars.scss",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme-vars output parameters (color scheme, output file: scss, file format: less) (wrong file format - file extension pair)", () => {
        const config = normalizeConfig({ command: "build-theme-vars", outputColorScheme: "green", outputFile: "vars.scss", outputFormat: "less" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "vars.scss",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme-vars output parameters (color scheme, output file: scss, file format: scss)", () => {
        const config = normalizeConfig({ command: "build-theme-vars", outputColorScheme: "green", outputFormat: "scss" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "scss",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.generic.green.scss",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme input parameters (base theme)", () => {
        const config = normalizeConfig({ command: "build-theme", baseTheme: "material.blue.light" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "blue-light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.material.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "material"
        });
    });

    it("build-theme input parameters (base theme, input file)", () => {
        const config = normalizeConfig({ command: "build-theme", baseTheme: "material.blue.light", inputFile: "file.json" });
        deleteUnchanged(config);

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "blue-light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "dx.material.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "material"
        });
    });

    it("build-theme 'data', 'items', 'reader', 'lessCompiler' stay unchanged", () => {
        const config = normalizeConfig({ command: "build-theme", baseTheme: "material.blue.light", inputFile: "file.json", data: "somedata", items: "items", reader: "r", lessCompiler: "l" });

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "blue-light",
            "command": "build-theme",
            "data": "somedata",
            "fileFormat": "css",
            "isBootstrap": false,
            "items": "items",
            "lessCompiler": "l",
            "makeSwatch": false,
            "out": "dx.material.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "reader": "r",
            "themeName": "material"
        });
    });

    it("build-theme: if 'data' is empty string it will be unchanged", () => {
        const config = normalizeConfig({ command: "build-theme", baseTheme: "material.blue.light", data: "", items: "items", reader: "r", lessCompiler: "l" });

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "blue-light",
            "command": "build-theme",
            "data": "",
            "fileFormat": "css",
            "isBootstrap": false,
            "items": "items",
            "lessCompiler": "l",
            "makeSwatch": false,
            "out": "dx.material.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "reader": "r",
            "themeName": "material"
        });
    });
});
