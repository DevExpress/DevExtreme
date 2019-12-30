const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const getBundleName = require('./bundle-resolver');
const ModulesHandler = require('./modules-handler');

const BOOTSTRAP_SCSS_PATH = 'bootstrap/scss/';
const THEMEBUILDER_LESS_PATH = 'devextreme-themebuilder/data/less/';
const SWATCH_SELECTOR_PREFIX = '.dx-swatch-';

const createModifyVars = modifyVars => {
    let result = '';
    for(const key in modifyVars) {
        if(Object.prototype.hasOwnProperty.call(modifyVars, key)) {
            result += `@${key}: ${modifyVars[key]};`;
        }
    }
    return result;
};

const addSwatchClass = (less, swatchSelector, modifyVars) => {
    if(!swatchSelector) return less;
    return swatchSelector + '{' + less + createModifyVars(modifyVars) + '}';
};

class LessFontPlugin {
    process(css) {
        return css.replace(/(\f)(\d+)/g, '\\f$2');
    }
}

class LessMetadataPreCompiler {
    constructor(metadata, swatchSelector, modifyVars) {
        this._metadata = metadata;
        this.swatchSelector = swatchSelector;
        this.modifyVars = modifyVars;
    }

    process(less) {
        less += '#devexpress-metadata-compiler{';
        for(const key in this._metadata) {
            if(Object.prototype.hasOwnProperty.call(this._metadata, key)) {
                const value = this._metadata[key];
                less += key + ': ' + value + ';';
            }
        }
        less += '}';
        return addSwatchClass(less, this.swatchSelector, this.modifyVars);
    }
}

class LessMetadataPostCompiler {
    constructor(compiledMetadata, swatchSelector, colorScheme) {
        this._metadata = compiledMetadata;
        this.swatchSelector = swatchSelector;
        this.colorScheme = colorScheme;
    }

    process(css) {
        const metadataRegex = new RegExp('(?:' + this.swatchSelector + '\\s*)?\\s*#devexpress-metadata-compiler\\s*\\{((.|\\n|\\r)*?)\\}');
        metadataRegex.exec(css)[1].split(';').forEach(item => {
            const rule = getCompiledRule(item);
            for(const key in rule) {
                if(Object.prototype.hasOwnProperty.call(rule, key)) {
                    this._metadata[key] = rule[key];
                }
            }
        });

        if(this.swatchSelector) {
            const escapedSelector = this.swatchSelector.replace('.', '\\.');

            const customStylesDuplicateRegex = new RegExp(`\\s+${escapedSelector}\\s+\\.dx-theme-.*?-typography\\s+\\.dx-theme-.*?{[\\s\\S]*?}[\\r\\n]*?`, 'g');
            const swatchOrderRegex = new RegExp(`([ \\t]*)([\\w\\.#:\\*][\\w\\.#:\\*\\->()\\s]*)(${escapedSelector}\\s)([^,{+~]*)`, 'gm');
            const themeMarkerRegex = /(\.dx-theme-marker\s*{\s*font-family:\s*['"]dx\..*?\.)(.*)(['"])/g;

            css = css
                .replace(swatchOrderRegex, '$1$3$2$4')
                .replace(customStylesDuplicateRegex, '')
                .replace(/\s\.dx-theme-.*?-typography/g, '')
                .replace(themeMarkerRegex, '$1' + this.colorScheme + '$3');
        }

        return css.replace(metadataRegex, '');
    }
}


const getCompiledRule = cssString => {
    let result = {};
    const ruleRegex = /([-\w\d]*)\s*:\s*(.*)\s*/;
    const matches = ruleRegex.exec(cssString);
    if(matches) {
        result['@' + matches[1]] = matches[2];
    } else {
        result = null;
    }
    return result;
};

class LessTemplateLoader {
    constructor(config, version) {
        this.readFile = config.reader;
        this.lessCompiler = config.lessCompiler;
        this.sassCompiler = config.sassCompiler;
        this.themeBuilderLessPath = config.lessPath ? config.lessPath : THEMEBUILDER_LESS_PATH;
        this.bootstrapScssPath = config.scssPath ? config.scssPath : BOOTSTRAP_SCSS_PATH;
        this.swatchSelector = config.makeSwatch ? SWATCH_SELECTOR_PREFIX + config.outColorScheme : '';
        this.outColorScheme = config.outColorScheme;
        this.version = version;
    }

    load(theme, colorScheme, metadata, modifiedItems, widgets) {
        return this._loadLess(theme, colorScheme).then(less => {
            const modifyVars = {};
            const metadataVariables = {};

            if(Array.isArray(modifiedItems)) {
                modifiedItems.forEach(item => {
                    modifyVars[item.key.replace('@', '')] = item.value;
                });
            }

            metadata.forEach((metaItem => {
                metadataVariables[metaItem.Key.replace('@', '')] = metaItem.Key;
            }));

            return this.compileLess(less, modifyVars, metadataVariables, widgets);
        });
    }

    compileLess(less, modifyVars, metadata, widgets) {
        return new Promise((resolve, reject) => {
            const browsersList = require('../package.json').browserslist;
            const modulesHandler = new ModulesHandler(widgets);
            const compiledMetadata = {};
            const options = {};

            // while using `less/lib/less-browser`, the global options are not passed to the `render` method, lets do it by ourselves
            if(this.lessCompiler.options && typeof (this.lessCompiler.options) === 'object') {
                Object.assign(options, this.lessCompiler.options);
            }

            const customOptions = {
                modifyVars: modifyVars,
                plugins: [
                    new LessPluginAutoPrefix({ browsers: browsersList }),
                    {
                        install: (_, pluginManager) => {
                            pluginManager.addPostProcessor(new LessFontPlugin(this.options));
                        }
                    },
                    modulesHandler.lessPlugin()
                ]
            };

            const preCompiler = new LessMetadataPreCompiler(metadata, this.swatchSelector, modifyVars);
            const postCompiler = new LessMetadataPostCompiler(compiledMetadata, this.swatchSelector, this.outColorScheme);

            less = preCompiler.process(less);

            Object.assign(options, customOptions);

            this.lessCompiler.render(less, options).then(output => {
                const css = postCompiler.process(output.css);
                resolve({
                    compiledMetadata: compiledMetadata,
                    css: this._makeInfoHeader() + css,
                    swatchSelector: this.swatchSelector,
                    version: this.version,
                    widgets: modulesHandler.bundledWidgets,
                    unusedWidgets: modulesHandler.unusedWidgets
                });
            }, error => {
                reject(error);
            });
        });
    }

    compileScss(less, metadata) {
        return new Promise((resolve, reject) => {
            const compiledMetadata = {};

            const preCompiler = new LessMetadataPreCompiler(metadata, this.swatchSelector);
            const sassContent = preCompiler.process(less);

            this.sassCompiler.render(sassContent).then(css => {
                const postCompiler = new LessMetadataPostCompiler(compiledMetadata, this.swatchSelector);
                postCompiler.process(css);
                resolve({
                    compiledMetadata: compiledMetadata,
                    css: css
                });
            }, error => {
                reject(error);
            });
        });
    }

    analyzeBootstrapTheme(theme, colorScheme, metadata, bootstrapMetadata, customLessContent, version) {
        let metadataVariables = '';
        for(const key in bootstrapMetadata) {
            if(Object.prototype.hasOwnProperty.call(bootstrapMetadata, key)) {
                metadataVariables += bootstrapMetadata[key] + ': dx-empty' + (version === 4 ? ' !default' : '') + ';';
            }
        }

        return new Promise(resolve => {
            const processDxTheme = (data) => {
                const compiledMetadata = data.compiledMetadata;
                const modifyVars = {};
                for(const key in compiledMetadata) {
                    if(Object.prototype.hasOwnProperty.call(compiledMetadata, key)) {
                        const value = compiledMetadata[key];
                        if(value !== 'dx-empty') {
                            modifyVars[key] = value;
                        }
                    }
                }

                this._loadLess(theme, colorScheme).then(less => {
                    const metadataVariables = {};

                    metadata.forEach(metaItem => {
                        metadataVariables[metaItem.Key.replace('@', '')] = metaItem.Key;
                    });

                    this.compileLess(less, modifyVars, metadataVariables).then(data => {
                        resolve({
                            compiledMetadata: data.compiledMetadata,
                            modifyVars: modifyVars,
                            css: data.css
                        });
                    });
                });
            };

            if(version === 3) {
                this.compileLess(metadataVariables + customLessContent, {}, bootstrapMetadata).then(processDxTheme);
            } else if(version === 4) {
                const defaultBootstrapVariablesUrl = this.bootstrapScssPath + '_variables.scss';
                const defaultBootstrapFunctionsUrl = this.bootstrapScssPath + '_functions.scss';

                Promise.all([this.readFile(defaultBootstrapFunctionsUrl), this.readFile(defaultBootstrapVariablesUrl)])
                    .then(files => {
                        this.compileScss(files[0] + customLessContent + files[1] + metadataVariables, bootstrapMetadata).then(processDxTheme);
                    }, () => {
                        this.compileScss(customLessContent + metadataVariables, bootstrapMetadata).then(processDxTheme);
                    });
            }
        });
    }

    _loadLess(theme, colorScheme) {
        const path = getBundleName(theme, colorScheme);
        return this._loadLessByFileName(path);
    }

    _loadLessByFileName(fileName) {
        return this.readFile(this.themeBuilderLessPath + fileName);
    }

    _makeInfoHeader() {
        const generatedBy = '* Generated by the DevExpress ThemeBuilder';
        const versionString = '* Version: ' + this.version;
        const link = '* http://js.devexpress.com/ThemeBuilder/';

        return ['/*', generatedBy, versionString, link, '*/'].join('\n') + '\n\n';
    }
}

module.exports = LessTemplateLoader;
