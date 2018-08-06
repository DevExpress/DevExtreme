var fs = require("fs");
var readFile = require("./adapters/node-file-reader");

var MetadataLoader = require("../modules/metadata-loader.js");
var MetadataRepository = require("../modules/metadata-repository.js");
var LessTemplateLoader = require("../modules/less-template-loader.js");
var themes = require("../modules/themes.js");

var processTheme = function(config, metadata, data) {
    var lessTemplateLoader = new LessTemplateLoader(readFile);
    if(config.isBootstrap) {
        var bootstrapMetadata = config.bootstrapVersion === 3 ?
            require("../data/bootstrap/bootstrap-metadata.js") :
            require("../data/bootstrap/bootstrap4-metadata.js");

        return lessTemplateLoader.analyzeBootstrapTheme(config.themeName, config.colorScheme, metadata, bootstrapMetadata, data, config.bootstrapVersion);
    } else {
        var metadataJSON = JSON.parse(data);
        if(metadataJSON.items) {
            metadataJSON.items.forEach(function(item) {
                for(var group in metadata) {
                    metadata[group].forEach(function(metadataItem) {
                        if(metadataItem.Key === item.key) {
                            metadataItem.Value = item.value;
                            metadataItem.isModified = true;
                            return false;
                        }
                    });
                }
            });
        }
        return lessTemplateLoader.load(config.themeName, config.colorScheme, metadata);
    }
}

var buildTheme = function(config) {
    var metadataRepository = new MetadataRepository(new MetadataLoader());

    var dataPromise = new Promise(function(resolve, reject) {
        if(!config.metadataFilePath) resolve("{}");
        fs.readFile(config.metadataFilePath, 'utf8', function(error, data) {
            if(error) reject(error);
            else resolve(data);
        });
    });

    var repositoryPromise = metadataRepository.init(themes);

    return Promise.all([dataPromise, repositoryPromise]).then(function(resolves) {
        var data = resolves[0];

        var metadata = metadataRepository.getData({
            name: config.themeName,
            colorScheme: config.colorScheme
        });

        return processTheme(config, metadata, data);
    });
}

exports.buildTheme = buildTheme;
