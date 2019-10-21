/* global __dirname */
const path = require("path");
const fs = require("fs");

const themes = require("./themes");
const getBundleName = require("./bundle-resolver");
const ModulesHandler = require("../modules/modules-handler");

const stylesDirectory = path.join(__dirname, "..", "..", "styles");
const themesFileContent = fs.readFileSync(path.join(stylesDirectory, "theme.less"), "utf8");
const publicWidgets = new ModulesHandler().availableWidgets(themesFileContent).map(w => w.name);


const capitalize = (key) => key.charAt(0).toUpperCase() + key.slice(1);
const getWidgetFromFileName = (fileName) => capitalize(fileName.split("/").pop().split(".")[0]);

const executor = (str, regex, handler) => {
    let matches;
    while((matches = regex.exec(str)) !== null) {
        handler(matches);
    }
};

const parseComments = (comments) => {
    const metaItem = {};

    executor(comments, /@(type|name|typeValues)\s(.+)/g, (matches) => {
        const key = capitalize(matches[1]);
        metaItem[key] = matches[2].trim();
    });

    return metaItem;
};

const getMetaItems = (less) => {
    const metaItems = [];

    executor(less, /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-@a-z_0-9]+):/gim, (matches) => {
        const metaItem = {
            "Key": matches[2]
        };
        metaItems.push(Object.assign(metaItem, parseComments(matches[1])));
    });

    return metaItems;
};

const parseImports = (less) => {
    const imports = [];

    executor(less, /@import(\s+\(.*?\))?\s+['"](.*?\.less)['"]/gi, (matches) => {
        const fileName = matches[2];
        const widget = getWidgetFromFileName(fileName);
        if(!imports.includes(widget)) imports.push(widget);
    });

    return imports;
};

const resolveDependencies = (dependencies) => {
    for(var widget in dependencies) {
        if(Object.prototype.hasOwnProperty.call(dependencies, widget)) {
            const widgetDependencies = dependencies[widget];

            for(let i = 0; i < widgetDependencies.length; i++) {
                const dependencyWidget = widgetDependencies[i];
                const dependencyList = dependencies[dependencyWidget];

                if(dependencyList && dependencyList.length) {
                    dependencyList.forEach((widgetFromDependency) => {
                        if(!widgetDependencies.includes(widgetFromDependency)) {
                            widgetDependencies.push(widgetFromDependency);
                        }
                    });
                }
            }

            const selfIndex = widgetDependencies.indexOf(widget);
            if(selfIndex >= 0) {
                widgetDependencies.splice(selfIndex, 1);
            }
        }
    }

    return dependencies;
};

const removeDependenciesInternals = (dependencies) => {
    for(var widget in dependencies) {
        if(Object.prototype.hasOwnProperty.call(dependencies, widget)) {
            if(publicWidgets.includes(widget.toLowerCase())) {
                dependencies[widget] = dependencies[widget].filter(w => publicWidgets.includes(w.toLowerCase()));
            } else {
                delete dependencies[widget];
            }
        }
    }
    return dependencies;
};

const dependenciesPlugin = (dependencies) => {
    return {
        install: (_, pluginManager) => {
            pluginManager.addPreProcessor({
                process: (less, context) => {
                    const fullPath = context && context.fileInfo && context.fileInfo.filename;

                    if(typeof fullPath === "string") {
                        const widget = getWidgetFromFileName(path.basename(fullPath));
                        if(!dependencies[widget]) {
                            dependencies[widget] = [];
                        }

                        dependencies[widget].push(...parseImports(less));
                    }
                    return less;
                }
            });
        }
    };
};

const generate = (version, lessCompiler) => {
    const promises = [];
    const metadata = {};
    const dependencies = {};
    const resultPath = path.join(__dirname, "..", "data", "metadata", "dx-theme-builder-metadata.js");

    themes.forEach((theme) => {
        const bundlePath = path.join(stylesDirectory, getBundleName(theme.name, theme.colorScheme));
        const propertyName = [theme.name, theme.colorScheme.replace(/-/g, "_"), "metadata"].join("_");

        metadata[propertyName] = [];

        const plugins = [{
            install: (_, pluginManager) => {
                pluginManager.addPreProcessor({
                    process: (less) => {
                        metadata[propertyName] = metadata[propertyName].concat(getMetaItems(less));
                        return less;
                    }
                });
            }
        }];

        if(promises.length === 0) {
            plugins.push(dependenciesPlugin(dependencies));
        }

        promises.push(lessCompiler.render(fs.readFileSync(bundlePath).toString(), {
            filename: bundlePath,
            plugins: plugins
        }));
    });

    return Promise.all(promises).then(() => {
        metadata["_metadata_version"] = version;
        metadata["dependencies"] = removeDependenciesInternals(resolveDependencies(dependencies));
        const meta = "module.exports = " + JSON.stringify(metadata) + ";";
        fs.mkdirSync(path.dirname(resultPath), { recursive: true });
        fs.writeFileSync(resultPath, meta);
    });
};

module.exports = {
    generate,
    getMetaItems,
    parseComments,
    parseImports,
    resolveDependencies,
    removeDependenciesInternals
};
