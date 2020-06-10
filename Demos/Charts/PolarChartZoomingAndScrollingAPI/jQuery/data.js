function generateData(start, end, step) {
    var data = [];
    for (var i = start; i < end; i += step) {
        var originalValue = Math.log(i);
        data.push({ value: originalValue - (Math.sin(Math.random() * i) * i / end) + (1 - Math.random() * 2), originalValue: originalValue, argument: i });
    }
    return data;
}

var dataSource = generateData(0, 360, 0.75);