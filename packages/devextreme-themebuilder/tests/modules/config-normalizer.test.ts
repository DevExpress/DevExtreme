import normalizeConfig from '../../src/modules/config-normalizer';
import commands from '../../src/modules/commands';

describe('Cli arguments normalizer', () => {
  test('Commands stay unchanged', () => {
    let config: ConfigSettings = { command: 'build-theme' };
    normalizeConfig(config);
    expect(config.command).toBe(commands.BUILD_THEME);

    config = { command: 'export-theme-vars' };

    normalizeConfig(config);
    expect(config.command).toBe(commands.BUILD_VARS);
  });

  test('build-theme default parameters', () => {
    const config: ConfigSettings = { command: 'build-theme' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('export-theme-vars default parameters', () => {
    const config: ConfigSettings = { command: 'export-theme-vars' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'less',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.less',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('build-theme bootstrap configuration', () => {
    let config: ConfigSettings = { command: 'build-theme', inputFile: 'vars.less' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 3,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });

    config = { command: 'build-theme', inputFile: 'vars.scss' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 4,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });

    config = { command: 'build-theme', inputFile: 'vars.scss', bootstrapVersion: 3 };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 4,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });

    config = { command: 'build-theme', inputFile: 'vars.scss', bootstrapVersion: 4 };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 4,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });

    config = { command: 'build-theme', inputFile: 'vars.scss', bootstrapVersion: 5 };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 5,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });

    config = { command: 'build-theme', inputFile: 'vars.less', bootstrapVersion: 5 };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 3,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('export-theme-vars bootstrap configuration', () => {
    const config1: ConfigSettings = { command: 'export-theme-vars', inputFile: 'vars.less' };
    normalizeConfig(config1);

    expect(config1).toEqual({
      base: false,
      bootstrapVersion: 3,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'less',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.less',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });

    const config2: ConfigSettings = { command: 'export-theme-vars', inputFile: 'vars.scss' };
    normalizeConfig(config2);

    expect(config2).toEqual({
      base: false,
      bootstrapVersion: 4,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'less',
      isBootstrap: true,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.less',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });

    const config3: ConfigSettings = { command: 'export-theme-vars', inputFile: 'vars.scss', outputFile: './dir/file.scss' };
    normalizeConfig(config3);

    expect(config3).toEqual({
      base: false,
      bootstrapVersion: 4,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'scss',
      isBootstrap: true,
      makeSwatch: false,
      out: './dir/file.scss',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('build-theme output parameters (file and color scheme)', () => {
    const config: ConfigSettings = { command: 'build-theme', outputFile: './dir/file.css', outputColorScheme: 'green' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: './dir/file.css',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('build-theme output parameters (color scheme only)', () => {
    const config: ConfigSettings = { command: 'build-theme', outputColorScheme: 'green' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.green.css',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('build-theme output parameters (color scheme, swatch, base)', () => {
    const config: ConfigSettings = {
      command: 'build-theme', outputColorScheme: 'green', makeSwatch: true, base: true,
    };
    normalizeConfig(config);

    expect(config).toEqual({
      base: true,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: true,
      out: 'dx.generic.green.css',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('build-theme output parameters (color scheme not valid)', () => {
    const config: ConfigSettings = { command: 'build-theme', outputColorScheme: '$#@green' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('export-theme-vars output parameters (color scheme)', () => {
    const config: ConfigSettings = { command: 'export-theme-vars', outputColorScheme: 'green' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'less',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.green.less',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('export-theme-vars output parameters (color scheme, output file: less)', () => {
    const config: ConfigSettings = { command: 'export-theme-vars', outputColorScheme: 'green', outputFile: 'vars.less' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'less',
      isBootstrap: false,
      makeSwatch: false,
      out: 'vars.less',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('export-theme-vars output parameters (color scheme, output file: scss)', () => {
    const config: ConfigSettings = { command: 'export-theme-vars', outputColorScheme: 'green', outputFile: 'vars.scss' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'scss',
      isBootstrap: false,
      makeSwatch: false,
      out: 'vars.scss',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('export-theme-vars output parameters (color scheme, output file: scss, file format: less) (wrong file format - file extension pair)', () => {
    const config: ConfigSettings = {
      command: 'export-theme-vars', outputColorScheme: 'green', outputFile: 'vars.scss', outputFormat: 'less',
    };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'less',
      isBootstrap: false,
      makeSwatch: false,
      out: 'vars.scss',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('export-theme-vars output parameters (color scheme, output file: scss, file format: scss)', () => {
    const config: ConfigSettings = { command: 'export-theme-vars', outputColorScheme: 'green', outputFormat: 'scss' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'export-theme-vars',
      data: {},
      fileFormat: 'scss',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.green.scss',
      outColorScheme: 'green',
      themeName: 'generic',
    });
  });

  test('build-theme input parameters (base theme)', () => {
    const config: ConfigSettings = { command: 'build-theme', baseTheme: 'material.blue.light' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('build-theme input parameters (base theme) - material compact', () => {
    const config: ConfigSettings = { command: 'build-theme', baseTheme: 'material.blue.light.compact' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light-compact',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('build-theme input parameters (base theme, input file)', () => {
    const config: ConfigSettings = { command: 'build-theme', baseTheme: 'material.blue.light', inputFile: 'file.json' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('build-theme \'data\', \'items\' stay unchanged', () => {
    const config: ConfigSettings = {
      command: 'build-theme',
      baseTheme: 'material.blue.light',
      inputFile: 'file.json',
      data: 'somedata',
      items: [{ key: '1', value: '2' }],
    };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: 'somedata',
      fileFormat: 'css',
      isBootstrap: false,
      items: [{ key: '1', value: '2' }],
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('build-theme: if \'data\' is empty string it will be unchanged', () => {
    const config: ConfigSettings = {
      command: 'build-theme',
      baseTheme: 'material.blue.light',
      data: '',
      items: [{ key: '', value: '' }],
    };

    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: '',
      fileFormat: 'css',
      isBootstrap: false,
      items: [{ key: '', value: '' }],
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('build-theme: if themeId is set, but baseTheme not - right theme will be set', () => {
    const config: ConfigSettings = { command: 'build-theme', themeId: 27 };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'teal-light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('build-theme: if themeId and baseTheme both are set - themeId will be ignored', () => {
    const config: ConfigSettings = { command: 'build-theme', themeId: 27, baseTheme: 'material.blue.light' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('build-theme: if themeId is wrong, generic.light will be used', () => {
    const config: ConfigSettings = { command: 'build-theme', themeId: 270 };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('build-theme: if baseTheme is wrong, generic.light will be used', () => {
    const config: ConfigSettings = { command: 'build-theme', baseTheme: 'wrong.theme' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('export-theme-meta: default file format - json', () => {
    const config: ConfigSettings = { command: 'export-theme-meta' };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'export-theme-meta',
      data: {},
      fileFormat: 'json',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.json',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
    });
  });

  test('Paths are always normalized', () => {
    let config = { lessPath: 'my/custom/less', scssPath: 'my/custom/scss' };
    normalizeConfig(config);
    expect(config.lessPath).toBe('my/custom/less/');
    expect(config.scssPath).toBe('my/custom/scss/');

    config = { lessPath: 'my/custom/less/', scssPath: 'my/custom/scss/' };
    normalizeConfig(config);
    expect(config.lessPath).toBe('my/custom/less/');
    expect(config.scssPath).toBe('my/custom/scss/');
  });

  test('build-theme: \'widgets\' field is normalized', () => {
    const config: ConfigSettings = { command: 'build-theme', widgets: ['dataGrid'] };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'light',
      command: 'build-theme',
      data: {},
      fileFormat: 'css',
      isBootstrap: false,
      makeSwatch: false,
      out: 'dx.generic.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'generic',
      widgets: ['datagrid'],
    });
  });

  test('build-theme @treelist constants change to the @datagrid constants', () => {
    const config: ConfigSettings = {
      command: 'build-theme',
      baseTheme: 'material.blue.light',
      inputFile: 'file.json',
      data: 'somedata',
      items: [{ key: '1', value: '2' }, { key: '@treelist-bg-color', value: '2' }, { key: '@treelist-border-color', value: '3' }],
    };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: 'somedata',
      fileFormat: 'css',
      isBootstrap: false,
      items: [{ key: '1', value: '2' }, { key: '$datagrid-bg-color', value: '2' }, { key: '$datagrid-border-color', value: '3' }],
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('"@" is replaced with "$" in the "key" field in items', () => {
    const config: ConfigSettings = {
      command: 'build-theme',
      baseTheme: 'material.blue.light',
      inputFile: 'file.json',
      data: 'somedata',
      items: [{ key: '@datagrid-bg-color', value: '2' }, { key: '@datagrid-border-color', value: '3' }],
    };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: 'somedata',
      fileFormat: 'css',
      isBootstrap: false,
      items: [{ key: '$datagrid-bg-color', value: '2' }, { key: '$datagrid-border-color', value: '3' }],
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });

  test('variables are normalized to kebab-case', () => {
    const config: ConfigSettings = {
      command: 'build-theme',
      baseTheme: 'material.blue.light',
      inputFile: 'file.json',
      data: 'somedata',
      items: [{ key: '@DATAGRID_BG_COLOR', value: '2' }],
    };
    normalizeConfig(config);

    expect(config).toEqual({
      base: false,
      bootstrapVersion: 0,
      colorScheme: 'blue-light',
      command: 'build-theme',
      data: 'somedata',
      fileFormat: 'css',
      isBootstrap: false,
      items: [{ key: '$datagrid-bg-color', value: '2' }],
      makeSwatch: false,
      out: 'dx.material.custom-scheme.css',
      outColorScheme: 'custom-scheme',
      themeName: 'material',
    });
  });
});
