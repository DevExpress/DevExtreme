const BOOTSTRAP_SCSS_PATH = "bootstrap/scss/";
const THEMEBUILDER_LESS_PATH = "devextreme-themebuilder/data/less/";

const SWATCH_SELECTOR_PREFIX = ".dx-swatch-";

const wrapBySwatch = (less, swatchSelector) => {
    return `${swatchSelector} { ${less} }`;
};

class LessFontPlugin {
    process(css) {
        return css.replace(/(\f)(\d+)/g, "\\f$2");
    }
}

class LessMetadataPreCompilerPlugin {
    constructor(metadata) {
        this._metadata = metadata;
    }

    process(less) {
        less += "#devexpress-metadata-compiler{";
        for(let key in this._metadata) {
            if(this._metadata.hasOwnProperty(key)) {
                let value = this._metadata[key];
                less += key + ": " + value + ";";
            }
        }
        less += "}";
        return less;
    }
}

class LessMetadataPostCompilerPlugin {
    constructor(compiledMetadata) {
        this._metadata = compiledMetadata;
    }

    process(css) {
        let metadataRegex = new RegExp("\\s*#devexpress-metadata-compiler\\s*\\{((.|\\n|\\r)*?)\\}");
        metadataRegex.exec(css)[1].split(";").forEach(item => {
            let rule = getCompiledRule(item);
            for(let key in rule) {
                if(rule.hasOwnProperty(key)) {
                    this._metadata[key] = rule[key];
                }
            }
        });

        return css.replace(metadataRegex, "");
    }
}


const getCompiledRule = cssString => {
    let result = {};
    let ruleRegex = /([-\w\d]*)\s*:\s*(.*)\s*/;
    let matches = ruleRegex.exec(cssString);
    if(matches) {
        result["@" + matches[1]] = matches[2];
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
        this.swatchSelector = config.makeSwatch ? SWATCH_SELECTOR_PREFIX + config.outColorScheme : "";
        this.outColorScheme = config.outColorScheme;
        this.version = version;
    }

    load(theme, colorScheme, metadata, modifiedItems) {
        return this._loadLess(theme, colorScheme).then(less => {
            const modifyVars = {};
            const metadataVariables = {};

            if(Array.isArray(modifiedItems)) {
                modifiedItems.forEach(item => {
                    modifyVars[item.key.replace("@", "")] = item.value;
                });
            }

            metadata.forEach((metaItem => {
                metadataVariables[metaItem.Key.replace("@", "")] = metaItem.Key;
            }));

            return this.compileLess(less, modifyVars, metadataVariables);
        });
    };

    compileWithSwatch(css) {
        const wrappedCss = wrapBySwatch(css, this.swatchSelector);
        return this.lessCompiler.render(wrappedCss, {}).then(swatchOutput => {
            const escapedSelector = this.swatchSelector.replace(".", "\\.");
            const customStylesDuplicateRegex = new RegExp("\\s+" + escapedSelector + "\\s+\.dx-theme-.*?-typography\\s+\.dx-theme-.*?{[\\s\\S]*?}[\\r\\n]*?", "g");
            const themeMarkerRegex = /(\.dx-theme-marker\s*{\s*font-family:\s*['"]dx\..*?\.)(.*)(['"])/g;
            const cssWithSwatch = swatchOutput.css
                .replace(customStylesDuplicateRegex, "")
                .replace(/\s\.dx-theme-.*?-typography/g, "")
                .replace(themeMarkerRegex, "$1" + this.outColorScheme + "$3");

            return this._makeInfoHeader() + cssWithSwatch;
        });
    }

    compileLess(less, modifyVars, metadata) {
        return new Promise((resolve, reject) => {
            let compiledMetadata = {};
            let options = {
                modifyVars: modifyVars,
                plugins: [{
                    install: (_, pluginManager) => {
                        pluginManager.addPostProcessor(new LessFontPlugin(this.options));
                    }
                }, {
                    install: (_, pluginManager) => {
                        pluginManager.addPreProcessor(new LessMetadataPreCompilerPlugin(metadata));
                    }
                }, {
                    install: (_, pluginManager) => {
                        pluginManager.addPostProcessor(new LessMetadataPostCompilerPlugin(compiledMetadata));
                    }
                }]
            };

            // while using `less/lib/less-browser`, the global options are not passed to the `render` method, lets do it by ourselves
            if(this.lessCompiler.options && typeof (this.lessCompiler.options) === "object") {
                Object.assign(options, this.lessCompiler.options);
            }

            this.lessCompiler.render(less, options).then(output => {
                const resolveResult = css => {
                    resolve(Object.assign({
                        compiledMetadata: compiledMetadata,
                        swatchSelector: this.swatchSelector
                    }, {
                        css: this._makeInfoHeader() + css
                    }));
                };

                if(this.swatchSelector) {
                    this.compileWithSwatch(output.css).then(cssWithSwatch => {
                        resolveResult(cssWithSwatch);
                    });
                } else {
                    resolveResult(output.css);
                }
            }, error => {
                reject(error);
            });
        });
    };

    compileScss(less, metadata) {
        return new Promise((resolve, reject) => {
            const compiledMetadata = {};

            const preCompiler = new LessMetadataPreCompilerPlugin(metadata, this.swatchSelector);
            const sassContent = preCompiler.process(less);

            this.sassCompiler.render(sassContent).then(css => {
                const postCompiler = new LessMetadataPostCompilerPlugin(compiledMetadata, this.swatchSelector);
                postCompiler.process(css);
                resolve({
                    compiledMetadata: compiledMetadata,
                    css: css
                });
            }, error => {
                reject(error);
            });
        });
    };

    analyzeBootstrapTheme(theme, colorScheme, metadata, bootstrapMetadata, customLessContent, version) {
        let metadataVariables = "";
        for(let key in bootstrapMetadata) {
            if(bootstrapMetadata.hasOwnProperty(key)) {
                metadataVariables += bootstrapMetadata[key] + ": dx-empty" + (version === 4 ? " !default" : "") + ";";
            }
        }

        return new Promise(resolve => {
            const processDxTheme = (data) => {
                let compiledMetadata = data.compiledMetadata;
                let modifyVars = {};
                for(let key in compiledMetadata) {
                    if(compiledMetadata.hasOwnProperty(key)) {
                        let value = compiledMetadata[key];
                        if(value !== "dx-empty") {
                            modifyVars[key] = value;
                        }
                    }
                }

                this._loadLess(theme, colorScheme).then(less => {
                    let metadataVariables = {};

                    metadata.forEach(metaItem => {
                        metadataVariables[metaItem.Key.replace("@", "")] = metaItem.Key;
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
                let defaultBootstrapVariablesUrl = this.bootstrapScssPath + "_variables.scss",
                    defaultBootstrapFunctionsUrl = this.bootstrapScssPath + "_functions.scss";

                Promise.all([this.readFile(defaultBootstrapFunctionsUrl), this.readFile(defaultBootstrapVariablesUrl)])
                    .then(files => {
                        this.compileScss(files[0] + customLessContent + files[1] + metadataVariables, bootstrapMetadata).then(processDxTheme);
                    }, () => {
                        this.compileScss(customLessContent + metadataVariables, bootstrapMetadata).then(processDxTheme);
                    });
            }
        });
    };

    _loadLess(theme, colorScheme) {
        let themeName = (theme ? theme + "-" : "");
        return this._loadLessByFileName("theme-builder-" + themeName + colorScheme + ".less");
    };

    _loadLessByFileName(fileName) {
        return this.readFile(this.themeBuilderLessPath + fileName);
    };

    _makeInfoHeader() {
        let generatedBy = "* Generated by the DevExpress Theme Builder";
        let versionString = "* Version: " + this.version;
        let link = "* http://js.devexpress.com/themebuilder/";

        return ["/*", generatedBy, versionString, link, "*/"].join("\n") + "\n\n";
    };
};

module.exports = LessTemplateLoader;
