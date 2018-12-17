var isCorrectStructure = function(data) {
    return Array.isArray(data) && data.every(function(item) {
        const hasTwoFields = Object.keys(item).length === 2;
        const hasCorrectFields = "key" in item && "items" in item;

        return hasTwoFields && hasCorrectFields && Array.isArray(item.items);
    });
};

module.exports = {
    _getSpecificDataSourceOption: function() {
        const groupKey = "key";
        let dataSource = this.option("dataSource");

        if(this._getGroupedOption() && isCorrectStructure(dataSource)) {
            dataSource = dataSource.reduce((accumulator, item) => {
                const items = item.items.map((innerItem) => {
                    if(!(groupKey in innerItem)) {
                        innerItem[groupKey] = item.key;
                    }
                    return innerItem;
                });
                return accumulator.concat(items);
            }, []);

            dataSource = {
                store: {
                    type: "array",
                    data: dataSource
                },
                group: "key"
            };
        };

        return dataSource;
    }
};
