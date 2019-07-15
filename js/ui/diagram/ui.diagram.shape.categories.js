import { getDiagram } from "./diagram_importer";

const ShapeCategories = {
    load: function(showCustomShapes) {
        const ShapeCategories = getDiagram().ShapeCategories;
        var result = [
            {
                category: ShapeCategories.General,
                title: 'General'
            },
            {
                category: ShapeCategories.Flowchart,
                title: 'Flow Chart'
            },
            {
                category: ShapeCategories.Containers,
                title: 'Containers'
            }
        ];
        if(showCustomShapes) {
            result.push({
                category: ShapeCategories.Custom,
                title: 'Custom'
            });
        }
        return result;
    }
};

module.exports = ShapeCategories;
