const assert = require('chai').assert;
const LessTemplateLoader = require('../modules/less-template-loader');
const themeName = 'generic';
const colorScheme = 'light';
const lessCompiler = require('less/lib/less-node');

const metadata = [{
    'Name': '50. Background color',
    'Key': '@base-bg',
    'Group': 'base.common'
}, {
    'Name': '1. Font family',
    'Key': '@base-font-family',
    'Group': 'base.typography'
}, {
    'Name': '2. Text Color',
    'Key': '@base-text-color',
    'Group': 'base.typography'
}];

const emptyHeader = () => { return ''; };


const scssCompiler = {
    render: (scss) => {
        return new Promise((resolve, reject) => {
            require('dart-sass').render({
                data: scss
            }, (error, result) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(result.css.toString());
                }
            });
        });
    }
};

describe('LessTemplateLoader', () => {
    it('analyzeBootstrapTheme - bootstrap 3', () => {
        const lessFileContent = '@body-bg: #000;';
        const config = {
            isBootstrap: true,
            bootstrapVersion: 3,
            lessCompiler: lessCompiler,
            reader: () => {
                // data/less/bundles/dx.light.less
                return new Promise(resolve => {
                    resolve('@base-bg: #fff;@base-font-family:\'default\';@base-text-color:#0f0;div { color: @base-bg; }');
                });
            }
        };
        const bootstrapMetadata = require('../data/bootstrap-metadata/bootstrap-metadata.js');
        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.analyzeBootstrapTheme(
            themeName,
            colorScheme,
            metadata,
            bootstrapMetadata,
            lessFileContent,
            config.bootstrapVersion).then(data => {
            assert.equal(data.compiledMetadata['@base-bg'], '#000');
            assert.equal(data.compiledMetadata['@base-font-family'], '\'default\'');
            assert.equal(data.compiledMetadata['@base-text-color'], '#0f0');
            assert.equal(data.css, 'div {\n  color: #000;\n}');
        });
    });

    it('analyzeBootstrapTheme - bootstrap 4', () => {
        const sassFileContent = '$body-bg: #000;';
        const config = {
            isBootstrap: true,
            bootstrapVersion: 4,
            lessCompiler: lessCompiler,
            sassCompiler: scssCompiler,
            reader: (filename) => {
                let content = '';
                switch(filename) {
                    case 'devextreme-themebuilder/data/less/bundles/dx.light.less':
                        content = '@base-bg: #fff;@base-font-family:\'default\';@base-text-color: #fff;div { color: @base-bg; background: @base-text-color; }';
                        break;
                    case 'bootstrap/scss/_variables.scss':
                        content = '$gray-900: #212529 !default;$body-color: $gray-900 !default;';
                        break;
                    case 'bootstrap/scss/_functions.scss':
                        break;
                }

                return new Promise((resolve) => {
                    resolve(content);
                });
            }
        };
        const bootstrapMetadata = require('../data/bootstrap-metadata/bootstrap4-metadata.js');
        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.analyzeBootstrapTheme(
            themeName,
            colorScheme,
            metadata,
            bootstrapMetadata,
            sassFileContent,
            config.bootstrapVersion).then((data) => {
            assert.equal(data.compiledMetadata['@base-bg'], '#000');
            assert.equal(data.compiledMetadata['@base-font-family'], '\'default\'');
            assert.equal(data.compiledMetadata['@base-text-color'], '#212529');
            assert.equal(data.css, 'div {\n  color: #000;\n  background: #212529;\n}');
        });
    });

    it('load - variable change', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            reader: () => {
                // data/less/bundles/dx.light.less
                return new Promise(resolve => {
                    resolve('@base-bg: #fff;@base-font-family:\'default\';@base-text-color:#0f0;div { color: @base-bg; }');
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata,
            [{ key: '@base-bg', value: 'green' }]).then(data => {
            assert.equal(data.compiledMetadata['@base-bg'], 'green');
            assert.equal(data.compiledMetadata['@base-font-family'], '\'default\'');
            assert.equal(data.compiledMetadata['@base-text-color'], '#0f0');
            assert.equal(data.css, 'div {\n  color: green;\n}');
        });
    });

    it('load - variable change, color swatch', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
            reader: () => {
                // data/less/bundles/dx.light.less
                return new Promise(resolve => {
                    resolve('@base-bg: #fff;@base-font-family:\'default\';@base-text-color:#0f0;div { color: @base-bg; }');
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata,
            [{ key: '@base-bg', value: 'green' }]).then(data => {
            assert.equal(data.compiledMetadata['@base-bg'], 'green');
            assert.equal(data.css, '.dx-swatch-my-custom div {\n  color: green;\n}\n');
        });
    });

    it('load - variable change, color swatch, typography and special classes', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
            reader: () => {
                // data/less/bundles/dx.light.less
                return new Promise(resolve => {
                    resolve(`@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
                    div { color: @base-bg; }
                    .dx-theme-accent-as-text-color { color: @base-bg; }
                    .dx-theme-generic-typography {
                        color: @base-bg;
                        .dx-theme-accent-as-text-color {
                            color: @base-bg;
                        }
                    }`);
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom,
.dx-swatch-my-custom .dx-theme-accent-as-text-color,
.dx-swatch-my-custom div {
  color: #fff;
}
`);
        });
    });

    it('load - default less path', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            reader: path => {
                assert.equal(path, 'devextreme-themebuilder/data/less/bundles/dx.light.less');
                return new Promise(resolve => {
                    resolve('@base-bg: #fff;@base-font-family:\'default\';@base-text-color:#0f0;div { color: @base-bg; }');
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata,
            [{ key: '@base-bg', value: 'green' }]
        );
    });

    it('load - custom less path', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            lessPath: 'my/custom/path/',
            reader: path => {
                assert.equal(path, 'my/custom/path/bundles/dx.light.less');
                return new Promise(resolve => {
                    resolve('@base-bg: #fff;@base-font-family:\'default\';@base-text-color:#0f0;div { color: @base-bg; }');
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata,
            [{ key: '@base-bg', value: 'green' }]
        );
    });

    it('compileLess', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
        };

        const less = `@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
        div { color: @base-bg; }
        .dx-theme-accent-as-text-color { color: @base-bg; }
        .dx-theme-generic-typography {
            color: @base-bg;
            .dx-theme-accent-as-text-color {
                color: @base-bg;
            }
        }`;

        const metadataVariables = {};

        metadata.forEach(metaItem => {
            metadataVariables[metaItem.Key.replace('@', '')] = metaItem.Key;
        });

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.compileLess(less, {}, metadataVariables).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom,
.dx-swatch-my-custom .dx-theme-accent-as-text-color,
.dx-swatch-my-custom div {
  color: #fff;
}
`);
        });
    });

    it('compileScss', () => {
        const config = {
            sassCompiler: scssCompiler
        };

        const scss = `$body-bg: #fff; $body-color:#0f0;
        div { color: $body-bg; }
        .dx-theme-accent-as-text-color { color: $body-bg; }
        .dx-theme-generic-typography {
            color: $body-color;
            .dx-theme-accent-as-text-color {
                color: $body-bg;
            }
        }`;

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.compileScss(scss, {
            'base-bg': '$body-bg',
            'base-text-color': '$body-color'
        }).then(data => {

            assert.equal(data.css, `div {
  color: #fff;
}

.dx-theme-accent-as-text-color {
  color: #fff;
}

.dx-theme-generic-typography {
  color: #0f0;
}
.dx-theme-generic-typography .dx-theme-accent-as-text-color {
  color: #fff;
}

#devexpress-metadata-compiler {
  base-bg: #fff;
  base-text-color: #0f0;
}`);
        });
    });

    it('_makeInfoHeader', () => {
        const lessTemplateLoader = new LessTemplateLoader({}, '18.2.0');
        const expectedHeader = '/*\n* Generated by the DevExpress ThemeBuilder\n* Version: 18.2.0\n* http://js.devexpress.com/ThemeBuilder/\n*/\n\n';
        assert.equal(lessTemplateLoader._makeInfoHeader(), expectedHeader);
    });

    it('load - change color scheme in theme marker', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
            reader: () => {
                // data/less/bundles/dx.light.less
                return new Promise(resolve => {
                    resolve(`@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
                    .dx-theme-marker { font-family: 'dx.generic.light'; }
                    div { color: @base-bg; }
                    .dx-theme-accent-as-text-color { color: @base-bg; }
                    .dx-theme-generic-typography {
                        color: @base-bg;
                        .dx-theme-accent-as-text-color {
                            color: @base-bg;
                        }
                    }`);
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom .dx-theme-marker {
  font-family: 'dx.generic.my-custom';
}
.dx-swatch-my-custom,
.dx-swatch-my-custom .dx-theme-accent-as-text-color,
.dx-swatch-my-custom div {
  color: #fff;
}
`);
        });
    });

    it('compile less with options', () => {
        lessCompiler.options = {
            'rootpath': 'modified_path/'
        };

        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler
        };

        const less = `@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
        @font-face {
            font-family: 'DXIcons';
            src: url(~"icons/generic.woff2") format('woff2'),
                 url(~"icons/generic.woff") format('woff'),
                 url(~"icons/generic.ttf") format('truetype');
            font-weight: normal;
            font-style: normal;
        }`;

        const metadataVariables = {};

        metadata.forEach(metaItem => {
            metadataVariables[metaItem.Key.replace('@', '')] = metaItem.Key;
        });

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.compileLess(less, {}, metadataVariables).then(data => {
            lessCompiler.options = {};
            assert.equal(data.css, `@font-face {
  font-family: DXIcons;
  src: url(modified_path/icons/generic.woff2) format('woff2'),url(modified_path/icons/generic.woff) format('woff'),url(modified_path/icons/generic.ttf) format('truetype');
  font-weight: 400;
  font-style: normal;
}`);
        });
    });

    it('load - do not change the order of cascade\'s classes by swatch class (T692470) - checkbox case', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
            reader: () => {
                return new Promise(resolve => {
                    resolve(`@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
                    .dx-checkbox-icon {
                        .dx-checkbox-checked &, .dx-checkbox-checked& {
                            background-color: #fff;
                        }
                    }`);
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom .dx-checkbox-checked .dx-checkbox-icon,
.dx-swatch-my-custom .dx-checkbox-checked.dx-checkbox-icon {
  background-color: #fff;
}
`);
        });
    });

    it('load - do not change the order of cascade\'s classes by swatch class (T692470) - underlined editor case', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
            reader: () => {
                return new Promise(resolve => {
                    resolve(`@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
                    .dx-searchbox {
                        .dx-placeholder:before {
                            .dx-rtl.dx-editor-underlined&,
                            .dx-rtl .dx-editor-underlined& {
                                padding-right: 0;
                            }
                        }
                    }`);
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom .dx-rtl .dx-editor-underlined.dx-searchbox .dx-placeholder:before,
.dx-swatch-my-custom .dx-rtl.dx-editor-underlined.dx-searchbox .dx-placeholder:before {
  padding-right: 0;
}
`);
        });
    });

    it('load - do not change the order of cascade\'s classes by swatch class (T692470) - tabs case', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
            reader: () => {
                return new Promise(resolve => {
                    resolve(`@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
                    .dx-tab-selected {
                        & + & {
                            border: none;
                        }
                    }`);
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom .dx-tab-selected + .dx-swatch-my-custom .dx-tab-selected {
  border: none;
}
`);
        });
    });

    it('load - do not change the order of cascade\'s classes by swatch class (T692470) - tabs case with extra selector', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
            reader: () => {
                return new Promise(resolve => {
                    resolve(`@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
                    .dx-tab-selected {
                        & + .s & {
                            border: none;
                        }
                    }`);
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom .dx-tab-selected + .dx-swatch-my-custom .s .dx-tab-selected {
  border: none;
}
`);
        });
    });

    it('compileLess should add prefixes for some css properties according to browsers (T718724)', () => {
        const packageJson = require('../package.json');
        packageJson.browserslist = ['ie <= 10'];

        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom'
        };

        const less = `@base-bg: #fff;@base-font-family:'default';@base-text-color:#0f0;
        div { flex: 2; }`;

        const metadataVariables = {};

        metadata.forEach(metaItem => {
            metadataVariables[metaItem.Key.replace('@', '')] = metaItem.Key;
        });

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.compileLess(less, {}, metadataVariables).then(data => {
            assert.equal(data.css, `div {
  -ms-flex: 2;
  flex: 2;
}`);
        });
    });

    it('load - the result contains passed version', () => {
        const version = '1.0.0';
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            reader: () => {
                // data/less/bundles/dx.light.less
                return new Promise(resolve => {
                    resolve('@base-bg: #fff;@base-font-family:\'default\';@base-text-color:#0f0;');
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config, version);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata,
            []
        ).then(data => {
            assert.equal(data.version, version);
        });
    });

    it('clean-css works with noClean = false', () => {
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            reader: path => {
                assert.equal(path, 'devextreme-themebuilder/data/less/bundles/dx.light.less');
                return new Promise(resolve => {
                    resolve('@base-bg: #fff;@base-font-family:\'default\';@base-text-color:#0f0;div { font: 14px/1 DXIcons; font-size: 20px; line-height: 20px; }');
                });
            }
        };

        const lessTemplateLoader = new LessTemplateLoader(config);

        config.noClean = true;
        const lessTemplateLoaderNoClean = new LessTemplateLoader(config);

        lessTemplateLoaderNoClean._makeInfoHeader = emptyHeader;
        lessTemplateLoader._makeInfoHeader = emptyHeader;

        const testCases = [{
            loader: lessTemplateLoader,
            expected: 'div {\n  font: 20px/20px DXIcons;\n}'
        }, {
            loader: lessTemplateLoaderNoClean,
            expected: 'div {\n  font: 14px/1 DXIcons;\n  font-size: 20px;\n  line-height: 20px;\n}\n'
        }];

        const promises = testCases.map(testCase => testCase.loader.load(
            themeName,
            colorScheme,
            metadata,
            []
        ).then(data => assert.equal(data.css, testCase.expected)));

        return Promise.all(promises);
    });

    it('clean-css does not rebase path for the fonts', () => {
        // With the default { rebase: true } the path will be changed to the '../../../artifacts/css' with clean-css
        lessCompiler.options = {
            'rootpath': '../../../../artifacts/css'
        };
        const config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            reader: path => {
                assert.equal(path, 'devextreme-themebuilder/data/less/bundles/dx.light.less');
                return new Promise(resolve => {
                    resolve(`
@base-bg: #fff;
@base-font-family:'default';
@base-text-color:#0f0;
@font-face {
    font-family: RobotoFallback;
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'),url(fonts/Roboto-300.woff2) format('woff2');
}`);
                });
            }
        };

        // eslint-disable-next-line
        process.chdir('..');

        const lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;

        return lessTemplateLoader.load(
            themeName,
            colorScheme,
            metadata,
            []
        ).then(data => {
            lessCompiler.options = {};

            // eslint-disable-next-line
            process.chdir('themebuilder');
            assert.equal(data.css, `@font-face {
  font-family: RobotoFallback;
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'),url(../../../../artifacts/css/fonts/Roboto-300.woff2) format('woff2');
}`);
        });
    });
});
