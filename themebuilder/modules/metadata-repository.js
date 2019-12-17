class MetadataRepository {
    constructor(metadataLoader) {
        this.repositoryData = {};
        this.metadataLoader = metadataLoader;
    }

    getDataItemByKey(key, theme) {
        let result = null;
        const themeData = this.repositoryData[theme.name + '-' + theme.colorScheme];

        for(let i = 0; i < themeData.length; i++) {
            if(themeData[i].Key === key) {
                result = themeData[i];
                break;
            }
        }

        return result;
    }

    init(themes) {
        let promises = [];

        themes.forEach(theme => {
            promises.push(new Promise(resolve => {
                this.metadataLoader
                    .load(theme.name, theme.colorScheme)
                    .then(metadata => {
                        this.repositoryData[theme.name + '-' + theme.colorScheme] = metadata;
                        resolve();
                    });
            }));
        });

        return Promise.all(promises);
    }

    getData(theme) {
        if(!theme) return this.repositoryData;
        return this.repositoryData[theme.name + '-' + theme.colorScheme];
    }

    updateData(data, theme) {
        data.forEach(item => {
            let dataItem = this.getDataItemByKey(item.key, theme);
            if(item) dataItem.Value = item.value;
        });
    }

    getVersion() {
        return this.metadataLoader.version();
    }
}

module.exports = MetadataRepository;
