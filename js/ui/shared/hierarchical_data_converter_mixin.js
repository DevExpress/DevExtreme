module.exports = {
    _getPlainDataMixin: function() {
        let dataSource = this.option("dataSource");

        if(this.option("grouped") && this._isCorrectStructure(dataSource)) {
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
    },

    _isCorrectStructure: function(data) {
        return Array.isArray(data) && data.every(function(item) {
            return Object.keys(item).length === 2 && "key" in item && "items" in item && Array.isArray(item.items);
        });
    }
};
