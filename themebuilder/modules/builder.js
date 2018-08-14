const MetadataLoader = require("../modules/metadata-loader.js");
const MetadataRepository = require("../modules/metadata-repository.js");
const LessTemplateLoader = require("../modules/less-template-loader.js");
const themes = require("../modules/themes.js");

const processTheme = (config, metadata, data, version) => {
    let lessTemplateLoader = new LessTemplateLoader(config, version);
    if(config.isBootstrap) {
        let bootstrapMetadata = config.bootstrapVersion === 3 ?
            require("../data/bootstrap-metadata/bootstrap-metadata.js") :
            require("../data/bootstrap-metadata/bootstrap4-metadata.js");

        return lessTemplateLoader.analyzeBootstrapTheme(config.themeName, config.colorScheme, metadata, bootstrapMetadata, data, config.bootstrapVersion);
    } else {
        let metadataJSON = JSON.parse(data);
        if(metadataJSON.items) {
            metadataJSON.items.forEach(item => {
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
}

const buildTheme = config => {
    let metadataRepository = new MetadataRepository(new MetadataLoader());
    let repositoryPromise = metadataRepository.init(themes);

    return Promise.all([config.metadataPromise, repositoryPromise]).then(resolves => {
        let data = resolves[0];

        let metadata = metadataRepository.getData({
            name: config.themeName,
            colorScheme: config.colorScheme
        });

        let version = metadataRepository.getVersion();

        return processTheme(config, metadata, data, version);
    });
}

module.exports = {
    buildTheme: buildTheme
};
