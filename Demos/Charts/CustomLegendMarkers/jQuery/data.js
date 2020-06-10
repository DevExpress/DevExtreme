function generateData(start, end, step) {
    var data = [];
    for (var i = start; i < end; i += step) {
        var originalValue = Math.sin(i) / i;
        data.push({ value: originalValue + ((0.5 - Math.random()) / 10), originalValue: originalValue, argument: i });
    }
    return data;
}

var dataSource = generateData(2.5, 12, 0.1);
