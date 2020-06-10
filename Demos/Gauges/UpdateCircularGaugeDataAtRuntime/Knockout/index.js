window.onload = function() {
    var model = {
        items: dataSource,
        selected: ko.observable(dataSource[0]),
        value: ko.computed(function () {
            return model.selected().mean;
        }, null, { deferEvaluation: true }),
        subvalues: ko.computed(function () {
            return [model.selected().min, model.selected().max];
        }, null, { deferEvaluation: true })
    };
    
    ko.applyBindings(model, $("#gauge-demo").get(0));
};