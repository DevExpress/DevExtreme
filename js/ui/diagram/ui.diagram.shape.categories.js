const ShapeCategories = {
    load: function(showCustomShapes) {
        var result = [
            {
                category: "General",
                title: 'General'
            },
            {
                category: "Flowchart",
                title: 'Flow Chart'
            },
            {
                category: "Containers",
                title: 'Containers'
            }
        ];
        if(showCustomShapes) {
            result.push({
                category: "Custom",
                title: 'Custom'
            });
        }
        return result;
    }
};

module.exports = ShapeCategories;
