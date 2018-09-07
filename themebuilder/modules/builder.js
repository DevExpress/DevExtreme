const MetadataLoader = require("../modules/metadata-loader.js");
const MetadataRepository = require("../modules/metadata-repository.js");
const LessTemplateLoader = require("../modules/less-template-loader.js");
const themes = require("../modules/themes.js");
const normalize = require("../modules/config-normalizer");

const processTheme = (config, metadata, version) => {
    let lessTemplateLoader = new LessTemplateLoader(config, version);
    if(config.isBootstrap) {
        let bootstrapMetadata = config.bootstrapVersion === 3 ?
            require("../data/bootstrap-metadata/bootstrap-metadata.js") :
            require("../data/bootstrap-metadata/bootstrap4-metadata.js");

        return lessTemplateLoader.analyzeBootstrapTheme(config.themeName, config.colorScheme, metadata, bootstrapMetadata, config.data, config.bootstrapVersion);
    } else {
        if(config.items) {
            config.items.forEach(item => {
                for(let group in metadata) {
                    metadata[group].forEach(metadataItem => {
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
};

const buildTheme = config => {
    normalize(config);
    let metadataRepository = new MetadataRepository(new MetadataLoader());
    let repositoryPromise = metadataRepository.init(themes);

    return repositoryPromise.then(() => {
        let metadata = metadataRepository.getData({
            name: config.themeName,
            colorScheme: config.colorScheme
        });

        let version = metadataRepository.getVersion();

        return processTheme(config, metadata, version);
    });
};

module.exports = {
    buildTheme: buildTheme
};
