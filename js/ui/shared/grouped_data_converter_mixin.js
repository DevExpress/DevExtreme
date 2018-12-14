var isCorrectStructure = function(data) {
    return Array.isArray(data) && data.every(function(item) {
        var hasTwoFields = Object.keys(item).length === 2,
            hasCorrectFields = "key" in item && "items" in item;

        return hasTwoFields && hasCorrectFields && Array.isArray(item.items);
    });
};

module.exports = {
    _getSpecificDataSourceOption: function() {
        let dataSource = this.option("dataSource");

        if(this._getGroupedOption() && isCorrectStructure(dataSource)) {
            dataSource = dataSource.reduce((accumulator, item) => {
                const items = item.items.map((innerItem) => {
                    return Object.assign({ key: item.key }, innerItem);
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
