import { isObject } from '../../core/utils/type';

const isCorrectStructure = data => {
    return Array.isArray(data) && data.every(item => {
        const hasTwoFields = Object.keys(item).length === 2;
        const hasCorrectFields = 'key' in item && 'items' in item;

        return hasTwoFields && hasCorrectFields && Array.isArray(item.items);
    });
};

export default {
    _getSpecificDataSourceOption: function() {
        const groupKey = 'key';
        let dataSource = this.option('dataSource');
        let hasSimpleItems = false;
        let data = {};

        if(this._getGroupedOption() && isCorrectStructure(dataSource)) {
            data = dataSource.reduce((accumulator, item) => {
                const items = item.items.map(innerItem => {
                    if(!isObject(innerItem)) {
                        innerItem = { text: innerItem };
                        hasSimpleItems = true;
                    }

                    if(!(groupKey in innerItem)) {
                        innerItem[groupKey] = item.key;
                    }

                    return innerItem;
                });
                return accumulator.concat(items);
            }, []);

            dataSource = {
                store: {
                    type: 'array',
                    data
                },
                group: { selector: 'key', keepInitialKeyOrder: true }
            };

            if(hasSimpleItems) {
                dataSource.searchExpr = 'text';
            }
        }

        return dataSource;
    }
};
