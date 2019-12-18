const mock = require('mock-require');
const assert = require('chai').assert;
const normalizeConfig = require('../modules/config-normalizer');
const commands = require('../modules/commands');

describe('Cli arguments normalizer', () => {
    after(() => {
        mock.stopAll();
    });

    it('Commands stay unchanged', () => {
        let config = { command: 'build-theme' };
        normalizeConfig(config);
        assert.equal(config.command, commands.BUILD_THEME);

        config = { command: 'export-theme-vars' };

        normalizeConfig(config);
        assert.equal(config.command, commands.BUILD_VARS);
    });

    it('build-theme default parameters', () => {
        const config = { command: 'build-theme' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('export-theme-vars default parameters', () => {
        const config = { command: 'export-theme-vars' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'less',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.less',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('build-theme bootstrap configuration', () => {
        let config = { command: 'build-theme', inputFile: 'vars.less' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 3,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': true,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });


        config = { command: 'build-theme', inputFile: 'vars.scss' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 4,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': true,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('export-theme-vars bootstrap configuration', () => {
        let config = { command: 'export-theme-vars', inputFile: 'vars.less' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 3,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'less',
            'isBootstrap': true,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.less',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });

        config = { command: 'export-theme-vars', inputFile: 'vars.scss' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 4,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'less',
            'isBootstrap': true,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.less',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });

        config = { command: 'export-theme-vars', inputFile: 'vars.scss', outputFile: './dir/file.scss' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 4,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'scss',
            'isBootstrap': true,
            'makeSwatch': false,
            'out': './dir/file.scss',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('build-theme output parameters (file and color scheme)', () => {
        const config = { command: 'build-theme', outputFile: './dir/file.css', outputColorScheme: 'green' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': './dir/file.css',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('build-theme output parameters (color scheme only)', () => {
        const config = { command: 'build-theme', outputColorScheme: 'green' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.green.css',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('build-theme output parameters (color scheme, swatch, base)', () => {
        const config = { command: 'build-theme', outputColorScheme: 'green', makeSwatch: true, base: true };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': true,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': true,
            'out': 'dx.generic.green.css',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('build-theme output parameters (color scheme not valid)', () => {
        const config = { command: 'build-theme', outputColorScheme: '$#@green' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('export-theme-vars output parameters (color scheme)', () => {
        const config = { command: 'export-theme-vars', outputColorScheme: 'green' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'less',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.green.less',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('export-theme-vars output parameters (color scheme, output file: less)', () => {
        const config = { command: 'export-theme-vars', outputColorScheme: 'green', outputFile: 'vars.less' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'less',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'vars.less',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('export-theme-vars output parameters (color scheme, output file: scss)', () => {
        const config = { command: 'export-theme-vars', outputColorScheme: 'green', outputFile: 'vars.scss' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'scss',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'vars.scss',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('export-theme-vars output parameters (color scheme, output file: scss, file format: less) (wrong file format - file extension pair)', () => {
        const config = { command: 'export-theme-vars', outputColorScheme: 'green', outputFile: 'vars.scss', outputFormat: 'less' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'less',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'vars.scss',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('export-theme-vars output parameters (color scheme, output file: scss, file format: scss)', () => {
        const config = { command: 'export-theme-vars', outputColorScheme: 'green', outputFormat: 'scss' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'export-theme-vars',
            'data': {},
            'fileFormat': 'scss',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.green.scss',
            'outColorScheme': 'green',
            'themeName': 'generic'
        });
    });

    it('build-theme input parameters (base theme)', () => {
        const config = { command: 'build-theme', baseTheme: 'material.blue.light' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'blue-light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.material.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'material'
        });
    });

    it('build-theme input parameters (base theme) - material compact', () => {
        const config = { command: 'build-theme', baseTheme: 'material.blue.light.compact' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'blue-light-compact',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.material.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'material'
        });
    });

    it('build-theme input parameters (base theme, input file)', () => {
        const config = { command: 'build-theme', baseTheme: 'material.blue.light', inputFile: 'file.json' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'blue-light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.material.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'material'
        });
    });

    it('build-theme \'data\', \'items\', \'reader\', \'lessCompiler\' stay unchanged', () => {
        const config = { command: 'build-theme', baseTheme: 'material.blue.light', inputFile: 'file.json', data: 'somedata', items: 'items', reader: 'r', lessCompiler: 'l' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'blue-light',
            'command': 'build-theme',
            'data': 'somedata',
            'fileFormat': 'css',
            'isBootstrap': false,
            'items': 'items',
            'lessCompiler': 'l',
            'makeSwatch': false,
            'out': 'dx.material.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'reader': 'r',
            'themeName': 'material'
        });
    });

    it('build-theme: if \'data\' is empty string it will be unchanged', () => {
        const config = { command: 'build-theme', baseTheme: 'material.blue.light', data: '', items: 'items', reader: 'r', lessCompiler: 'l' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'blue-light',
            'command': 'build-theme',
            'data': '',
            'fileFormat': 'css',
            'isBootstrap': false,
            'items': 'items',
            'lessCompiler': 'l',
            'makeSwatch': false,
            'out': 'dx.material.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'reader': 'r',
            'themeName': 'material'
        });
    });

    it('build-theme: if themeId is set, but baseTheme not - right theme will be set', () => {
        const config = { command: 'build-theme', themeId: 27 };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'teal-light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.material.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'material'
        });
    });

    it('build-theme: if themeId and baseTheme both are set - themeId will be ignored', () => {
        const config = { command: 'build-theme', themeId: 27, baseTheme: 'material.blue.light' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'blue-light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.material.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'material'
        });
    });

    it('build-theme: if themeId is wrong, generic.light will be used', () => {
        const config = { command: 'build-theme', themeId: 270 };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('build-theme: if baseTheme is wrong, generic.light will be used', () => {
        const config = { command: 'build-theme', baseTheme: 'wrong.theme' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'build-theme',
            'data': {},
            'fileFormat': 'css',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.css',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('export-theme-meta: default file format - json', () => {
        const config = { command: 'export-theme-meta' };
        normalizeConfig(config);

        assert.deepEqual(config, {
            'base': false,
            'bootstrapVersion': 0,
            'colorScheme': 'light',
            'command': 'export-theme-meta',
            'data': {},
            'fileFormat': 'json',
            'isBootstrap': false,
            'makeSwatch': false,
            'out': 'dx.generic.custom-scheme.json',
            'outColorScheme': 'custom-scheme',
            'themeName': 'generic'
        });
    });

    it('Paths are always normalized', () => {
        let config = { lessPath: 'my/custom/less', scssPath: 'my/custom/scss' };
        normalizeConfig(config);
        assert.equal(config.lessPath, 'my/custom/less/');
        assert.equal(config.scssPath, 'my/custom/scss/');

        config = { lessPath: 'my/custom/less/', scssPath: 'my/custom/scss/' };
        normalizeConfig(config);
        assert.equal(config.lessPath, 'my/custom/less/');
        assert.equal(config.scssPath, 'my/custom/scss/');
    });
});
