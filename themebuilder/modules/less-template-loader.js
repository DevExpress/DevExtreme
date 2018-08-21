const sassCompiler = require("sass");

const LESS_DIR_PATH = "data/less/";

const createModifyVars = modifyVars => {
    let result = "";
    for(let key in modifyVars) {
        if(modifyVars.hasOwnProperty(key)) {
            result += `@${key}: ${modifyVars[key]};`;
        }
    }
    return result;
};

const addSwatchClass = (less, swatchSelector, modifyVars) => {
    if(!swatchSelector) return less;
    return swatchSelector + "{" + less + createModifyVars(modifyVars) + "}";
}

class LessFontPlugin {
    process(css) {
        return css.replace(/(\f)(\d+)/g, "\\f$2");
    }
}

class LessMetadataPreCompilerPlugin {
    constructor(metadata, swatchSelector, modifyVars) {
        this._metadata = metadata;
        this.swatchSelector = swatchSelector;
        this.modifyVars = modifyVars;
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
        return addSwatchClass(less, this.swatchSelector, this.modifyVars);
    }
}

class LessMetadataPostCompilerPlugin {
    constructor(compiledMetadata, swatchSelector) {
        this._metadata = compiledMetadata;
        this.swatchSelector = swatchSelector;
    }

    process(css) {
        let metadataRegex = new RegExp("(?:" + this.swatchSelector + "\\s*)?\\s*#devexpress-metadata-compiler\\s*\\{((.|\\n|\\r)*?)\\}");
        metadataRegex.exec(css)[1].split(";").forEach(item => {
            let rule = getCompiledRule(item);
            for(let key in rule) {
                if(rule.hasOwnProperty(key)) {
                    this._metadata[key] = rule[key];
                }
            }
        });

        if(this.swatchSelector) {
            let escapedSelector = this.swatchSelector.replace(".", "\\.");
            let customStylesRegex = new RegExp("(" + escapedSelector + "\\s+)(\\.dx-viewport\\.dx-theme-(?:.*?)\\s)", "g");
            css = css
                .replace(/\s\.dx-theme-(?:.*?)-typography/g, "")
                .replace(customStylesRegex, "$2$1");

        }

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
        this.swatchSelector = config.swatchSelector;
        this.version = version;
    }

    load(theme, colorScheme, metadata) {
        return this._loadLess(theme, colorScheme).then(less => {
            let modifyVars = {};
            let metadataVariables = {};
            for(let key in metadata) {
                if(metadata.hasOwnProperty(key)) {
                    let group = metadata[key];
                    group.forEach(groupItem => {
                        if(groupItem.isModified) {
                            modifyVars[groupItem.Key.replace("@", "")] = groupItem.Value;
                        }
                        metadataVariables[groupItem.Key.replace("@", "")] = groupItem.Key;
                    });
                }
            }

            return this.compileLess(less, modifyVars, metadataVariables);
        });
    };

    compileLess(less, modifyVars, metadata) {
        return new Promise((resolve, reject) => {
            let compiledMetadata = {};
            this.lessCompiler.render(less, {
                modifyVars: modifyVars, plugins: [{
                    install: (less, pluginManager) => {
                        pluginManager.addPostProcessor(new LessFontPlugin(this.options));
                    }
                }, {
                    install: (less, pluginManager) => {
                        pluginManager.addPreProcessor(new LessMetadataPreCompilerPlugin(metadata, this.swatchSelector, modifyVars));
                    }
                }, {
                    install: (less, pluginManager) => {
                        pluginManager.addPostProcessor(new LessMetadataPostCompilerPlugin(compiledMetadata, this.swatchSelector));
                    }
                }]
            }).then(output => {
                resolve({
                    compiledMetadata: compiledMetadata,
                    css: this._makeInfoHeader() + output.css
                });
            }, error => {
                reject(error);
            });
        });
    };

    compileScss(less, metadata) {
        return new Promise((resolve, reject) => {
            let compiledMetadata = {};

            let preCompiler = new LessMetadataPreCompilerPlugin(metadata, this.swatchSelector);
            let sassContent = preCompiler.process(less);

            sassCompiler.render({
                data: sassContent
            }, (error, result) => {
                if(error) {
                    reject(error);
                } else {
                    let postCompiler = new LessMetadataPostCompilerPlugin(compiledMetadata, this.swatchSelector);
                    let resultCss = result.css.toString();

                    postCompiler.process(resultCss);
                    resolve({
                        compiledMetadata: compiledMetadata,
                        css: resultCss
                    });
                }
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

                    for(let key in metadata) {
                        if(metadata.hasOwnProperty(key)) {
                            let group = metadata[key];
                            group.forEach(groupItem => {
                                metadataVariables[groupItem.Key.replace("@", "")] = groupItem.Key;
                            });
                        }
                    }

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
                let defaultBootstrapVariablesUrl = "node_modules/bootstrap/scss/_variables.scss",
                    defaultBootstrapFunctionsUrl = "node_modules/bootstrap/scss/_functions.scss";

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
        return this._loadLessByFileName(LESS_DIR_PATH + "theme-builder-" + themeName + colorScheme + ".less");
    };

    _loadLessByFileName(fileName) {
        return this.readFile(fileName);
    };

    _makeInfoHeader() {
        let generatedBy = "* Generated by the DevExpress Theme Builder";
        let versionString = "* Version: " + this.version;
        let link = "* http://js.devexpress.com/themebuilder/";

        return ["/*", generatedBy, versionString, link, "*/"].join("\n") + "\n\n";
    };
};

module.exports = LessTemplateLoader;
