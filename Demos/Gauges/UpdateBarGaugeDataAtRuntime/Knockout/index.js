window.onload = function() {
    var color = ko.observable(colors[0]),
        values = ko.computed(function () {
            var code = Number("0x" + color().code.slice(1));
            return [
                (code >> 16) & 0xff,
                (code >> 8) & 0xff,
                code & 0xff
            ];        
        });
    
    ko.applyBindings({
        colors: colors,
        color: color,
        values: values
    }, $("#gauge-demo").get(0));
};