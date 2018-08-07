var DATE_PARTS = [
    {
        name: "year",
        getter: "getFullYear"
    },
    {
        name: "month",
        getter: "getMonth"
    },
    {
        name: "day",
        getter: "getDate",
        defaultValue: 1
    },
    {
        name: "hours",
        getter: "getHours"
    },
    {
        name: "minutes",
        getter: "getMinutes"
    },
    {
        name: "seconds",
        getter: "getSeconds"
    }
];

exports.generateDate = function(config) {
    var hasFixedValue;
    var now = new Date();
    var parts = DATE_PARTS.map(function(part) {
        var result = config[part.name];

        if(result === undefined) {
            result = hasFixedValue ? part.defaultValue || 0 : now[part.getter]();
        } else {
            hasFixedValue = true;
        }

        return result;
    });

    return new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]);
};
