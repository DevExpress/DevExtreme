const MetadataLoader = require('./metadata-loader.js');
const MetadataRepository = require('./metadata-repository.js');
const LessTemplateLoader = require('./less-template-loader.js');
const themes = require('./themes.js');
const normalize = require('./config-normalizer');

const processTheme = (config, metadata, version) => {
    const lessTemplateLoader = new LessTemplateLoader(config, version);
    if(config.isBootstrap) {
        const bootstrapMetadata = config.bootstrapVersion === 3 ?
            require('../data/bootstrap-metadata/bootstrap-metadata.js') :
            require('../data/bootstrap-metadata/bootstrap4-metadata.js');

        return lessTemplateLoader.analyzeBootstrapTheme(config.themeName, config.colorScheme, metadata, bootstrapMetadata, config.data, config.bootstrapVersion);
    } else {
        return lessTemplateLoader.load(config.themeName, config.colorScheme, metadata, config.items, config.widgets);
    }
};

const buildTheme = config => {
    normalize(config);
    const metadataRepository = new MetadataRepository(new MetadataLoader());
    const repositoryPromise = metadataRepository.init(themes);

    return repositoryPromise.then(() => {
        const metadata = metadataRepository.getData({
            name: config.themeName,
            colorScheme: config.colorScheme
        });

        const version = metadataRepository.getVersion();

        return processTheme(config, metadata, version);
    });
};

module.exports = {
    buildTheme: buildTheme
};
