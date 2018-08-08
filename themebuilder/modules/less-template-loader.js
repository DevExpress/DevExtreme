var sassCompiler = require("sass");

var LESS_DIR_PATH = "data/less/";

var addSwatchClass = function(less, swatchSelector) {
    if(!swatchSelector) return less;
    less += ".dx-swatch-marker { font-family: \"" + swatchSelector + "\" !important; }";
    return swatchSelector + "{" + less + "}";
}

var LessFontPlugin = function() {};
LessFontPlugin.prototype = {
    process: function(css) {
        return css.replace(/(\f)(\d+)/g, "\\f$2");
    }
};

var LessMetadataPreCompilerPlugin = function(metadata, swatchSelector) {
    this._metadata = metadata;
    this.swatchSelector = swatchSelector;
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
        return addSwatchClass(less, this.swatchSelector);
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

var LessTemplateLoader = function(config) {
    var readFile = config.reader;
    var lessCompiler = config.lessCompiler;
    var swatchSelector = config.swatchSelector;

    this.load = function(theme, colorScheme, metadata) {
        var that = this;
        return new Promise(function(resolve, reject) {
            that._loadLess(theme, colorScheme).then(function(less) {
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

                that.compileLess(less, modifyVars, metadataVariables).then(function(data) {
                    resolve(data);
                });
            });
        });
    };

    this.compileLess = function(less, modifyVars, metadata) {
        return new Promise(function(resolve, reject) {
            var compiledMetadata = {};
            lessCompiler.render(less, {
                modifyVars: modifyVars, plugins: [{
                    install: function(less, pluginManager) {
                        pluginManager.addPostProcessor(new LessFontPlugin(this.options));
                    }
                }, {
                    install: function(less, pluginManager) {
                        pluginManager.addPreProcessor(new LessMetadataPreCompilerPlugin(metadata, swatchSelector));
                    }
                }, {
                    install: function(less, pluginManager) {
                        pluginManager.addPostProcessor(new LessMetadataPostCompilerPlugin(compiledMetadata, swatchSelector));
                    }
                }]
            }).then(function(output) {
                resolve({
                    compiledMetadata: compiledMetadata,
                    css: output.css
                });
            }, function(error) {
                reject(error);
            });
        });
    }

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
                    resolve(compiledMetadata);
                }
            });
        });
    }

    this.analyzeBootstrapTheme = function(theme, colorScheme, metadata, bootstrapMetadata, customLessContent, version) {
        var that = this;

        var preLessString = "";
        for(var key in bootstrapMetadata) {
            if(bootstrapMetadata.hasOwnProperty(key)) {
                preLessString += bootstrapMetadata[key] + ": dx-empty" + (version === 4 ? " !default" : "") + ";";
            }
        }

        return new Promise(function(resolve, reject) {
            var processDxTheme = function(compiledMetadata) {
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
        return new Promise(function(resolve, reject) {
            readFile(fileName).then(function(data) {
                resolve(data);
            }, function(error) {
                reject(error);
            })
        });
    }

    this._makeInfoHeader = function(metadataVersion) {
        var generatedBy = "* Generated by the DevExpress Theme Builder",
            version = "* Version: " + metadataVersion,
            link = "* http://js.devexpress.com/themebuilder/";

        return ["/*", generatedBy, version, link, "*/"].join("\n");
    };
};

module.exports = LessTemplateLoader;
