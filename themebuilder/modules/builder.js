var MetadataLoader = require("../modules/metadata-loader.js");
var MetadataRepository = require("../modules/metadata-repository.js");
var LessTemplateLoader = require("../modules/less-template-loader.js");
var themes = require("../modules/themes.js");

var processTheme = function(config, metadata, data, version) {
    var lessTemplateLoader = new LessTemplateLoader(config, version);
    if(config.isBootstrap) {
        var bootstrapMetadata = config.bootstrapVersion === 3 ?
            require("../data/bootstrap-metadata/bootstrap-metadata.js") :
            require("../data/bootstrap-metadata/bootstrap4-metadata.js");

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
    var repositoryPromise = metadataRepository.init(themes);

    return Promise.all([config.metadataPromise, repositoryPromise]).then(function(resolves) {
        var data = resolves[0];

        var metadata = metadataRepository.getData({
            name: config.themeName,
            colorScheme: config.colorScheme
        });

        var version = metadataRepository.getVersion();

        return processTheme(config, metadata, data, version);
    });
}

module.exports = {
    buildTheme: buildTheme
};
