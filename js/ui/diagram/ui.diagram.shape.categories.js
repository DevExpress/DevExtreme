import { getDiagram } from './diagram_importer';

const ShapeCategories = {
    load: function(showCustomShapes) {
        const ShapeCategory = getDiagram().ShapeCategory;
        var result = [
            {
                category: ShapeCategory.General,
                title: 'General'
            },
            {
                category: ShapeCategory.Flowchart,
                title: 'Flow Chart'
            }
        ];
        if(showCustomShapes) {
            result.push({
                category: ShapeCategory.Custom,
                title: 'Custom'
            });
        }
        return result;
    }
};

module.exports = ShapeCategories;
