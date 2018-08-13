var sassCompiler = require("sass");

var LESS_DIR_PATH = "data/less/";

var createModifyVars = function(modifyVars) {
    var result = "";
    for(var key in modifyVars) {
        if(modifyVars.hasOwnProperty(key)) {
            result += `@${key}: ${modifyVars[key]};`;
        }
    }
    return result;
};

var addSwatchClass = function(less, swatchSelector, modifyVars) {
    if(!swatchSelector) return less;
    return swatchSelector + "{" + less + createModifyVars(modifyVars) + "}";
}

var LessFontPlugin = function() {};
LessFontPlugin.prototype = {
    process: function(css) {
        return css.replace(/(\f)(\d+)/g, "\\f$2");
    }
};

var LessMetadataPreCompilerPlugin = function(metadata, swatchSelector, modifyVars) {
    this._metadata = metadata;
    this.swatchSelector = swatchSelector;
    this.modifyVars = modifyVars;
};

LessMetadataPreCompilerPlugin.prototype = {
    process: function(less) {
        less += "#devexpress-metadata-compiler{";
        for(var key in this._metadata) {
            if(this._metadata.hasOwnProperty(key)) {
                var value = this._metadata[key];
                less += key + ": " + value + ";";
            }
        }
        less += "}";
        return addSwatchClass(less, this.swatchSelector, this.modifyVars);
    }
};

var LessMetadataPostCompilerPlugin = function(compiledMetadata, swatchSelector) {
    this._metadata = compiledMetadata;
    this.swatchSelector = swatchSelector;
};
LessMetadataPostCompilerPlugin.prototype = {
    process: function(css) {
        var that = this;
        var metadataRegex = new RegExp("(?:" + this.swatchSelector + "\\s*)?\\s*#devexpress-metadata-compiler\\s*\\{((.|\\n|\\r)*?)\\}");
        metadataRegex.exec(css)[1].split(";").forEach(function(item) {
            var rule = getCompiledRule(item);
            for(var key in rule) {
                if(rule.hasOwnProperty(key)) {
                    that._metadata[key] = rule[key];
                }
            }
        });

        if(this.swatchSelector) {
            var escapedSelector = this.swatchSelector.replace(".", "\\.");
            var customStylesRegex = new RegExp("(" + escapedSelector + "\\s+)(\\.dx-viewport\\.dx-theme-(?:.*?)\\s)", "g");
            css = css
                .replace(/\s\.dx-theme-(?:.*?)-typography/g, "")
                .replace(customStylesRegex, "$2$1");

        }

        return css.replace(metadataRegex, "");
    }
};

var getCompiledRule = function(cssString) {
    var result = {};
    var ruleRegex = /([-\w\d]*)\s*:\s*(.*)\s*/;
    var matches = ruleRegex.exec(cssString);
    if(matches) {
        result["@" + matches[1]] = matches[2];
    } else {
        result = null;
    }
    return result;
};

var LessTemplateLoader = function(config, version) {
    var readFile = config.reader;
    var lessCompiler = config.lessCompiler;
    var swatchSelector = config.swatchSelector;

    this.load = function(theme, colorScheme, metadata) {
        var that = this;

        return that._loadLess(theme, colorScheme).then(function(less) {
            var modifyVars = {};
            var metadataVariables = {};
            for(var key in metadata) {
                if(metadata.hasOwnProperty(key)) {
                    var group = metadata[key];
                    group.forEach(function(groupItem) {
                        if(groupItem.isModified) {
                            modifyVars[groupItem.Key.replace("@", "")] = groupItem.Value;
                        }
                        metadataVariables[groupItem.Key.replace("@", "")] = groupItem.Key;
                    });
                }
            }

            return that.compileLess(less, modifyVars, metadataVariables);
        });
    };

    this.compileLess = function(less, modifyVars, metadata) {
        var that = this;
        return new Promise(function(resolve, reject) {
            var compiledMetadata = {};
            lessCompiler.render(less, {
                modifyVars: modifyVars, plugins: [{
                    install: function(less, pluginManager) {
                        pluginManager.addPostProcessor(new LessFontPlugin(this.options));
                    }
                }, {
                    install: function(less, pluginManager) {
                        pluginManager.addPreProcessor(new LessMetadataPreCompilerPlugin(metadata, swatchSelector, modifyVars));
                    }
                }, {
                    install: function(less, pluginManager) {
                        pluginManager.addPostProcessor(new LessMetadataPostCompilerPlugin(compiledMetadata, swatchSelector));
                    }
                }]
            }).then(function(output) {
                resolve({
                    compiledMetadata: compiledMetadata,
                    css: that._makeInfoHeader() + output.css
                });
            }, function(error) {
                reject(error);
            });
        });
    };

    this.compileScss = function(less, metadata) {
        return new Promise(function(resolve, reject) {
            var compiledMetadata = {};

            var preCompiler = new LessMetadataPreCompilerPlugin(metadata, swatchSelector);
            var sassContent = preCompiler.process(less);

            sassCompiler.render({
                data: sassContent
            }, function(error, result) {
                if(error) {
                    reject(error);
                } else {
                    var postCompiler = new LessMetadataPostCompilerPlugin(compiledMetadata, swatchSelector);
                    var resultCss = result.css.toString();

                    postCompiler.process(resultCss);
                    resolve({
                        compiledMetadata: compiledMetadata,
                        css: resultCss
                    });
                }
            });
        });
    };

    this.analyzeBootstrapTheme = function(theme, colorScheme, metadata, bootstrapMetadata, customLessContent, version) {
        var that = this;

        var preLessString = "";
        for(var key in bootstrapMetadata) {
            if(bootstrapMetadata.hasOwnProperty(key)) {
                preLessString += bootstrapMetadata[key] + ": dx-empty" + (version === 4 ? " !default" : "") + ";";
            }
        }

        return new Promise(function(resolve, reject) {
            var processDxTheme = function(data) {
                var compiledMetadata = data.compiledMetadata;
                var modifyVars = {};
                for(var key in compiledMetadata) {
                    if(compiledMetadata.hasOwnProperty(key)) {
                        var value = compiledMetadata[key];
                        if(value !== "dx-empty") {
                            modifyVars[key] = value;
                        }
                    }
                }

                that._loadLess(theme, colorScheme).then(function(less) {
                    var metadataVariables = {};

                    for(var key in metadata) {
                        if(metadata.hasOwnProperty(key)) {
                            var group = metadata[key];
                            group.forEach(function(groupItem) {
                                metadataVariables[groupItem.Key.replace("@", "")] = groupItem.Key;
                            });
                        }
                    }

                    that.compileLess(less, modifyVars, metadataVariables).then(function(data) {
                        resolve({
                            compiledMetadata: data.compiledMetadata,
                            modifyVars: modifyVars,
                            css: data.css
                        });
                    });
                });
            };

            if(version === 3) {
                that.compileLess(preLessString + customLessContent, {}, bootstrapMetadata).then(processDxTheme);
            } else if(version === 4) {
                var defaultBootstrapVariablesUrl = "node_modules/bootstrap/scss/_variables.scss",
                    defaultBootstrapFunctionsUrl = "node_modules/bootstrap/scss/_functions.scss";

                Promise.all([readFile(defaultBootstrapFunctionsUrl), readFile(defaultBootstrapVariablesUrl)])
                    .then(function(files) {
                        that.compileScss(files[0] + customLessContent + files[1] + preLessString, bootstrapMetadata).then(processDxTheme);
                    }, function() {
                        that.compileScss(customLessContent + preLessString, bootstrapMetadata).then(processDxTheme);
                    });
            }
        });
    };

    this._loadLess = function(theme, colorScheme) {
        var themeName = (theme ? theme + "-" : "");
        return this._loadLessByFileName(LESS_DIR_PATH + "theme-builder-" + themeName + colorScheme + ".less");
    };

    this._loadLessByFileName = function(fileName) {
        return readFile(fileName);
    };

    this._makeInfoHeader = function() {
        var generatedBy = "* Generated by the DevExpress Theme Builder",
            versionString = "* Version: " + version,
            link = "* http://js.devexpress.com/themebuilder/";

        return ["/*", generatedBy, versionString, link, "*/"].join("\n") + "\n\n";
    };
};

module.exports = LessTemplateLoader;
