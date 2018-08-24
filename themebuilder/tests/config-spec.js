const mock = require("mock-require");
const assert = require("chai").assert;

let createdDirectory;

mock("../cli/adapters/node-file-reader", (file) => {
    if(file === "readable.json") {
        return new Promise(resolve => resolve("{meta}"));
    } else {
        return new Promise(resolve => resolve("{}"));
    }
});
mock("../cli/helpers/recursive-path-creator", (directory) => {
    createdDirectory = directory;
});
mock("less/lib/less-node", {});

const readCommandLineArguments = require("../cli/config");
const commands = require("../cli/commands");

describe("config", () => {
    after(() => {
        mock.stopAll();
    });

    it("Commands", () => {
        let config = readCommandLineArguments(["node", "devextreme-themebuilder"]);
        assert.equal(config.command, commands.BUILD_THEME);

        config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme"]);
        assert.equal(config.command, commands.BUILD_THEME);

        config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars"]);
        assert.equal(config.command, commands.BUILD_VARS);
    });

    it("build-theme default parameters", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme-vars default parameters", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "generic.custom-scheme.less",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme bootstrap configuration", () => {
        mock("../cli/adapters/node-file-reader", () => { return new Promise(resolve => resolve("{}")); });
        mock("./adapters/node-file-reader", () => { return new Promise(resolve => resolve("{}")); });
        let config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--input-file=vars.less"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 3,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });


        config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--input-file=vars.scss"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 4,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme-vars bootstrap configuration", () => {
        mock("../cli/adapters/node-file-reader", () => { return new Promise(resolve => resolve("{}")); });
        mock("./adapters/node-file-reader", () => { return new Promise(resolve => resolve("{}")); });
        let config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--input-file=vars.less"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 3,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "generic.custom-scheme.less",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });


        config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--input-file=vars.scss"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 4,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": true,
            "makeSwatch": false,
            "out": "generic.custom-scheme.less",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });


        config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--input-file=vars.scss", "--output-file=./dir/file.scss"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

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
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--output-file=./dir/file.css", "--output-color-scheme=green"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

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
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--output-color-scheme=green"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "generic.green.css",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme output parameters (color scheme, swatch, base)", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--output-color-scheme=green", "--make-swatch", "--base"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": true,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": true,
            "out": "generic.green.css",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme output parameters (color scheme not valid)", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--output-color-scheme=$#@green"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "generic.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "generic"
        });
    });

    it("build-theme-vars output parameters (color scheme)", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--output-color-scheme=green"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "less",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "generic.green.less",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme-vars output parameters (color scheme, output file: less)", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--output-color-scheme=green", "--output-file=vars.less"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

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
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--output-color-scheme=green", "--output-file=vars.scss"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

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
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--output-color-scheme=green", "--output-file=vars.scss", "--output-format=less"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

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
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme-vars", "--output-color-scheme=green", "--output-format=scss"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "light",
            "command": "build-theme-vars",
            "fileFormat": "scss",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "generic.green.scss",
            "outColorScheme": "green",
            "themeName": "generic"
        });
    });

    it("build-theme input parameters (base theme)", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--base-theme=material.blue.light"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "blue-light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "material.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "material"
        });
    });

    it("build-theme input parameters (base theme, input file)", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--base-theme=material.blue.light", "--input-file=file.json"]);
        delete config.metadataPromise;
        delete config.lessCompiler;
        delete config.reader;

        assert.deepEqual(config, {
            "base": false,
            "bootstrapVersion": 0,
            "colorScheme": "blue-light",
            "command": "build-theme",
            "fileFormat": "css",
            "isBootstrap": false,
            "makeSwatch": false,
            "out": "material.custom-scheme.css",
            "outColorScheme": "custom-scheme",
            "themeName": "material"
        });
    });

    it("build-theme input parameters (input file reading)", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--input-file=readable.json"]);
        delete config.lessCompiler;
        delete config.reader;

        return config.metadataPromise.then(function(data) {
            assert.equal(data, "{meta}", "right file was read");
        });
    });

    it("build-theme get empty object in meta by default", () => {
        const config = readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme"]);
        delete config.lessCompiler;
        delete config.reader;

        return config.metadataPromise.then(function(data) {
            assert.equal(data, "{}", "empty object by default");
        });
    });

    it("build-theme create output directory", () => {
        readCommandLineArguments(["node", "devextreme-themebuilder", "build-theme", "--output-file=../dir1/dir2/dir3/dir4/file1.txt"]);
        assert(createdDirectory, "../dir1/dir2/dir3/dir4/file1.txt", "path was passed to createDirectory helper");
    });
});
